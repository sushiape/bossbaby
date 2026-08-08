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
  shape: ["PET bottles", "Aluminium cans"],
  size: ["100ml", "250ml", "330ml", "500ml"],
  flavour: ["Matcha Mint", "Sunrise Guava", "Cacao Calm"],
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

export default function BossBabyYouPickPage({ currentPage, setCurrentPage }) {
  const [selections, setSelections] = useState({ shape: [], size: [], flavour: [] });
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
      // single-choice for shape and size
      if (category === "shape" || category === "size") {
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
            <p className="text-sm text-gray-700">Answer a few quick questions about bottle shape, size, and flavour. You can change your answers anytime.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#ffeaf4" }}>
              <h3 className="font-extrabold mb-3">Vote</h3>

              {!hasVoted ? (
                <form onSubmit={submitVote} className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold mb-2">Bottle type (choose one)</p>
                    <div className="flex gap-2 flex-wrap">
                      {defaultOptions.shape.map((s) => (
                        <button type="button" key={s} onClick={() => toggleChoice("shape", s)} className={`px-3 py-2 rounded-full border ${selections.shape.includes(s) ? "bg-black text-white" : "bg-[#fffdfd]"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">Size (choose one)</p>
                    <div className="flex gap-2 flex-wrap">
                      {defaultOptions.size.map((s) => (
                        <button type="button" key={s} onClick={() => toggleChoice("size", s)} className={`px-3 py-2 rounded-full border ${selections.size.includes(s) ? "bg-black text-white" : "bg-[#fffdfd]"}`}>
                          {s}
                        </button>
                      ))}
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
                    <button type="button" onClick={() => { setSelections({ shape: [], size: [], flavour: [] }); setOtherComment(""); }} className="rounded-full px-4 py-2 border text-sm">
                      Reset
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-3">Thanks — your vote is counted. You can change it later.</p>
                  <button onClick={changeVote} className="rounded-full px-4 py-2 border text-sm">Change my vote</button>
                </div>
              )}
            </div>

            <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#ffeaf4" }}>
              <h3 className="font-extrabold mb-3">Live results</h3>

              <div className="space-y-4">
                {(["shape", "size", "flavour"]).map((cat) => {
                  const { counts, total } = tally(cat);
                  const options = defaultOptions[cat];
                  return (
                    <div key={cat}>
                      <p className="text-sm font-semibold capitalize mb-2">{cat}</p>
                      <div className="space-y-2">
                        {options.map((opt) => {
                          const count = counts[opt] || 0;
                          const pct = Math.round((count / total) * 100);
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
                              <div style={{ width: `${Math.round(((counts["Other"] || 0) / total) * 100)}%` }} className="h-2 bg-black" />
                            </div>
                          </div>
                          <div className="text-xs w-16 text-right">{Math.round(((counts["Other"] || 0) / total) * 100)}%</div>
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
