import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

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

export default function BossBabyYouPickPage({ currentPage, setCurrentPage }) {
  const [selections, setSelections] = useState({ pack: [], flavour: [] });
  const [otherComment, setOtherComment] = useState("");
  const [votes, setVotes] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  const userId = getUserId();

  useEffect(() => {
    const v = getStoredVotes();
    setVotes(v);
    setHasVoted(v.some((x) => x.userId === userId));
  }, []);

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
    const current = getStoredVotes().filter((x) => x.userId !== userId);
    const payload = {
      userId,
      ts: Date.now(),
      selections,
      otherComment: otherComment.trim() || null,
    };
    const updated = [...current, payload];
    localStorage.setItem(VOTES_KEY, JSON.stringify(updated));
    setVotes(updated);
    setHasVoted(true);
  };

  const changeVote = () => {
    setHasVoted(false);
  };

  const tally = (cat) => {
    const counts = {};
    votes.forEach((v) => {
      (v.selections[cat] || []).forEach((s) => {
        counts[s] = (counts[s] || 0) + 1;
      });
      if (v.otherComment) counts["Other"] = (counts["Other"] || 0) + 1;
    });
    const total = votes.length || 1;
    return { counts, total };
  };

  const submitSuggestion = (e) => {
    e.preventDefault();
    if (!suggestion.trim()) return;
    try {
      const cur = JSON.parse(localStorage.getItem(SUGGESTIONS_KEY) || "[]");
      cur.unshift({ id: Date.now(), text: suggestion.trim() });
      localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(cur));
      setSuggestion("");
      alert("Thanks — suggestion saved locally.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: brand.bg, fontFamily: "Poppins, sans-serif", color: brand.text }}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <section className="py-20 px-4">
        <Container>
          <div className="max-w-[900px] mx-auto text-center mb-8">
                  <p className="inline-block rounded-full px-4 py-2 text-sm font-semibold mb-4" style={{ backgroundColor: brand.lightPink, color: brand.text }}>
                    It's Your Call, Babe.
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ fontWeight: 800 }}>
                It's Your Call, Babe.
            </h1>
            <p className="text-sm text-gray-700">Answer a quick question about pack and flavour. You can change your answers anytime.</p>
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
                    <button type="submit" className="rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: brand.pink }}>
                      Submit vote
                    </button>
                    <button type="button" onClick={() => { setSelections({ pack: [], flavour: [] }); setOtherComment(""); }} className="rounded-full px-4 py-2 border text-sm">
                      Reset
                    </button>
                  </div>
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
                  const { counts, total } = tally(cat);
                  const options = defaultOptions[cat];
                  return (
                    <div key={cat}>
                      <p className="text-sm font-semibold mb-2">{cat === 'pack' ? 'Pack' : 'Flavour'}</p>
                      <div className="space-y-2">
                        {options.map((opt) => {
                          const count = counts[opt] || 0;
                          const pct = Math.round((count / total) * 100);
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
                                <div className="h-2 bg-[#f1f1f1] rounded overflow-hidden">
                                  <div style={{ width: `${pct}%` }} className="h-2 bg-black" />
                                </div>
                              </div>
                              <div className="text-xs w-16 text-right">{pct}%</div>
                            </div>
                          );
                        })}
                        {/* Other */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="h-2 bg-[#f1f1f1] rounded overflow-hidden">
                              <div style={{ width: `${Math.round(((counts['Other'] || 0) / total) * 100)}%` }} className="h-2 bg-black" />
                            </div>
                          </div>
                          <div className="text-xs w-16 text-right">{Math.round(((counts['Other'] || 0) / total) * 100)}%</div>
                        </div>
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
              <input value={suggestion} onChange={(e) => setSuggestion(e.target.value)} placeholder="Share an idea" className="flex-1 rounded-full border px-4 py-2 text-sm" />
              <button className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: brand.pink }}>Send</button>
            </form>
          </div>
        </Container>
      </section>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
