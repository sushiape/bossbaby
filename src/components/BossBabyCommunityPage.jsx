import React from "react";
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
  <div className={`max-w-[1200px] mx-auto px-4 sm:px-6 ${className}`}>{children}</div>
);

const features = [
  {
    title: "Hot Girls Read",
    description: "The science behind energy, mood, skin, nutrition and what your body is actually doing.",
    page: "askexpert"
  },
  {
    title: "Baby, It's Cold Outside",
    description: "Because we're missing you! Pop-ups, tastings, events and everywhere Bossbaby is showing up IRL.",
    page: "flavourlab"
  },
  {
    title: "It's Your Call, Babe.",
    description: "Vote, taste, test and decide what Bossbaby creates next.",
    page: "youpick"
  },
  {
    title: "Let's Talk Business, Babe.",
    description: "Big ideas, startup 101, founder lessons and the real stuff behind building a business."
  }
];

const topics = [
  {
    title: "Hormone Harmony",
    description: "Cycle-sync your life - from mood to meals. With energy-balancing tips and expert hot takes.",
    tags: ["cycle syncing", "PMS", "supplements"]
  },
  {
    title: "Deep Work, Babe",
    description: "Focus sprints and accountability threads to get things done together.",
    tags: ["focus", "cowork", "systems"]
  },
  {
    title: "Glow Theory",
    description: "Your go-to space for skincare myths, ingredient deep dives, and real before-and-afters.",
    tags: ["SPF", "collagen", "hydration"]
  },
  {
    title: "Calm Club",
    description: "Nervous system resets, breathwork, and sleep tips.",
    tags: ["sleep", "journaling", "magnesium"]
  },
  {
    title: "Fuel and Feel Good",
    description: "Quick, mood-lifting meals and snack inspo for busy days that need real energy",
    tags: ["protein", "macro friendly", "budget"]
  },
  {
    title: "Wins Wall",
    description: "Hype each other up, tiny to epic.",
    tags: ["power", "habits", "hype"]
  }
];

const feedPosts = [
  {
    author: "@glowgetter",
    time: "4h ago",
    replies: 31,
    title: "Three weeks on Glow formula and my coworker asked what new skincare I started 👀"
  },
  {
    author: "@hannahbanana",
    time: "1d ago",
    replies: 8,
    title: "I swapped coffee for WaKe Up! and my 2pm crash just... stopped happening"
  },
  {
    author: "@mimi",
    time: "3d ago",
    replies: 19,
    title: "What is one small habit that actually calmed your afternoons? Asking for real answers only"
  }
];

const ambassadors = [
  {
    name: "Mara Munich",
    description: "Runs biweekly Calm Club walks with Matcha Meetup."
  },
  {
    name: "Zee Berlin",
    description: "Co-working with other female founders every Tuesday with Deep Work sprints."
  },
  {
    name: "Annabelline Hamburg",
    description: "Hosts skin science 'Ask an Expert' sessions with dermatology friends."
  }
];

export default function BossBabyCommunityPage({ currentPage, setCurrentPage }) {
  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor: brand.bg, fontFamily: 'Poppins, sans-serif', color: brand.text}}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Hero Section */}
      <section className="text-center py-20 px-4 flex-1">
        <Container>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4" style={{fontWeight: 800, fontSize: 'clamp(32px, 5vw, 56px)'}}>
            This space is for you.
          </h1>
          <p className="text-lg text-gray-600 max-w-[700px] mx-auto mt-4 mb-8" style={{fontSize: '1.1rem'}}>
            Get nerdy. Talk business. Meet us IRL. Help decide what comes next.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-[1100px] mx-auto">
            {features.map((feature, index) => (
              <button
                key={index}
                type="button"
                onClick={() => feature.page && setCurrentPage(feature.page)}
                className="bg-white border rounded-3xl p-8 shadow-md flex flex-col items-center text-center hover:-translate-y-1 transition-all cursor-pointer w-full"
                style={{
                  borderColor: '#ffeaf4',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
                }}
              >
                <h3 className="text-xl font-extrabold mb-3" style={{fontWeight: 800, letterSpacing: '-0.01em'}}>
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[240px]">
                  {feature.description}
                </p>
              </button>
            ))}
          </div>
        </Container>
      </section>


      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
