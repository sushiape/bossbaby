import React from "react";
import { motion } from "framer-motion";
import {
  HeartHandshake,
  Sparkles,
  Users,
  Star,
  Mail,
  MessageCircle,
  Calendar,
  ThumbsUp,
  ShieldCheck,
  Trophy,
  ChevronRight,
  ArrowUpRight,
  Instagram,
  MessageSquare,
  Linkedin,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";

// BossBaby brand palette
const brand = {
  power: "#FF1493",    // vibrant hot pink
  energy: "#F79A3E",   // orange
  glow: "#F9D44A",     // yellow
  calm: "#8BC374",     // green
  cream: "#F5EBDC",    // soft cream background
  ink: "#111827",      // gray-900
};

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const SectionTitle = ({ kicker, title, subtitle }) => (
  <div className="mx-auto max-w-3xl text-center">
    {kicker && (
      <div className="mb-3">
        <Badge className="rounded-full px-3 py-1 text-xs font-medium border" style={{
          backgroundColor: brand.power + "33", // translucent
          color: brand.ink,
          borderColor: brand.power
        }}>{kicker}</Badge>
      </div>
    )}
    <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">{title}</h2>
    {subtitle && (
      <p className="mt-3 text-base sm:text-lg text-gray-600">{subtitle}</p>
    )}
  </div>
);

const Feature = ({ Icon, title, desc, tone = "power" }) => (
  <Card className="h-full rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <CardHeader>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl" style={{backgroundColor: brand[tone] + "33"}}>
          <Icon className="h-5 w-5" style={{color: brand[tone]}} />
        </span>
        <CardTitle className="text-lg">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600">{desc}</p>
    </CardContent>
  </Card>
);

const Testimonial = ({ quote, name, role }) => (
  <Card className="rounded-2xl shadow-sm">
    <CardContent className="pt-6">
      <p className="text-gray-800 leading-relaxed">"{quote}"</p>
      <div className="mt-4 text-sm text-gray-600">— {name}, {role}</div>
    </CardContent>
  </Card>
);

export default function BossBabyCommunityPage() {
  return (
    <div className="min-h-screen" style={{backgroundImage: `linear-gradient(to bottom, ${brand.cream}, white, white)`}}>
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="flex items-center justify-center px-4 py-2 rounded-lg"
              style={{
                backgroundColor: brand.power,
                fontFamily: 'serif'
              }}
            >
              <span className="text-white font-serif text-lg" style={{fontFamily: 'Georgia, serif'}}>Bossbaby</span>
            </div>
            <span className="ml-2 rounded-full px-2 py-0.5 text-xs" style={{backgroundColor: brand.power + "33", color: brand.ink}}>Community</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#why" className="text-gray-600 hover:text-gray-900">Why</a>
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#events" className="text-gray-600 hover:text-gray-900">Events</a>
            <a href="#forum" className="text-gray-600 hover:text-gray-900">Forum</a>
            <a href="#join" className="text-gray-600 hover:text-gray-900">Join</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="hidden sm:inline-flex">Sign in</Button>
            <Button className="rounded-xl hover:opacity-90" style={{backgroundColor: brand.power}}>Join now</Button>
          </div>
        </Container>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <Container className="py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-4 rounded-full border" style={{backgroundColor: brand.power + "33", color: brand.ink, borderColor: brand.power}}>Women‑led · Science‑informed · Delicious</Badge>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-gray-900">
                Your community for wellness
                <span className="block">that actually fits your life.</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">
                Connect with founders, experts, and the BossBaby crew. Recipes, routines, product testing & exclusive early‑access drops — all in one place.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button className="rounded-xl hover:opacity-90" style={{backgroundColor: brand.power}}>
                  Join the community
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="rounded-xl border" style={{borderColor: brand.energy, color: brand.ink}}>
                  Learn more
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-7 w-7 rounded-full ring-2 ring-white" style={{backgroundColor: brand.power}} />
                  ))}
                </div>
                <span>3.2k+ members · 92% would recommend</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="lg:justify-self-end">
              <div className="relative">
                <div className="absolute -inset-6 rounded-[2rem] blur-2xl" style={{backgroundColor: brand.power + "66"}} />
                <Card className="relative rounded-[2rem] shadow-lg">
                  <CardContent className="p-6 sm:p-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-white p-4 shadow-sm border">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900"><Sparkles className="h-4 w-4" style={{color: brand.power}}/> Daily Tips</div>
                        <p className="mt-2 text-sm text-gray-600">Tiny routines, recipe bites & science nuggets — read in 60s.</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-sm border">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900"><Users className="h-4 w-4" style={{color: brand.energy}}/> Circle Groups</div>
                        <p className="mt-2 text-sm text-gray-600">Topic circles for Energy, Focus, Skin & Cycle.</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-sm border">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900"><HeartHandshake className="h-4 w-4" style={{color: brand.calm}}/> Expert AMAs</div>
                        <p className="mt-2 text-sm text-gray-600">Live Q&As with nutrition & hormone health pros.</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-sm border">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900"><ShieldCheck className="h-4 w-4" style={{color: brand.glow}}/> Product Testers</div>
                        <p className="mt-2 text-sm text-gray-600">Try new flavors first & share feedback.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Why community */}
      <section id="why" className="py-16 sm:py-24">
        <Container>
          <SectionTitle
            kicker="Why the BossBaby Community?"
            title="Knowledge, motivation & real connection"
            subtitle="We combine science and everyday life — with loving rituals that work and are fun."
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Feature Icon={Sparkles} title="Science‑based & practical" desc="Evidence‑informed content that fits your busy day." tone="power" />
            <Feature Icon={MessageCircle} title="Peer support" desc="A moderated, supportive space — zero gatekeeping, zero judgement." tone="calm" />
            <Feature Icon={Trophy} title="Celebrate progress together" desc="Weekly mini‑challenges & badges to build your routine." tone="energy" />
          </div>
        </Container>
      </section>

      {/* Events */}
      <section id="events" className="py-16 sm:py-24" style={{backgroundColor: brand.power + "15"}}>
        <Container>
          <SectionTitle kicker="Upcoming" title="Events & Live Sessions" subtitle="Workshops, AMAs and community meets — online and in your city." />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { date: "Thu, Sep 18", title: "Hormone Health AMA", tag: "Live Q&A", spots: "42 seats left" },
              { date: "Sat, Sep 27", title: "Morning Routine Lab", tag: "Workshop", spots: "Full" },
              { date: "Wed, Oct 8", title: "Flavor Testing: Glow", tag: "Testers", spots: "18 kits left" },
            ].map((e, i) => (
              <Card key={i} className="rounded-2xl shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-white text-gray-700 border">{e.tag}</Badge>
                    <Calendar className="h-4 w-4" style={{color: brand.energy}}/>
                  </div>
                  <CardTitle className="mt-2 text-xl">{e.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{e.date}</span>
                    <span>{e.spots}</span>
                  </div>
                  <Button className="mt-4 w-full rounded-xl hover:opacity-90" style={{backgroundColor: brand.energy}}>Register</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Forum preview */}
      <section id="forum" className="py-16 sm:py-24">
        <Container>
          <SectionTitle kicker="Community Forum" title="Popular discussions" subtitle="Ask questions, share wins, post recipes & routines — we're here for you." />
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {[ 
              { cat: "Energy", title: "30‑second shots before workouts — what does the research say?", replies: 42, color: brand.energy },
              { cat: "Skin & Glow", title: "Collagen: morning or night?", replies: 31, color: brand.glow },
              { cat: "Cycle", title: "Iron & B12 on cycle days — your experiences", replies: 19, color: brand.calm },
              { cat: "Mind", title: "5‑minute calm breaks for WFH", replies: 28, color: brand.power },
              { cat: "Recipes", title: "Pink smoothie + BossBaby shot — my ratio", replies: 63, color: brand.power },
              { cat: "Feedback", title: "Feature request: app reminders", replies: 12, color: brand.energy },
            ].map((t, i) => (
              <Card key={i} className="rounded-2xl shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border" style={{borderColor: t.color, color: brand.ink}}>{t.cat}</Badge>
                    <div className="inline-flex items-center gap-1 text-sm text-gray-500"><MessageSquare className="h-4 w-4"/> {t.replies}</div>
                  </div>
                  <CardTitle className="mt-2 text-base sm:text-lg">{t.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full rounded-xl border" style={{borderColor: t.color, color: brand.ink}}>Open thread</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Join / CTA */}
      <section id="join" className="py-16 sm:py-24" style={{backgroundColor: brand.glow + "22"}}>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <SectionTitle
                kicker="Join now"
                title="Become part of the BossBaby crew"
                subtitle="Free community membership, optional Pro features: early‑access tester kits, exclusive workbooks & live sessions."
              />
              <ul className="mt-6 space-y-3 text-gray-700 text-sm">
                <li className="flex items-center gap-3"><ThumbsUp className="h-4 w-4" style={{color: brand.calm}}/> Private circle groups (Energy, Focus, Calm, Glow)</li>
                <li className="flex items-center gap-3"><Star className="h-4 w-4" style={{color: brand.glow}}/> Weekly mini‑challenges & badges</li>
                <li className="flex items-center gap-3"><Mail className="h-4 w-4" style={{color: brand.energy}}/> Newsletter with science bites & recipes</li>
              </ul>
            </div>
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Waitlist & newsletter</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input placeholder="First name" />
                    <Input type="email" placeholder="Email address" />
                  </div>
                  <Textarea placeholder="What goals are you working on right now? (optional)" className="min-h-[96px]" />
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <input id="privacy" type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="privacy">I agree to the privacy policy.</label>
                  </div>
                  <Button className="w-full rounded-xl hover:opacity-90" style={{backgroundColor: brand.calm}}>Sign up</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Social proof */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionTitle kicker="Community voices" title="What members say" />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Testimonial quote="The challenges are so small and doable — I finally stay consistent!" name="Lena" role="Consultant" />
            <Testimonial quote="I love the science bites. Clear, short info without wellness myths." name="Mara" role="Med student" />
            <Testimonial quote="As a tester member I found my favorite flavor early!" name="Yasmin" role="Product designer" />
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24" style={{backgroundColor: brand.power + "15"}}>
        <Container>
          <SectionTitle kicker="FAQ" title="Frequently asked questions" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: "Is the community paid?", a: "The basic membership is free. Pro features (workbooks, tester kits, events) are optional." },
              { q: "How do I become a product tester?", a: "Join the waitlist and select 'Tester Program' in the form. We'll email you next steps." },
              { q: "Do I need BossBaby shots to join?", a: "No — the community is for everyone. Our content helps you build better routines, with or without the product." },
              { q: "Which platforms do you use?", a: "We start with web & email. App, Discord/Slack and local city circles will follow." },
            ].map((f, i) => (
              <Card key={i} className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">{f.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <Container className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2">
                <div 
                  className="flex items-center justify-center px-3 py-1.5 rounded-lg"
                  style={{
                    backgroundColor: brand.power,
                    fontFamily: 'serif'
                  }}
                >
                  <span className="text-white font-serif text-base" style={{fontFamily: 'Georgia, serif'}}>Bossbaby</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600">Wellness that fits you — for Energy, Focus, Calm & Glow.</p>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Community</div>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li><a href="#features">Features</a></li>
                <li><a href="#events">Events</a></li>
                <li><a href="#forum">Forum</a></li>
                <li><a href="#join">Join</a></li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Legal</div>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>Imprint</li>
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Social</div>
              <div className="mt-3 flex items-center gap-3 text-gray-600">
                <Instagram className="h-5 w-5"/>
                <Linkedin className="h-5 w-5"/>
                <MessageSquare className="h-5 w-5"/>
              </div>
              <p className="mt-4 text-xs text-gray-500">© {new Date().getFullYear()} BossBaby</p>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
