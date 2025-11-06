<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bossbaby</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;600;700;800&display=swap" rel="stylesheet" />
    <style>
      body {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        background-color: #FAF5F6;
        color: black;
      }
      header {
        position: sticky;
        top: 0;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid #e5e5e5;
        z-index: 50;
      }
      .nav {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
      }
      .brand {
        font-size: 2rem;
        font-weight: 300;
      }
      .menu a {
        margin-left: 1.5rem;
        font-size: 20px;
        font-weight: 400;
        text-decoration: none;
        color: black;
      }
      .menu a:hover { opacity: 0.7; }
      .hero {
        background-color: #FF89CC;
        text-align: center;
        padding: 6rem 1rem;
      }
      .hero h1 {
        color: white;
        font-size: 128px;
        font-weight: 800;
        line-height: 1;
        margin: 0;
      }
      .hero p {
        font-size: 22px;
        color: black;
        margin-top: 1.5rem;
      }
      .hero .btn {
        display: inline-block;
        margin-top: 2rem;
        padding: 0.75rem 2rem;
        background: white;
        color: #FF89CC;
        font-weight: 800;
        font-size: 20px;
        border-radius: 16px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        text-decoration: none;
      }
      .signup {
        background: #FFF8F8;
        text-align: center;
        padding: 4rem 1rem;
      }
      .signup h2 { font-size: 40px; font-weight: 200; }
      .signup input {
        padding: 0.75rem 1rem;
        border-radius: 10px;
        border: 1px solid #ccc;
        font-size: 15px;
      }
      .signup button {
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        border: 1px solid black;
        background: transparent;
        cursor: pointer;
        transition: 0.3s;
      }
      .signup button:hover { background: black; color: white; }
      .products {
        text-align: center;
        background: white;
        padding: 5rem 1rem;
      }
      .products h3 {
        font-size: 48px;
        font-weight: 300;
        margin: 0;
      }
      .community {
        background: #EAEDDC;
        padding: 5rem 1rem;
      }
      .community h4 {
        font-size: 37px;
        font-weight: 700;
        color: #002B26;
        margin-bottom: 1rem;
      }
      .community p.lead {
        font-size: 23px;
        color: #002B26;
      }
      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
      }
      .card {
        background: white;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      .card .name { font-weight: 700; color: #002B26; margin-bottom: 0.5rem; }
      .card p { font-size: 16px; color: #002B26; }
      footer {
        background: white;
        text-align: center;
        padding: 2rem;
        font-size: 15px;
        font-weight: 300;
      }
    </style>
  </head>
  <body>
    <header>
      <div class="nav">
        <div class="brand">Bossbaby</div>
        <nav class="menu">
          <a href="#home">Home</a>
          <a h
