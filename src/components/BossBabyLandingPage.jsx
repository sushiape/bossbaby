<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bossbaby</title>

  <!-- Poppins font -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;600;700;800&display=swap" rel="stylesheet" />

  <style>
    :root{
      --pink:#FF89CC;
      --pink-cta:#FF89CC;
      --text:#000000;
      --text-dim:rgba(0,0,0,0.66);
      --teal:#002B26;
      --bg:#FAF5F6;
      --cream:#FFF8F8;
      --white:#FFFFFF;
    }
    *{box-sizing:border-box}
    html,body{margin:0;padding:0;font-family:'Poppins',sans-serif;color:var(--text);background:var(--bg)}
    a{text-decoration:none;color:inherit}

    /* Container helpers */
    .container{max-width:1120px;margin:0 auto;padding:0 16px}
    .center{text-align:center}

    /* Header */
    header{
      position:sticky;top:0;z-index:50;
      backdrop-filter:saturate(180%) blur(6px);
      background:rgba(255,255,255,0.8);
      border-bottom:1px solid #eee;
    }
    .nav{
      display:flex;align-items:center;justify-content:space-between;
      padding:16px 0;
    }
    .brand{font-size:2.25rem;line-height:1;font-weight:300}
    .menu{display:flex;gap:24px}
    .menu a{font-size:20px;font-weight:400;opacity:0.95}
    .menu a:hover{opacity:0.7}

    /* Hero */
    .hero{background:var(--pink);padding:96px 0}
    .hero h1{
      color:#fff;margin:0;line-height:0.95;
      font-size:128px;font-weight:800;letter-spacing:-0.5px;
    }
    .hero p{
      margin:24px auto 0;color:var(--text);
      font-size:22px;max-width:720px;font-weight:400;
    }
    .cta{
      display:inline-block;margin-top:40px;
      padding:14px 32px;border-radius:16px;
      background:var(--white);color:var(--pink-cta);
      font-size:22px;font-weight:800;box-shadow:0 6px 18px rgba(0,0,0,0.12);
      transition:opacity .2s ease, transform .06s ease;
      text-transform:none;
    }
    .cta:hover{opacity:0.9}
    .cta:active{transform:translateY(1px)}

    /* Email signup */
    .signup{background:var(--cream);padding:64px 0}
    .signup h2{font-size:40px;font-weight:200;margin:0}
    .signup form{margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
    .input{
      width:min(420px,90vw);padding:12px 14px;border:1px solid #ddd;border-radius:12px;
      font-size:15px;color:var(--text-dim);outline:none;
    }
    .go{
      padding:12px 20px;border:1px solid #000;border-radius:12px;
      font-size:15px;background:transparent;cursor:pointer;
      transition:all .15s ease;
    }
    .go:hover{background:#000;color:#fff}

    /* Feature */
    .feature{background:#fff;padding:80px 0}
    .feature h3{font-size:48px;font-weight:300;margin:0}
    .feature p.title{font-size:48px;font-weight:300;margin:8px 0 0}
    .pills{display:flex;gap:12px;justify-content:center;margin-top:28px}
    .pill{width:14.65px;height:39.46px;border-radius:50px}
    .pill.dark{background:#1D3227}
    .pill.pink{background:#E97D8F}
    .pill.blush{background:#FFD1DC}

    /* Community */
    .community{background:#EAEDDC;padding:80px 0}
    .community h4{
      color:var(--teal);font-size:37.03px;line-height:40px;font-weight:700;letter-spacing:.6px;margin:0 0 8px
    }
    .community p.lead{
      color:var(--teal);font-size:23.44px;line-height:31.2px;letter-spacing:.6px;margin:0 0 28px
    }
    .grid{display:grid;gap:16px;grid-template-columns:repeat(2,minmax(0,1fr))}
    .card{background:#fff;border-radius:16px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.06)}
    .card .name{color:var(--teal);font-size:15px;line-height:22.4px;font-weight:700;letter-spacing:.6px}
    .card p{color:var(--teal);font-size:16px;line-height:24px;letter-spacing:1px;margin:8px 0 0}
    .card p.black{color:#000}

    /* Footer */
    footer{background:#fff;padding:40px 0;border-top:1px solid #eee}
    .foottext{font-size:15px;font-weight:300}

    /* Responsive */
    @media (max-width:1024px){
      .hero h1{font-size:96px}
    }
    @media (max-width:768px){
      .hero h1{font-size:64px}
      .brand{font-size:1.75rem}
      .menu{gap:16px}
      .menu a{font-size:18px}
      .grid{grid-template-columns:1fr}
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header>
    <div class="container nav">
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

  <!-- Hero -->
  <section id="home" class="hero">
    <div class="container center">
      <h1>Nutrition drinks <br /> made for her.</h1>
      <p>Empowering women with every sip.</p>
      <a href="#buy" class="cta">buy</a>
    </div>
  </section>

  <!-- Email signup -->
  <section class="signup">
    <div class="container center">
      <h2>Ready to feel unstoppable?</h2>
      <form action="#" method="post" autocomplete="on">
        <input class="input" type="email" name="email" placeholder="enter your email" required />
        <button class="go" type="submit">GO</button>
      </form>
    </div>
  </section>

  <!-- Product feature -->
  <section id="products" class="feature">
    <div class="container center">
      <h3>World’s first AI-powered smoothie machine</h3>
      <p class="title">Stay tuned!</p>
      <div class="pills">
        <div class="pill dark"></div>
        <div class="pill pink"></div>
        <div class="pill blush"></div>
      </div>
    </div>
  </section>

  <!-- Community -->
  <section id="community" class="community">
    <div class="container">
      <div class="center">
        <h4>Real women, real feelings</h4>
        <p class="lead">Because we’re all just trying to feel like ourselves, but better.</p>
      </div>

      <div class="grid">
        <article class="card">
          <div class="name">Sarah</div>
          <p>“Finally, a wellness brand that doesn’t make me feel like I’m failing at life. These shots just... get it.”<br><br>— Sarah, 29, Marketing Director</p>
        </article>

        <article class="card">
          <div class="name">Maya</div>
          <p>“The POWER shot is my secret weapon for those hormonal weeks when I usually want to hide under a blanket”<br><br>— Maya, 34, Entrepreneur</p>
        </article>

        <article class="card">
          <div class="name">Jess</div>
          <p class="black">“I’ve never been consistent with supplements, but this one feels like self-care, not homework.”<br><br>— Jess, 26, Designer</p>
        </article>

        <article class="card">
          <div class="name">Julie</div>
          <p>“The POWER shot is my go-to boost before training — it helps me push through tough sessions and recover with strength.”<br>— Julie, 27, Fitness Coach</p>
        </article>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="container center">
      <div class="foottext">© 2025 with 🩷 by bossbaby</div>
    </div>
  </footer>

</body>
</html>

