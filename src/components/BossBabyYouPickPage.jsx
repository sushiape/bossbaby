import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { supabase, SUGGESTIONS_TABLE, VOTES_TABLE, isSupabaseConfigured } from "../lib/supabaseClient";

const brand = {
  pink: "#FF89CC",
  lightPink: "#FFE3F2",
  bg: "#FFD2E9",
  text: "#1f1f1f",
};

const Container = ({ children, className = "" }) => (
  <div className={`max-w-[1100px] mx-auto px-4 sm:px-6 ${className}`}>{children}</div>
);

const defaultOptions = {
  pack: [
    "100 ml PET · A concentrated daily shot",
    "250 ml PET · A small functional drink",
    "200 ml Can · Cute, compact, concentrated",
    "250 ml Can · More to sip, still sleek",
  ],
  flavour: ["Mixed Berries", "Mango Peach", "Blueberry Coconut", "Vanilla Cream"],
};

// largest-remainder rounding so the bars in a category add up to exactly 100
function toPercentages(values) {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (!total) return values.map(() => 0);

  const exact = values.map((value) => (value / total) * 100);
  const percents = exact.map((value) => Math.floor(value));
  const leftover = 100 - percents.reduce((sum, value) => sum + value, 0);
  const byRemainder = exact
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((left, right) => right.remainder - left.remainder);

  for (let i = 0; i < leftover; i += 1) {
    percents[byRemainder[i % byRemainder.length].index] += 1;
  }

  return percents;
}

const VOTES_KEY = "youPickVotes";
const USER_KEY = "youPickUserId";
const SUGGESTIONS_KEY = "youPickSuggestions";

function getStoredVotes() {
  try {
    return JSON.parse(localStorage.getItem(VOTES_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function getUserId() {
  let id = localStorage.getItem(USER_KEY);
  if (!id) {
    id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
    localStorage.setItem(USER_KEY, id);
  }
  return id;
}

function getMaterialFromPack(label) {
  if (!label) return '';
  if (label.toLowerCase().includes('pet')) return 'PET (plastic)';
  if (label.toLowerCase().includes('slim') || label.toLowerCase().includes('can')) return 'Aluminium';
  return '';
}

function formatSuggestionTimestamp(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function normalizeSuggestion(item, currentUserId) {
  const authorName = item.author_name || item.authorName || item.author || "You";
  return {
    id: item.id,
    text: item.text,
    author: authorName,
    authorName,
    canRemove: item.user_id ? item.user_id === currentUserId : item.canRemove !== false,
    createdAt: item.created_at || item.createdAt || item.id,
    userId: item.user_id || item.userId || currentUserId,
  };
}

export default function BossBabyYouPickPage({ currentPage, setCurrentPage }) {
  const [selections, setSelections] = useState({ pack: [], flavour: [] });
  const [otherComment, setOtherComment] = useState("");
  const [votes, setVotes] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [suggestionAuthor, setSuggestionAuthor] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [authUserId, setAuthUserId] = useState(null);
  const [authReady, setAuthReady] = useState(!supabase);
  const [authError, setAuthError] = useState("");
  const [voteError, setVoteError] = useState("");
  const [suggestionError, setSuggestionError] = useState("");
  const [isVoteSubmitting, setIsVoteSubmitting] = useState(false);
  const [isSuggestionSubmitting, setIsSuggestionSubmitting] = useState(false);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  const localUserId = useState(() => (!supabase ? getUserId() : null))[0];
  const currentUserId = supabase ? authUserId : localUserId;

  useEffect(() => {
    if (!supabase) return;

    let cancelled = false;

    const bootAnonymousAuth = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        let session = sessionData?.session || null;
        if (!session) {
          const { data, error: signInError } = await supabase.auth.signInAnonymously();
          if (signInError) throw signInError;
          session = data?.session || null;
        }

        if (!cancelled) {
          setAuthUserId(session?.user?.id || null);
          setAuthReady(true);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setAuthError("Anonymous sign-in failed. Refresh to try again.");
          setAuthReady(true);
        }
      }
    };

    bootAnonymousAuth();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) {
        setAuthUserId(session?.user?.id || null);
        setAuthReady(true);
      }
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (supabase && (!authReady || !currentUserId)) return;

    const loadData = async () => {
      setIsSuggestionsLoading(true);
      if (supabase) {
        try {
          const { data: suggestionData, error: suggestionError } = await supabase
            .from(SUGGESTIONS_TABLE)
            .select('id, user_id, text, author_name, created_at')
            .order('created_at', { ascending: false })
            .limit(50);

          if (suggestionError) throw suggestionError;
          setSuggestions((suggestionData || []).map((item) => normalizeSuggestion(item, currentUserId)));

          const { data: voteData, error: voteError } = await supabase
            .from(VOTES_TABLE)
            .select('id, poll_id, user_id, selections, other_comment, created_at');

          if (voteError) throw voteError;

          const mappedVotes = (voteData || []).map((r) => ({
            userId: r.user_id,
            ts: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
            selections: r.selections || { pack: [], flavour: [] },
            otherComment: r.other_comment || null,
          }));

          setVotes(mappedVotes);
          setHasVoted(mappedVotes.some((x) => x.userId === currentUserId));
          setIsSuggestionsLoading(false);
          return;
        } catch (err) {
          console.error(err);
          setSuggestions([]);
          setVotes([]);
          setHasVoted(false);
          setIsSuggestionsLoading(false);
          return;
        }
      }

      try {
        const storedVotes = getStoredVotes();
        setVotes(storedVotes);
        setHasVoted(storedVotes.some((x) => x.userId === currentUserId));

        const storedSuggestions = JSON.parse(localStorage.getItem(SUGGESTIONS_KEY) || "[]");
        const normalizedSuggestions = storedSuggestions.map((item) => normalizeSuggestion(item, currentUserId));
        setSuggestions(normalizedSuggestions);
        setIsSuggestionsLoading(false);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
        setVotes([]);
        setIsSuggestionsLoading(false);
      }
    };

    loadData();
  }, [authReady, currentUserId]);

  useEffect(() => {
    if (!supabase || !currentUserId) return;

    const channel = supabase
      .channel('youpick-suggestions-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: SUGGESTIONS_TABLE },
        async () => {
          try {
            const { data, error } = await supabase
              .from(SUGGESTIONS_TABLE)
              .select('id, user_id, text, author_name, created_at')
              .order('created_at', { ascending: false })
              .limit(50);

            if (error) throw error;
            setSuggestions((data || []).map((item) => normalizeSuggestion(item, currentUserId)));
          } catch (error) {
            console.error('Supabase realtime refresh error', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  const toggleChoice = (category, value) => {
    setSelections((prev) => {
      // single-choice for pack
      if (category === "pack") {
        const already = prev[category] && prev[category][0] === value;
        return { ...prev, [category]: already ? [] : [value] };
      }
      const arr = new Set(prev[category]);
      if (arr.has(value)) arr.delete(value);
      else arr.add(value);
      return { ...prev, [category]: Array.from(arr) };
    });
  };

  const submitVote = (e) => {
    e.preventDefault();
    setVoteError("");
    if (supabase && !currentUserId) {
      setVoteError("We couldn't save your vote. Please try again 💗");
      return;
    }

    const payload = {
      poll_id: 'default',
      user_id: currentUserId,
      selections,
      other_comment: otherComment.trim() || null,
    };

    if (supabase) {
      (async () => {
        setIsVoteSubmitting(true);
        try {
          // upsert to ensure a single vote per (poll_id, user_id)
          await supabase.from(VOTES_TABLE).upsert([payload], { onConflict: 'poll_id,user_id' });
          const { data: voteData, error: voteError } = await supabase.from(VOTES_TABLE).select('id, poll_id, user_id, selections, other_comment, created_at');
          if (voteError) throw voteError;
          const mapped = (voteData || []).map((r) => ({
            userId: r.user_id,
            ts: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
            selections: r.selections || { pack: [], flavour: [] },
            otherComment: r.other_comment || null,
          }));
          setVotes(mapped);
          setHasVoted(mapped.some((x) => x.userId === currentUserId));
        } catch (err) {
          console.error('Supabase vote submit error', err);
          setVoteError("We couldn't save your vote. Please try again 💗");
        } finally {
          setIsVoteSubmitting(false);
        }
      })();
      return;
    }

    // fallback when supabase not configured: keep localStorage behavior
    const current = getStoredVotes().filter((x) => x.userId !== currentUserId);
    const localPayload = {
      userId: currentUserId,
      ts: Date.now(),
      selections,
      otherComment: otherComment.trim() || null,
    };
    const updated = [...current, localPayload];
    localStorage.setItem(VOTES_KEY, JSON.stringify(updated));
    setVotes(updated);
    setHasVoted(true);
  };

  const changeVote = () => {
    setHasVoted(false);
  };

  const tally = (cat) => {
    const rows = cat === 'flavour' ? [...defaultOptions.flavour, "Other"] : defaultOptions[cat];
    const counts = {};
    rows.forEach((row) => {
      counts[row] = 0;
    });

    votes.forEach((v) => {
      (v.selections[cat] || []).forEach((s) => {
        if (s in counts) counts[s] += 1;
      });
      if (cat === 'flavour' && v.otherComment) counts["Other"] += 1;
    });

    const values = toPercentages(rows.map((row) => counts[row]));
    const percents = {};
    rows.forEach((row, index) => {
      percents[row] = values[index];
    });

    return { counts, percents };
  };

  const submitSuggestion = (e) => {
    e.preventDefault();
    setSuggestionError("");
    if (!suggestion.trim()) return;
    const author = suggestionAuthor.trim();
    if (!author) {
      alert("Please add your name before sending.");
      return;
    }
    try {
      if (supabase) {
        if (!currentUserId) {
          setSuggestionError("Please wait while we sign you in anonymously.");
          return;
        }

        (async () => {
          setIsSuggestionSubmitting(true);
          try {
            const { error } = await supabase.from(SUGGESTIONS_TABLE).insert({
            text: suggestion.trim(),
            author_name: author,
            user_id: currentUserId,
            });

            if (error) throw error;

            const { data } = await supabase
              .from(SUGGESTIONS_TABLE)
              .select("id, user_id, text, author_name, created_at")
              .order("created_at", { ascending: false })
              .limit(50);

            setSuggestions((data || []).map((item) => normalizeSuggestion(item, currentUserId)));
            setSuggestion("");
            setSuggestionAuthor("");
            alert("Thanks — suggestion saved and shared.");
          } catch (err) {
            console.error(err);
            setSuggestionError("Could not save suggestion. Please try again.");
          } finally {
            setIsSuggestionSubmitting(false);
          }
        })();
        return;
      }

      const cur = JSON.parse(localStorage.getItem(SUGGESTIONS_KEY) || "[]");
      cur.unshift({
        id: Date.now(),
        text: suggestion.trim(),
        author,
        authorName: author,
        canRemove: true,
        createdAt: Date.now(),
        userId: currentUserId,
      });
      localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(cur));
      setSuggestions(cur);
      setSuggestion("");
      setSuggestionAuthor("");
      alert("Thanks — suggestion saved locally.");
    } catch (err) {
      console.error(err);
      if (supabase) {
        setSuggestionError("Could not save suggestion. Please try again.");
      }
    }
  };

  const removeSuggestion = (id) => {
    try {
      if (supabase) {
        if (!currentUserId) return;

        supabase
          .from(SUGGESTIONS_TABLE)
          .delete()
          .eq("id", id)
          .eq("user_id", currentUserId)
          .then(({ error }) => {
            if (error) throw error;

            setSuggestions((prev) => prev.filter((item) => item.id !== id));
          })
          .catch((err) => {
            console.error(err);
          });
        return;
      }

      const cur = JSON.parse(localStorage.getItem(SUGGESTIONS_KEY) || "[]");
      const next = cur.filter((item) => item.id !== id);
      localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(next));
      setSuggestions(next);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: brand.bg, fontFamily: "Poppins, sans-serif", color: brand.text }}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <section className="py-20 px-4">
        <Container>
          <div className="max-w-[900px] mx-auto text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ fontWeight: 800 }}>
                    You pick. We make.
            </h1>
                  <p className="text-sm text-gray-700">Design the next BIG thing with us.</p>
              {authError && <p className="mt-3 text-sm text-red-700">{authError}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#ffeaf4" }}>
              <h3 className="font-extrabold mb-3">Vote</h3>

              {!hasVoted ? (
                <form onSubmit={submitVote} className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold mb-2">Pack (choose one)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {defaultOptions.pack.map((p) => {
                        const sel = selections.pack.includes(p);
                        return (
                          <button key={p} type="button" onClick={() => toggleChoice("pack", p)} className={`text-left p-3 rounded-2xl border ${sel ? "bg-black text-white" : "bg-[#fffdfd]"}`}>
                            <div className="flex items-center justify-between">
                              <div className="font-semibold">{p.split('·')[0].trim()}</div>
                              <span className={`text-xs px-3 py-1 rounded-full min-w-[86px] text-center ${sel ? 'bg-white/10 text-white border border-white/20' : 'bg-white text-gray-800 border border-gray-200'}`}>{getMaterialFromPack(p)}</span>
                            </div>
                            <div className={`text-xs mt-1 ${sel ? 'text-gray-200' : 'text-gray-700'}`}>{p.split('·')[1] ? p.split('·')[1].trim() : ''}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">Flavour (choose any)</p>
                    <div className="flex gap-2 flex-wrap">
                      {defaultOptions.flavour.map((s) => (
                        <button type="button" key={s} onClick={() => toggleChoice("flavour", s)} className={`px-3 py-2 rounded-full border ${selections.flavour.includes(s) ? "bg-black text-white" : "bg-[#fffdfd]"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">Other (optional)</p>
                    <input value={otherComment} onChange={(e) => setOtherComment(e.target.value)} placeholder="Add a note or idea" className="w-full rounded-full border px-4 py-2 text-sm" />
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" disabled={isVoteSubmitting} className="rounded-full px-5 py-2 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed" style={{ backgroundColor: brand.pink }}>
                      {isVoteSubmitting ? 'Saving...' : 'Submit vote'}
                    </button>
                    <button type="button" onClick={() => { setSelections({ pack: [], flavour: [] }); setOtherComment(""); }} className="rounded-full px-4 py-2 border text-sm disabled:opacity-60 disabled:cursor-not-allowed" disabled={isVoteSubmitting}>
                      Reset
                    </button>
                  </div>
                  {voteError && <p className="text-sm text-red-700">{voteError}</p>}
                </form>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-3">Thank you. Your vote is counted. ✨ Changed your mind? Vote again.</p>
                  <button onClick={changeVote} className="rounded-full px-4 py-2 border text-sm">Change my vote</button>
                </div>
              )}
            </div>

            <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#ffeaf4" }}>
              <h3 className="font-extrabold mb-3">Live results</h3>

              <div className="space-y-4">
                {['pack', 'flavour'].map((cat) => {
                  const { percents } = tally(cat);
                  const options = defaultOptions[cat];
                  return (
                    <div key={cat}>
                      <p className="text-sm font-semibold mb-2">{cat === 'pack' ? 'Bottle type' : 'Flavour'}</p>
                      <div className="space-y-2">
                        {options.map((opt) => {
                          const pct = percents[opt] || 0;
                          if (cat === 'pack') {
                            const title = opt.split('·')[0].trim();
                            const subtitle = opt.split('·')[1] ? opt.split('·')[1].trim() : '';
                            const material = getMaterialFromPack(opt);
                            return (
                              <div key={opt} className="flex items-center gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold">{title}</div>
                                    <span className="text-xs px-3 py-1 rounded-full min-w-[86px] text-center bg-white text-gray-800 border border-gray-200">{material}</span>
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">{subtitle}</div>
                                  <div className="h-2 bg-[#f1f1f1] rounded overflow-hidden mt-2">
                                    <div style={{ width: `${pct}%` }} className="h-2 bg-black" />
                                  </div>
                                </div>
                                <div className="text-xs w-16 text-right">{pct}%</div>
                              </div>
                            );
                          }
                          return (
                            <div key={opt} className="flex items-center gap-3">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="text-sm font-semibold">{opt}</div>
                                  <div className="text-xs text-gray-500">{pct}%</div>
                                </div>
                                <div className="h-2 bg-[#f1f1f1] rounded overflow-hidden">
                                  <div style={{ width: `${pct}%` }} className="h-2 bg-black" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {cat === 'flavour' && (
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div className="text-sm font-semibold">Others</div>
                                <div className="text-xs text-gray-500">{percents['Other'] || 0}%</div>
                              </div>
                              <div className="h-2 bg-[#f1f1f1] rounded overflow-hidden">
                                <div style={{ width: `${percents['Other'] || 0}%` }} className="h-2 bg-black" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border bg-white p-6" style={{ borderColor: "#ffeaf4" }}>
            <h3 className="font-extrabold mb-3">Suggest a flavour or idea</h3>
            <form onSubmit={submitSuggestion} className="flex gap-3">
              <div className="flex-1 grid gap-3 sm:grid-cols-[1fr_150px] sm:items-center">
                <input value={suggestion} onChange={(e) => setSuggestion(e.target.value)} placeholder="Share an idea" className="w-full rounded-full border px-4 py-2 text-sm" />
                <input value={suggestionAuthor} onChange={(e) => setSuggestionAuthor(e.target.value)} placeholder="Your name" className="w-full rounded-full border px-4 py-2 text-sm sm:max-w-[150px]" />
              </div>
              <button disabled={isSuggestionSubmitting} className="rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed" style={{ backgroundColor: brand.pink }}>
                {isSuggestionSubmitting ? 'Sending...' : 'Send'}
              </button>
            </form>
            {suggestionError && <p className="mt-3 text-sm text-red-700">{suggestionError}</p>}
          </div>

          <div className="mt-6 rounded-2xl border bg-white p-6" style={{ borderColor: "#ffeaf4" }}>
            <h3 className="font-extrabold mb-3">Latest suggestions</h3>
            {isSupabaseConfigured && (
              <p className="text-xs text-gray-500 mb-3">Shared feed connected. You should now see comments from other users here.</p>
            )}
            {isSuggestionsLoading ? (
              <p className="text-sm text-gray-600">Loading suggestions…</p>
            ) : suggestions.length ? (
              <div className="space-y-3">
                {suggestions.slice(0, 6).map((item) => (
                  <div key={item.id} className="rounded-2xl border px-4 py-3" style={{ borderColor: "#f4ddea", backgroundColor: "#fffdfd" }}>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.authorName || item.author || 'Anonymous'}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">{formatSuggestionTimestamp(item.createdAt || item.id)}</p>
                        {item.canRemove !== false && (
                          <button type="button" onClick={() => removeSuggestion(item.id)} className="text-xs font-semibold text-pink-600 hover:underline">
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-800">{item.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No suggestions yet. Be the first to drop one.</p>
            )}
          </div>
        </Container>
      </section>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
