<!DOCTYPE html>
<!--
  Deployment note for Vercel (static HTML):
  - This site is a pure static page. Do NOT run a build.
  - Repo should contain: index.html and vercel.json only.
  - vercel.json contents:
      {
        "buildCommand": "",
        "outputDirectory": ".",
        "framework": null
      }
  - Remove package.json, vite.config.js, and any vercel.json with a "builds" array.
  - In Vercel settings: Framework = Other, Build Command = (blank), Output Directory = .
-->

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bossbaby</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;600;700;800&display=swap" rel="stylesheet" />
    <style>
      :root{
        --pink:#FF89CC; --text:#000; --bg:#FAF5F6; --white:#fff;
      }
      *{box-sizing:border-box}
      html,body{margin:0}
      body{font-family:Poppins,sans-serif;background:var(--bg);color:var(--text)}
      a{text-decoration:none;color:inherit}

      /* header smaller and cleaner */
      header{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.8);backdrop-filter:blur(10px);border-bottom:1px solid #e5e5e5}
      .nav{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding:.5rem 1rem}
      .brand{font-size:1.25rem;font-weight:300}
      .menu a{margin-left:1rem;font-size:14px;font-weight:400;transition:opacity .2s ease}
      .menu a:hover{opacity:.7}

      .hero{background:var(--pink);text-align:center;padding:8rem 1rem}
      .hero h1{color:#fff;font-size:128px;font-weight:800;line-height:1;margin:0}
      .hero p{font-size:22px;color:#000;margin-top:1.5rem;margin-bottom:3rem}
      
      .waitlist h2{font-size:42px;font-weight:700;color:#fff;margin-top:2rem;margin-bottom:0.3rem}
      .waitlist p{font-size:22px;color:#fff;margin-top:0;margin-bottom:0.3rem}
      .waitlist form{margin-top:0.5rem;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
      .waitlist input{padding:.75rem 1rem;border-radius:10px;border:1px solid #fff;background:#fff;font-size:15px;width:300px;max-width:80vw;color:#000}
      .waitlist button{padding:.75rem 1.5rem;border-radius:10px;border:1px solid #fff;background:#fff;color:var(--pink);font-weight:700;font-size:15px;cursor:pointer;transition:.3s}
      .waitlist button:hover{background:#FFE3F2}

      .products{text-align:center;background:#fff;padding:5rem 1rem}
      .products h3{font-size:48px;font-weight:300;margin:0}

      .drinks{text-align:center;background:#FFF8F8;padding:5rem 1rem}
      .drinks h2{font-size:40px;font-weight:300;margin-bottom:2rem}
      .drinks .lead{font-size:18px;color:#333;margin-bottom:3rem}
      .drink-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:2rem;max-width:1000px;margin:0 auto}
      .drink-card{position:relative;border-radius:20px;padding:2rem;background:#fff;border:1px solid #FFD1EB;box-shadow:0 4px 15px rgba(0,0,0,.05);transition:transform .2s ease, box-shadow .2s ease}
      .drink-card:hover{transform:translateY(-5px);box-shadow:0 8px 20px rgba(0,0,0,.1)}
      .drink-card h3{font-size:22px;font-weight:700;color:var(--pink);margin:0 0 .5rem}
      .drink-card p{font-size:15px;line-height:1.6;color:#333;margin:0}

      .community{background:#EAEDDC;padding:5rem 1rem}
      .community h4{font-size:37px;font-weight:700;color:#002B26;margin-bottom:1rem}
      .community .lead{font-size:23px;color:#002B26}
      .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem;margin-top:2rem}
      .card{background:#fff;border-radius:16px;padding:1.5rem;box-shadow:0 2px 8px rgba(0,0,0,.1)}
      .card .name{font-weight:700;color:#002B26;margin-bottom:.5rem}
      .card p{font-size:16px;color:#002B26}

      footer{background:#fff;text-align:center;padding:2rem;font-size:15px;font-weight:300}
      @media(max-width:1024px){.hero h1{font-size:96px}}
      @media(max-width:768px){.hero h1{font-size:64px}}
    </style>
  </head>
  <body>
    <header>
      <div class="nav">
        <div class="brand">Bossbaby</div>
        <nav class="menu">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#community">Community</a>
          <a href="#about">About</a>
          <a href="#faq">FAQ</a>
        </nav>
      </div>
    </header>

    <section id="home" class="hero">
      <h1>Nutrition drinks <br> made for her.</h1>
      <p>Empowering women with every sip.</p>
      <div class="waitlist">
        <h2>Ready to feel unstoppable?</h2>
        <p>Join the waitlist</p>
        <form>
          <input type="email" placeholder="enter your email" required>
          <button type="submit">GO</button>
        </form>
      </div>
    </section>

    <section id="about" class="about" style="background:#fff;padding:5rem 1rem;text-align:center;">
      <div style="max-width:800px;margin:0 auto;">
        <p style="font-size:18px;line-height:1.6;color:#000;">
          We make nutritious drinks for women that taste amazing, fit busy routines, and turn wellness into a moment of empowerment and identity.
          <br><br>
          We started Bossbaby because we couldn’t find wellness products that truly reflect the way women live and feel. Most supplements are generic, masculine-default, or overly aesthetic without real function. We wanted something real, created by women, for women, that’s both functional and emotionally resonant.
          <br><br>
          Our formulas are developed together with nutrition experts and based on scientific research to align with women’s physiological and emotional needs. Each shot, Power, Energy, Glow, and Calm, corresponds to a specific physical-emotional state, transforming supplements into an enjoyable, empowering daily ritual.
          <br><br>
          Our mission is simple: to empower women with delicious nutrient drinks that taste amazing, fit busy routines, and turn wellness into a daily moment of strength, science, and self-expression.
        </p>
      </div>
    </section>

    <section id="drinks" class="drinks">
      <h2>Our Four Signature Formulas</h2>
      <p class="lead">Each blend empowers a different side of life, from focus and vitality to confidence and calm.</p>
      <div class="drink-grid">
        <div class="drink-card">
          <h3>Power</h3>
          <p>Hormone-balancing blend with adaptogenic herbs. For the days when you need your body to cooperate with your ambitions.</p>
        </div>
        <div class="drink-card">
          <h3>Energy</h3>
          <p>Mental clarity and sustained focus without the crash. Because your brain deserves premium fuel.</p>
        </div>
        <div class="drink-card">
          <h3>Glow</h3>
          <p>Skin-loving antioxidants and collagen support. Radiance that starts from the inside out.</p>
        </div>
        <div class="drink-card">
          <h3>Calm</h3>
          <p>Nervous system support for when you need to actually breathe. Calm without the drowsy.</p>
        </div>
      </div>
    </section>

<section id="products" class="products">
      <h3>World’s first AI-powered smoothie machine</h3>
      <p style="font-size:48px;font-weight:300;margin-top:.5rem">Stay tuned!</p>
    </section>

    <section id="community" class="community">
      <h4>Real women, real feelings</h4>
      <p class="lead">Because we’re all just trying to feel like ourselves, but better.</p>
      <div class="cards">
        <div class="card">
          <div class="name">Sarah</div>
          <p>“Finally, a wellness brand that doesn’t make me feel like I’m failing at life. These shots just... get it.”<br><br>— Sarah, 29, Marketing Director</p>
        </div>
        <div class="card">
          <div class="name">Maya</div>
          <p>“The POWER shot is my secret weapon for those hormonal weeks when I usually want to hide under a blanket”<br><br>— Maya, 34, Entrepreneur</p>
        </div>
        <div class="card">
          <div class="name">Jess</div>
          <p class="black">“I’ve never been consistent with supplements, but this one feels like self-care, not homework.”<br><br>— Jess, 26, Designer</p>
        </div>
        <div class="card">
          <div class="name">Julie</div>
          <p>“The energy shot is my go-to boost before training, it helps me push through tough sessions and recover with strength.”<br>— Julie, 27, Fitness Coach</p>
        </div>
      </div>
    </section>

    <footer>
      © 2025 with 🩷 by bossbaby
    </footer>
  </body>
</html>
