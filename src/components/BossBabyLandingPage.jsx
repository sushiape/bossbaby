export default function BossBabyLandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#FAF5F6] text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <header className="w-full sticky top-0 bg-white/80 backdrop-blur z-50 border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="font-light text-4xl">Bossbaby</div>
          <nav className="flex gap-6 text-[20px] font-normal">
            <a href="#home" className="hover:opacity-70">Home</a>
            <a href="#products" className="hover:opacity-70">Products</a>
            <a href="#community" className="hover:opacity-70">Community</a>
            <a href="#about" className="hover:opacity-70">About</a>
            <a href="#faq" className="hover:opacity-70">FAQ</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative isolate overflow-hidden bg-[#FF89CC]">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="text-white text-[128px] font-extrabold leading-none">
            Nutrition drinks <br /> made for her.
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-black font-normal">
            Empowering women with every sip.
          </p>
          <div className="mt-10">
            <a
              href="#buy"
              className="inline-block rounded-2xl px-8 py-3 text-xl bg-white text-[#FF89CC] font-extrabold shadow hover:opacity-90"
            >
              buy
            </a>
          </div>
        </div>
      </section>

      {/* Email Signup Section */}
      <section className="bg-[#FFF8F8]">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-[40px] font-extralight">Ready to feel unstoppable?</h2>
          <form className="mt-6 flex items-stretch gap-3 justify-center">
            <input
              type="email"
              placeholder="enter your email"
              className="w-full max-w-md rounded-xl border px-4 py-3 text-[15px] outline-none focus:ring text-black/70 font-normal"
              required
            />
            <button
              type="submit"
              className="rounded-xl border px-6 py-3 text-[15px] hover:bg-black hover:text-white transition font-normal"
            >
              GO
            </button>
          </form>
        </div>
      </section>

      {/* Product Feature Section */}
      <section id="products" className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h3 className="text-[48px] font-light">World’s first AI-powered smoothie machine</h3>
          <p className="mt-2 text-[48px] font-light">Stay tuned!</p>
          <div className="mx-auto mt-10 flex items-center justify-center gap-3">
            <div style={{ width: '14.65px', height: '39.46px', background: '#1D3227', borderRadius: '50px' }}></div>
            <div style={{ width: '14.65px', height: '39.46px', background: '#E97D8F', borderRadius: '50px' }}></div>
            <div style={{ width: '14.65px', height: '39.46px', background: '#FFD1DC', borderRadius: '50px' }}></div>
          </div>
        </div>
      </section>

      {/* Community / Testimonials Section */}
      <section id="community" className="bg-[#EAEDDC]">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-10">
            <h4 className="text-[37.03px] font-bold tracking-wide text-[#002B26] leading-[40px]">
              Real women, real feelings
            </h4>
            <p className="text-[23.44px] text-[#002B26] leading-[31.2px]">
              Because we’re all just trying to feel like ourselves, but better.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <article className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-[15px] font-bold text-[#002B26] leading-[22.4px]">Sarah</div>
              <p className="mt-2 text-[16px] text-[#002B26] leading-[24px]">
                “Finally, a wellness brand that doesn’t make me feel like I’m failing at life. These shots just... get it.”<br/><br/>— Sarah, 29, Marketing Director
              </p>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-[15.88px] font-bold text-[#002B26] leading-[22.4px]">Maya</div>
              <p className="mt-2 text-[16px] text-[#002B26] leading-[24px]">
                “The POWER shot is my secret weapon for those hormonal weeks when I usually want to hide under a blanket”<br/><br/>— Maya, 34, Entrepreneur
              </p>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-[15.12px] font-bold text-[#002B26] leading-[22.4px]">Jess</div>
              <p className="mt-2 text-[16px] text-black leading-[24px]">
                “I’ve never been consistent with supplements, but this one feels like self-care, not homework.”<br/><br/>— Jess, 26, Designer
              </p>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-[14.88px] font-bold text-[#002B26] leading-[22.4px]">Julie</div>
              <p className="mt-2 text-[16px] text-[#002B26] leading-[22.4px]">
                “The POWER shot is my go-to boost before training — it helps me push through tough sessions and recover with strength.”<br/>— Julie, 27, Fitness Coach
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center text-[15px] font-light">
          © 2025 with 🩷 by bossbaby
        </div>
      </footer>
    </div>
  );
}

