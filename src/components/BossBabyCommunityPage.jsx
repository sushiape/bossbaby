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
    title: "Mini Glow-Ups",
    description: "Tiny routines, mini wellness bites and science nuggets read in 60s."
  },
  {
    title: "Bossbaby Squad",
    description: "Small unique groups for energy, focus, and beauty. Let's hype each other up!"
  },
  {
    title: "Ask an Expert",
    description: "Q&As with nutrition scientists and wellness nerds who speak your language."
  },
  {
    title: "Flavour Lab",
    description: "Create with us: Taste, test, and co-create the next Bossbaby blends before anyone else. "
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
    author: "@paralleluniverse",
    time: "2h ago",
    replies: 24,
    title: "Female founders: Whats your goto professional pep talk before a big pitch?"
  },
  {
    author: "@hannahbanana",
    time: "1d ago",
    replies: 8,
    title: "I swapped coffee for WaKe Up! and my 2pm crash vanished"
  },
  {
    author: "@mimi",
    time: "3d ago",
    replies: 19,
    title: "What is one small habit that calmed your afternoons?"
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
    <div className="min-h-screen" style={{backgroundColor: brand.bg, fontFamily: 'Poppins, sans-serif', color: brand.text}}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <Container>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4" style={{fontWeight: 800, fontSize: 'clamp(32px, 5vw, 56px)'}}>
            Where wellness meets real talk.
          </h1>
          <p className="text-lg text-gray-600 max-w-[700px] mx-auto mt-4 mb-8" style={{fontSize: '1.1rem'}}>
            A kind, hype heavy space to swap routines, ask smart questions, and celebrate micro wins.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-[1100px] mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border rounded-3xl p-8 shadow-md flex flex-col items-center text-center hover:-translate-y-1 transition-all"
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
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Topics Section */}
      <section className="py-16 px-4">
        <Container>
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold mb-6" style={{fontWeight: 800, letterSpacing: '-0.01em'}}>
            Pick your corner
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="bg-white border rounded-2xl p-5 shadow-md hover:-translate-y-0.5 transition-all"
                style={{
                  borderColor: '#ffeaf4',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
                }}
              >
                <h3 className="text-base font-extrabold mb-1" style={{fontWeight: 800}}>
                  {topic.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {topic.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {topic.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="border rounded-full px-3 py-1 text-xs bg-white"
                      style={{borderColor: '#f3e3ee'}}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Feed Section */}
      <section className="py-16 px-4">
        <Container>
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold mb-6" style={{fontWeight: 800, letterSpacing: '-0.01em'}}>
            Fresh from the feed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {feedPosts.map((post, index) => (
              <div
                key={index}
                className="bg-white border rounded-2xl p-5 shadow-md"
                style={{
                  borderColor: '#ffeaf4',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
                }}
              >
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                  <span>{post.author} {post.time}</span>
                  <span>{post.replies}</span>
                </div>
                <div className="font-bold text-base mt-2" style={{fontWeight: 700}}>
                  {post.title}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Ambassadors Section */}
      <section className="py-16 px-4">
        <Container>
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold mb-6" style={{fontWeight: 800, letterSpacing: '-0.01em'}}>
            Ambassadors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {ambassadors.map((amb, index) => (
              <div
                key={index}
                className="bg-white border rounded-2xl p-5 shadow-md"
                style={{
                  borderColor: '#ffeaf4',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
                }}
              >
                <h4 className="font-extrabold mb-1" style={{fontWeight: 800}}>
                  {amb.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {amb.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
