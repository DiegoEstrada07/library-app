import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const BORROWED_STORAGE_KEY = 'libraryBorrowedBooks';
const PURCHASED_STORAGE_KEY = 'libraryPurchasedBooks';
const AUTH_STORAGE_KEY = 'libraryIsLoggedIn';

const readStoredList = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const AboutUs = () => {
  const [borrowedCount, setBorrowedCount] = useState(
    () => readStoredList(BORROWED_STORAGE_KEY).length
  );
  const [purchasedCount, setPurchasedCount] = useState(
    () => readStoredList(PURCHASED_STORAGE_KEY).length
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  );

  useEffect(() => {
    const syncCartCounts = () => {
      setBorrowedCount(readStoredList(BORROWED_STORAGE_KEY).length);
      setPurchasedCount(readStoredList(PURCHASED_STORAGE_KEY).length);
      setIsLoggedIn(localStorage.getItem(AUTH_STORAGE_KEY) === 'true');
    };

    syncCartCounts();
    window.addEventListener('storage', syncCartCounts);
    window.addEventListener('focus', syncCartCounts);

    return () => {
      window.removeEventListener('storage', syncCartCounts);
      window.removeEventListener('focus', syncCartCounts);
    };
  }, []);

  return (
    <div className="aboutus-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Nunito+Sans:wght@300;400;600;700&display=swap');

        :root {
          --ink: #12110e;
          --muted: #4e4a45;
          --paper: #f7f4ef;
          --accent: #c2562d;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: var(--paper);
        }

        .aboutus-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          color: var(--ink);
          font-family: 'Nunito Sans', 'Segoe UI', sans-serif;
          background:
            radial-gradient(circle at 10% 10%, rgba(217, 75, 96, 0.08), transparent 45%),
            radial-gradient(circle at 85% 20%, rgba(122, 144, 126, 0.1), transparent 50%),
            linear-gradient(180deg, #faf8f5 0%, #f7f4ef 50%, #ffffff 100%);
          padding: 28px 60px 0;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          letter-spacing: 1.5px;
          font-size: 20px;
        }

        .logo span {
          color: var(--accent);
        }

        .nav-links {
          display: flex;
          gap: 26px;
          font-size: 15px;
          color: var(--muted);
        }

        .nav-links a {
          text-decoration: none;
          color: inherit;
          font-weight: 600;
        }

        .cart-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: none;
          background: var(--ink);
          color: #fff;
          display: grid;
          place-items: center;
          font-size: 18px;
          cursor: pointer;
          text-decoration: none;
        }

        .cart-wrap {
          position: relative;
          display: inline-grid;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .account-link {
          text-decoration: none;
          color: var(--ink);
          font-size: 14px;
          font-weight: 700;
        }

        .cart-btn svg {
          width: 20px;
          height: 20px;
          stroke: #fff;
        }

        .cart-badge {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
          display: grid;
          place-items: center;
          border: 2px solid #fff;
          color: #fff;
          pointer-events: none;
        }

        .cart-badge.borrowed {
          top: -6px;
          right: -8px;
          background: #b12e45;
        }

        .cart-badge.purchased {
          bottom: -6px;
          right: -8px;
          background: #2f6cb4;
        }

        .about {
          display: flex;
          align-items: center;
          min-height: 50vh;
          margin-top: 40px;
        }

        .hero h2 {
          font-size: clamp(38px, 5vw, 64px);
          font-family: 'Cormorant Garamond', serif;
          margin: 0 0 16px;
        }

        .hero p {
          font-size: 1.0625rem;
          max-width: 700px;
          line-height: 1.7;
          color: var(--muted);
          margin: 0;
        }

        .gradient-bar {
          width: calc(100% + 120px);
          margin: 0 -60px;
          height: 7px;
          background: linear-gradient(90deg, #6d0b6f 0%, #aa1f6b 35%, #ff4b4b 60%, #f8c21b 100%);
          filter: blur(0.5px);
        }

        .values {
          margin-top: 36px;
          text-align: center;
        }

        .card h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          margin: 20px 0 14px;
        }

        .card p {
          font-size: 1.1rem;
          color: var(--muted);
          max-width: 760px;
          margin: 0 auto;
          line-height: 1.8;
        }

        .team {
          margin-top: 60px;
        }

        .team h2 {
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
        }

        .team-members {
          display: flex;
          gap: 20px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .member {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          flex: 1;
          text-align: center;
          min-width: 220px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .member h4 {
          margin: 0 0 5px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
        }

        .member span {
          color: #777;
          font-size: 0.9rem;
        }

        @media (max-width: 980px) {
          .aboutus-page {
            padding: 24px 28px 0;
          }

          .gradient-bar {
            width: calc(100% + 56px);
            margin: 0 -28px;
          }
        }

        @media (max-width: 640px) {
          .nav-links {
            display: none;
          }
        }
      `}</style>

      <header className="nav">
        <div className="logo">
          BOOKCLUB<span>.</span>
        </div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/catalog">Catalog</Link>
          <Link to="/aboutUs">About Us</Link>
        </nav>
        <div className="nav-actions">
          <Link className="account-link" to="/login">
            {isLoggedIn ? 'My Account' : 'Log in'}
          </Link>
          <div className="cart-wrap">
          <Link
            className="cart-btn"
            to="/login"
            aria-label={`Carrito: ${borrowedCount} prestados y ${purchasedCount} comprados`}
            title={`Prestados: ${borrowedCount} | Comprados: ${purchasedCount}`}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 4h2l1.7 9.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4l1.6-5.1H7.1"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="19" r="1.4" fill="#fff" stroke="none" />
              <circle cx="17" cy="19" r="1.4" fill="#fff" stroke="none" />
            </svg>
          </Link>
          <span className="cart-badge borrowed" aria-hidden="true">
            {borrowedCount}
          </span>
          <span className="cart-badge purchased" aria-hidden="true">
            {purchasedCount}
          </span>
          </div>
        </div>
      </header>

      <section className="about">
        <div className="hero">
          <h2>About Us</h2>
          <p>
            In <strong>Library</strong>, we believe books have the power to
            transform, inspire, and connect people. Since our beginnings, we
            have worked to create a warm and welcoming space for readers of all
            ages.
          </p>
        </div>
      </section>

      <div className="gradient-bar" />

      <section className="values">
        <div className="card">
          <h3>Our Mission</h3>
          <p>
            To foster a love for reading by offering a carefully curated
            selection of books and a close, passionate service.
          </p>
        </div>

        <div className="card">
          <h3>Our Vision</h3>
          <p>
            To become a reference bookstore in the community and a cultural and
            literary meeting point.
          </p>
        </div>
      </section>

      <section className="team">
        <h2>Our team</h2>
        <div className="team-members">
          <div className="member">
            <h4>Diego</h4>
            <span>Product Owner & Developer</span>
          </div>
          <div className="member">
            <h4>Andrea</h4>
            <span>Scrum Master & Developer</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;


