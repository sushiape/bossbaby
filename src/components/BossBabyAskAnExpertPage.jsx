import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const brand = {
  pink: "#FF89CC",
  lightPink: "#FFE3F2",
  bg: "#FFD2E9",
  text: "#1f1f1f",
  muted: "#6b7280",
  white: "#fff",
  border: "#f1f1f1",
};

const Container = ({ children, className = "" }) => (
  <div className={`max-w-[1100px] mx-auto px-4 sm:px-6 ${className}`}>{children}</div>
);

const expertConversation = [
  {
    title: "Magnesium",
    text: "Magnesium supports core physiology in energy metabolism, protein synthesis, neuromuscular function, and ion transport. There is strong support for migraine prevention, less pregnancy-related hospitalisations, and some evidence for lowering inflammatory markers. Higher dosages can even decrease the risk of type-2 diabetes if you are at risk.",
  },
  {
    title: "Guarana",
    text: "Guarana contains caffeine, which gives you more energy per mg than an espresso shot. It also contains plenty of bioavailable antioxidants that help clean your system of harmful compounds that cause DNA damage. In addition, guarana has shown promising effects in reducing inflammation.",
  },
  {
    title: "Vitamin B6",
    text: "Vitamin B6 and its metabolites are essential for the functioning of the nervous system, acting as a coenzyme for metabolic reactions that are crucial for the synthesis of neurotransmitters such as GABA, dopamine, norepinephrine, and serotonin.",
  },
  {
    title: "Vitamin B12",
    text: "Vitamin B12 can improve low mood and depression symptoms in people with normal blood-range B12 levels, and it is especially important when taking medication or after a disease that changes the gut.",
  },
];

const exampleQuestions = [
  {
    question: "What does magnesium actually do for my body?",
    answer: expertConversation[0].text,
    title: expertConversation[0].title,
  },
  {
    question: "Why is guarana mentioned in energy blends?",
    answer: expertConversation[1].text,
    title: expertConversation[1].title,
  },
  {
    question: "How does vitamin B6 support my mood and nerves?",
    answer: expertConversation[2].text,
    title: expertConversation[2].title,
  },
  {
    question: "Why does vitamin B12 matter so much?",
    answer: expertConversation[3].text,
    title: expertConversation[3].title,
  },
];

export default function BossBabyAskAnExpertPage({ currentPage, setCurrentPage }) {
  const [draftQuestion, setDraftQuestion] = useState("");
  const [conversation, setConversation] = useState([
    {
      id: 1,
      question: "What should I know about magnesium?",
      answer: expertConversation[0].text,
      title: expertConversation[0].title,
    },
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = draftQuestion.trim();

    if (!trimmed) {
      return;
    }

    const lowerQuestion = trimmed.toLowerCase();
    let selected = expertConversation[0];

    if (lowerQuestion.includes("guarana")) {
      selected = expertConversation[1];
    } else if (lowerQuestion.includes("b6") || lowerQuestion.includes("vitamin b6")) {
      selected = expertConversation[2];
    } else if (lowerQuestion.includes("b12") || lowerQuestion.includes("vitamin b12")) {
      selected = expertConversation[3];
    } else if (lowerQuestion.includes("magnesium")) {
      selected = expertConversation[0];
    }

    setConversation((previous) => [
      ...previous,
      {
        id: Date.now(),
        question: trimmed,
        answer: selected.text,
        title: selected.title,
      },
    ]);
    setDraftQuestion("");
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: brand.bg, fontFamily: "Poppins, sans-serif", color: brand.text }}
    >
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <section className="py-20 px-4">
        <Container>
          <div className="max-w-[800px] mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              Curious? Just ask.
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Bring your questions about nutrition, beauty, and health and we'll answer them.
            </p>
            <button
              type="button"
              className="rounded-full px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: brand.pink }}
              onClick={() => setCurrentPage("community")}
            >
              Back to community
            </button>
          </div>

          <div className="mt-12 rounded-[32px] border bg-white/80 p-6 md:p-8 shadow-sm" style={{ borderColor: "#ffeaf4" }}>
            <div className="max-w-3xl mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-2" style={{ fontWeight: 800 }}>
                Hey, what’s on your mind today?
              </h2>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                If you have a question about nutrition, ask us and our scientists will answer them.
              </p>
            </div>

            <div className="mb-5 rounded-2xl border bg-[#fffdfd] p-4 text-sm text-gray-700" style={{ borderColor: "#ffeaf4" }}>
              <p className="font-extrabold" style={{ fontWeight: 800 }}>
                Hi there 👋
              </p>
              <p className="mt-1 leading-relaxed">
                Ask me anything about magnesium, guarana, vitamin B6, or vitamin B12.
              </p>
            </div>

            <div className="mb-6 grid gap-3 md:grid-cols-2">
              {exampleQuestions.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setDraftQuestion(example.question)}
                  className="rounded-2xl border bg-[#fffdfd] p-4 text-left text-sm text-gray-700 transition hover:-translate-y-0.5"
                  style={{ borderColor: "#ffeaf4" }}
                >
                  <p className="font-extrabold text-gray-900" style={{ fontWeight: 800 }}>
                    {example.question}
                  </p>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={draftQuestion}
                onChange={(event) => setDraftQuestion(event.target.value)}
                placeholder="Ask me anything about your routine or supplements"
                className="flex-1 rounded-full border border-pink-200 bg-[#fffdfd] px-4 py-3 text-sm outline-none focus:border-pink-400"
              />
              <button
                type="submit"
                className="rounded-full px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: brand.pink }}
              >
                Send
              </button>
            </form>

            <div className="mt-8 space-y-4">
              {conversation.map((entry) => (
                <div key={entry.id} className="rounded-2xl border bg-[#fffdfd] p-5" style={{ borderColor: "#ffeaf4" }}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-semibold" style={{ backgroundColor: brand.lightPink }}>
                      You
                    </div>
                    <div className="rounded-2xl bg-[#f9f9f9] px-4 py-3 text-sm text-gray-700">
                      {entry.question}
                    </div>
                  </div>

                  <div className="mt-3 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-semibold text-white" style={{ backgroundColor: brand.pink }}>
                      Expert
                    </div>
                    <div className="rounded-2xl bg-[#fff4f8] px-4 py-3 text-sm text-gray-700 leading-relaxed">
                      <p className="font-extrabold mb-1" style={{ fontWeight: 800 }}>
                        {entry.title}
                      </p>
                      <p>{entry.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
