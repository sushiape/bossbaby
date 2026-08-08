#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_URL/SUPABASE_ANON_KEY).');
  process.exit(1);
}

const supabase = createClient(url, key);
const pollId = 'default';

async function run() {
  const { data: anonAuth, error: anonAuthError } = await supabase.auth.signInAnonymously();
  if (anonAuthError) throw anonAuthError;

  const userId = anonAuth?.user?.id;
  if (!userId) throw new Error('Anonymous auth did not return a user id.');

  console.log('Using anonymous user_id:', userId);

  console.log('\n1) Insert suggestion');
  const { data: sug, error: sugErr } = await supabase
    .from('suggestions')
    .insert([{ text: 'Test suggestion from script', author_name: 'Tester', user_id: userId }])
    .select()
    .single();
  if (sugErr) console.error('Suggestion insert error:', sugErr);
  else console.log('Inserted suggestion:', sug);

  console.log('\n2) Fetch latest suggestions');
  const { data: suggestions, error: listErr } = await supabase
    .from('suggestions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  if (listErr) console.error('Suggestions list error:', listErr);
  else console.log('Latest suggestions:', suggestions);

  console.log('\n3) Upsert vote (one per client_id/poll_id)');
  const votePayload = {
    poll_id: pollId,
    user_id: userId,
    selections: { pack: ['100 ml PET · A concentrated daily shot'], flavour: ['Mixed Berries'] },
    other_comment: 'script test',
  };

  const { data: voteUpsert, error: voteErr } = await supabase
    .from('youpick_votes')
    .upsert([votePayload], { onConflict: 'poll_id,user_id' })
    .select()
    .single();
  if (voteErr) console.error('Vote upsert error:', voteErr);
  else console.log('Upserted vote:', voteUpsert);

  console.log('\n4) Fetch latest votes');
  const { data: votes, error: votesErr } = await supabase
    .from('youpick_votes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  if (votesErr) console.error('Votes list error:', votesErr);
  else console.log('Latest votes:', votes);

  console.log('\nDone.');
}

run().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
