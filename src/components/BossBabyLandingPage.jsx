export default function BossBabyLandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#FAF5F6] text-black">
      {/* Nav */}
      <header className="w-full sticky top-0 bg-white/80 backdrop-blur z-50 border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="font-bold text-4xl" style={{ fontFamily: 'Judson' }}>Bossbaby</div>
          <nav className="flex gap-6 text-[20px] font-semibold" style={{ fontFamily: 'Inter' }}>
            <a href="#home" className="hover:opacity-70">Home</a>
            <a href="#products" className="hover:opacity-70">Products</a>
            <a href="#community" className="hover:opacity-70">Community</a>
            <a href="#about" className="hover:opacity-70">About</a>
            <a href="#faq" className="hover:opacity-70">FAQ</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative isolate overflow-hidden bg-gradient-to-b from-pink-200 to-pink-100">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="text-white" style={{ fontFamily: 'Gasoek One', fontSize: '128px', fontWeight: 400, lineHeight: 1 }}>
            Wellness drinks <br /> made for her.
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-black" style={{ fontFamily: 'Inter', fontWeight: 400 }}>
            Empowering women with every sip.
          </p>
          <div className="mt-10">
            <a
              href="#buy"
              className="inline-block rounded-2xl px-8 py-3 text-xl text-[#FFFDFD] shadow hover:opacity-90"
              style={{ fontFamily: 'Gasoek One', background: '#E97D8F' }}
            >
              buy
            </a>
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <section className="bg-[#FFF8F8]">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-[40px] font-extralight" style={{ fontFamily: 'Helvetica Neue' }}>
            Ready to feel unstoppable?
          </h2>
          <form className="mt-6 flex items-stretch gap-3 justify-center">
            <input
              type="email"
              placeholder="enter your email"
              className="w-full max-w-md rounded-xl border px-4 py-3 text-[15px] outline-none focus:ring"
              style={{ color: 'rgba(0,0,0,0.66)', fontFamily: 'Helvetica Neue', fontWeight: 400 }}
              required
            />
            <button
              type="submit"
              className="rounded-xl border px-6 py-3 text-[15px] hover:bg-black hover:text-white transition"
              style={{ fontFamily: 'Helvetica Neue', fontWeight: 400 }}
            >
              GO
            </button>
          </form>
        </div>
      </section>

      {/* Product Feature */}
      <section id="products" className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h3 className="text-[48px] font-light" style={{ fontFamily: 'Helvetica Neue' }}>
            World’s first AI-powered smoothie machine
          </h3>
          <p className="mt-2 text-[48px] font-light" style={{ fontFamily: 'Helvetica Neue' }}>
            Stay tuned!
          </p>
          {/* Decorative example of the fixed inline-style pattern */}
          <div className="mx-auto mt-10 flex items-center justify-center gap-3">
            <div style={{ width: '14.65px', height: '39.46px', background: '#1D3227', borderRadius: '50px' }} />
            <div style={{ width: '14.65px', height: '39.46px', background: '#E97D8F', borderRadius: '50px' }} />
            <div style={{ width: '14.65px', height: '39.46px', background: '#FFD1DC', borderRadius: '50px' }} />
          </div>
        </div>
      </section>

      {/* Community / Testimonials */}
      <section id="community" className="bg-[#EAEDDC]">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-10">
            <h4 className="text-[37.03px] font-bold tracking-wide" style={{ color: '#002B26', fontFamily: 'Inter', lineHeight: '40px', letterSpacing: '0.60px' }}>
              Real women, real feelings
            </h4>
            <p className="text-[23.44px]" style={{ color: '#002B26', fontFamily: 'Inter', lineHeight: '31.2px', letterSpacing: '0.60px' }}>
              Because we’re all just trying to feel like ourselves, but better.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <article className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-[15px] font-bold" style={{ color: '#002B26', fontFamily: 'Inter', lineHeight: '22.4px', letterSpacing: '0.60px' }}>Sarah</div>
              <p className="mt-2 text-[16px]" style={{ color: '#002B26', fontFamily: 'Inter', lineHeight: '24px', letterSpacing: '1px' }}>
                “Finally, a wellness brand that doesn’t make me feel like I’m failing at life. These shots just... get it.”<br/><br/>— Sarah, 29, Marketing Director
              </p>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-[15.88px] font-bold" style={{ color: '#002B26', fontFamily: 'Inter', lineHeight: '22.4px', letterSpacing: '0.60px' }}>Maya</div>
              <p className="mt-2 text-[16px]" style={{ color: '#002B26', fontFamily: 'Inter', lineHeight: '24px', letterSpacing: '1px' }}>
                “The POWER shot is my secret weapon for those hormonal weeks when I usually want to hide under a blanket”<br/><br/>— Maya, 34, Entrepreneur
              </p>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-[15.12px] font-bold" style={{ color: '#002B26', fontFamily: 'Inter', lineHeight: '22.4px', letterSpacing: '0.60px' }}>Jess</div>
              <p className="mt-2 text-[16px]" style={{ color: 'black', fontFamily: 'Inter', lineHeight: '24px', letterSpacing: '1px' }}>
                “I’ve never been consistent with supplements, but this one feels like self-care, not homework.”<br/><br/>— Jess, 26, Designer
              </p>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-[14.88px] font-bold" style={{ color: '#002B26', fontFamily: 'Inter', lineHeight: '22.4px', letterSpacing: '0.60px' }}>Julie</div>
              <p className="mt-2 text-[16px]" style={{ color: '#002B26', fontFamily: 'Inter', lineHeight: '22.4px' }}>
                “The POWER shot is my go-to boost before training — it helps me push through tough sessions and recover with strength.”<br/>— Julie, 27, Fitness Coach
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center text-[15px] font-light" style={{ fontFamily: 'Helvetica Neue' }}>
          © 2025 with 🩷 by bossbaby
        </div>
      </footer>
    </div>
  );
}

