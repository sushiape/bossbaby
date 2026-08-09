#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_URL/SUPABASE_ANON_KEY).');
  process.exit(1);
}

const baseClient = createClient(url, key);
const pollId = 'default';

async function signInAnonymously(client) {
  const { data, error } = await client.auth.signInAnonymously();
  if (error) throw error;
  const userId = data?.user?.id;
  if (!userId) throw new Error('Anonymous auth did not return a user id.');
  return userId;
}

async function run() {
  const ownerId = await signInAnonymously(baseClient);
  console.log('Using anonymous user_id:', ownerId);

  const otherClient = createClient(url, key);
  const otherId = await signInAnonymously(otherClient);
  console.log('Secondary anonymous user_id:', otherId);

  console.log('\n1) Insert suggestion');
  const { data: sug, error: sugErr } = await baseClient
    .from('suggestions')
    .insert([{ text: 'Test suggestion from script', author_name: 'Tester', user_id: ownerId }])
    .select()
    .single();
  if (sugErr) throw sugErr;
  console.log('Inserted suggestion:', sug);

  console.log('\n2) Fetch latest suggestions');
  const { data: suggestions, error: listErr } = await baseClient
    .from('suggestions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  if (listErr) throw listErr;
  console.log('Latest suggestions:', suggestions);

  console.log('\n3) RLS ownership check - other user update should fail');
  const { data: unauthorizedUpdateData, error: unauthorizedUpdateErr } = await otherClient
    .from('suggestions')
    .update({ text: 'should not be allowed' })
    .eq('id', sug.id)
    .select('*');
  if (unauthorizedUpdateErr) {
    console.log('Ownership check result:', unauthorizedUpdateErr.message);
  } else if ((unauthorizedUpdateData || []).length === 0) {
    console.log('Ownership check result: no rows updated (expected for a different owner)');
  } else {
    throw new Error(`Expected unauthorized update to fail, but got: ${JSON.stringify(unauthorizedUpdateData)}`);
  }

  console.log('\n4) Upsert vote (one per poll_id/user_id)');
  const votePayload = {
    poll_id: pollId,
    user_id: ownerId,
    selections: { pack: ['100 ml Bottle · A concentrated daily shot'], flavour: ['Mixed Berries'] },
    other_comment: 'script test',
  };

  const { data: voteUpsert, error: voteErr } = await baseClient
    .from('youpick_votes')
    .upsert([votePayload], { onConflict: 'poll_id,user_id' })
    .select()
    .single();
  if (voteErr) throw voteErr;
  console.log('Upserted vote:', voteUpsert);

  console.log('\n4b) Update vote to confirm single-row upsert');
  const updatedVotePayload = {
    poll_id: pollId,
    user_id: ownerId,
    selections: { pack: ['250 ml Can · More to sip, still sleek'], flavour: ['Mango Peach', 'Vanilla Cream'] },
    other_comment: 'updated script test',
  };

  const { data: voteUpdate, error: voteUpdateErr } = await baseClient
    .from('youpick_votes')
    .upsert([updatedVotePayload], { onConflict: 'poll_id,user_id' })
    .select()
    .single();
  if (voteUpdateErr) throw voteUpdateErr;
  console.log('Updated vote:', voteUpdate);

  console.log('\n5) Fetch latest votes');
  const { data: votes, error: votesErr } = await baseClient
    .from('youpick_votes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  if (votesErr) throw votesErr;
  console.log('Latest votes:', votes);

  const { data: ownVotes, error: ownVotesErr } = await baseClient
    .from('youpick_votes')
    .select('*')
    .eq('poll_id', pollId)
    .eq('user_id', ownerId);
  if (ownVotesErr) throw ownVotesErr;
  console.log(`Own vote rows for (${pollId}, ${ownerId}):`, ownVotes?.length || 0);
  console.log('Own vote row:', ownVotes?.[0] || null);

  console.log('\n6) Realtime suggestions check');
  let realtimeEvent = null;
  const channel = otherClient.channel('youpick-realtime-check');
  const realtimeEventPromise = new Promise((resolve) => {
    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'suggestions' }, (payload) => {
      realtimeEvent = payload;
      console.log('Realtime event received:', payload);
      resolve(payload);
    });
  });

  await new Promise((resolve, reject) => {
    channel.subscribe((status, err) => {
      if (err) reject(err);
      else if (status === 'SUBSCRIBED') resolve();
    });
  });

  const { error: insertRealtimeError } = await baseClient
    .from('suggestions')
    .insert([{ text: 'Realtime test suggestion', author_name: 'Realtime Tester', user_id: ownerId }])
    .select();
  if (insertRealtimeError) throw insertRealtimeError;

  const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 5000));
  const eventPayload = await Promise.race([realtimeEventPromise, timeoutPromise]);
  console.log('Realtime received:', Boolean(eventPayload));

  await otherClient.removeChannel(channel);

  console.log('\nDone.');
}

run().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
