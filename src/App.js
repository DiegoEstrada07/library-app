import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';
import { useAppState } from './context/AppStateContext';

const SUBJECT_URL =
  import.meta.env.VITE_OPENLIBRARY_TRENDING_SUBJECT_URL ||
  'https://openlibrary.org/subjects/public_domain.json?limit=8';
const BORROWED_STORAGE_KEY = 'libraryBorrowedBooks';
const PURCHASED_STORAGE_KEY = 'libraryPurchasedBooks';
const AUTH_STORAGE_KEY = 'libraryIsLoggedIn';

const coverUrl = (coverId) =>
  coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : '';

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

const App = () => {
  const { showToast } = useAppState();
  const navigate = useNavigate();
  const bookGridRef = useRef(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowedCount, setBorrowedCount] = useState(
    () => readStoredList(BORROWED_STORAGE_KEY).length
  );
  const [purchasedCount, setPurchasedCount] = useState(
    () => readStoredList(PURCHASED_STORAGE_KEY).length
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    axios
      .get(SUBJECT_URL)
      .then((data) => {
        if (!isMounted) return;
        const works = Array.isArray(data?.data?.works) ? data.data.works : [];
        setBooks(works.slice(0, 8));
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setBooks([]);
        setLoading(false);
        showToast('Trending books could not be loaded.', 'error');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const scrollTrending = (direction) => {
    const container = bookGridRef.current;
    if (!container) return;

    const firstCard = container.querySelector('.book-card');
    const gapValue = window.getComputedStyle(container).gap || '0';
    const gap = Number.parseFloat(gapValue) || 0;
    const step = firstCard ? firstCard.getBoundingClientRect().width + gap : 240;

    container.scrollBy({
      left: direction === 'next' ? step : -step,
      behavior: 'smooth',
    });
  };

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
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Nunito+Sans:wght@300;400;600;700&display=swap');

        :root {
          --ink: #12110e;
          --muted: #4e4a45;
          --paper: #f7f4ef;
          --accent: #c2562d;
          --gold: #f5b32c;
          --sage: #7a907e;
          --sun: #f2c400;
          --rose: #d94b60;
          --rose-dark: #b12e45;
          --shadow: 0 24px 60px rgba(18, 17, 14, 0.12);
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: var(--paper);
        }

        .page {
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

        .nav-menu-btn {
          display: none;
          width: 42px;
          height: 42px;
          border: 1px solid #d8d3cb;
          border-radius: 10px;
          background: #fff;
          padding: 0;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          gap: 4px;
          flex-direction: column;
        }

        .nav-menu-btn span {
          display: block;
          width: 18px;
          height: 2px;
          background: var(--ink);
          border-radius: 999px;
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

        .hero {
          display: grid;
          grid-template-columns: minmax(280px, 1.1fr) minmax(320px, 1fr);
          gap: 40px;
          margin-top: 70px;
          align-items: center;
        }

        .hero h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 5vw, 64px);
          line-height: 1.05;
          letter-spacing: 0.5px;
          margin: 0 0 18px;
        }

        .hero p {
          max-width: 520px;
          line-height: 1.7;
          color: var(--muted);
          margin: 0 0 26px;
        }

        .hero-cta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 30px;
        }

        .btn-primary {
          border: 1px solid var(--ink);
          background: transparent;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .btn-icon {
          min-width: 44px;
          height: 44px;
          padding: 0 14px;
          border-radius: 10px;
          border: none;
          background: var(--ink);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          line-height: 1;
          cursor: pointer;
        }

        .community {
          display: flex;
          align-items: center;
          color: var(--muted);
          font-size: 13px;
        }

        .hero-right {
          position: relative;
          min-height: 360px;
          display: grid;
          place-items: center;
        }

        .hero-book {
          width: 210px;
          height: 290px;
          border-radius: 10px;
          box-shadow: var(--shadow);
          display: grid;
          place-items: center;
          font-family: 'Cormorant Garamond', serif;
          text-align: center;
          padding: 16px;
        }

        .hero-book.main {
          background: #728b7c;
          transform: rotate(-8deg);
          z-index: 2;
          color: #fff;
        }

        .hero-book.accent {
          background: #f0c719;
          transform: rotate(10deg) translateX(90px) translateY(40px);
          color: #1b1b1b;
        }

        .hero-book h3 {
          font-size: 18px;
          margin: 0 0 10px;
        }

        .hero-book span {
          font-family: 'Nunito Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .discount {
          position: absolute;
          right: 5%;
          top: 5%;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: var(--gold);
          color: #fff;
          display: grid;
          place-items: center;
          font-weight: 800;
          text-align: center;
          font-size: 18px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
        }

        .discount span {
          display: block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .steps {
          margin: 60px -60px 0;
          height: 110px;
          display: grid;
          align-items: end;
          background: linear-gradient(90deg, #6d0b6f 0%, #aa1f6b 35%, #ff4b4b 60%, #f8c21b 100%);
          mask: linear-gradient(180deg, transparent 0%, black 50%, black 100%);
        }

        .steps::after {
          content: '';
          display: block;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 25%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.5) 100%
          );
        }

        .trending {
          padding: 50px 0 0;
        }

        .trending h2 {
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(30px, 4vw, 48px);
          margin: 0 0 30px;
        }

        .carousel {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 18px;
        }

        .nav-btn {
          width: 46px;
          height: 46px;
          border-radius: 10px;
          border: 1px solid #d8d3cb;
          background: #fff;
          cursor: pointer;
          font-size: 18px;
        }

        .book-grid {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding-bottom: 6px;
          scroll-snap-type: x mandatory;
        }

        .book-grid::-webkit-scrollbar {
          height: 8px;
        }

        .book-grid::-webkit-scrollbar-thumb {
          background: #d8d3cb;
          border-radius: 999px;
        }

        .book-card {
          background: #fff;
          border-radius: 18px;
          padding: 18px;
          box-shadow: 0 16px 40px rgba(18, 17, 14, 0.08);
          min-height: 260px;
          min-width: 190px;
          display: grid;
          gap: 14px;
          scroll-snap-align: start;
        }

        .book-rank {
          align-self: start;
          justify-self: start;
          background: #12110e;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 5px 10px;
          border-radius: 999px;
          letter-spacing: 0.2px;
        }

        .book-cover {
          width: 100%;
          height: 140px;
          border-radius: 12px;
          background: linear-gradient(140deg, #f2d6c1, #c96b65);
          display: grid;
          place-items: center;
          overflow: hidden;
        }

        .book-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .book-title {
          font-size: 15px;
          font-weight: 700;
        }

        .book-author {
          font-size: 12px;
          color: var(--muted);
        }

        .book-pill {
          align-self: start;
          justify-self: start;
          background: #f4efe7;
          color: #6b645b;
          font-size: 11px;
          padding: 6px 10px;
          border-radius: 999px;
        }

        .loading {
          text-align: center;
          color: var(--muted);
          grid-column: 1 / -1;
        }

        .footer {
          margin-top: 70px;
          padding: 36px 0 10px;
          border-top: 1px solid #e6e0d7;
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1fr;
          gap: 24px;
          color: var(--muted);
        }

        .footer h4 {
          margin: 0 0 12px;
          color: var(--ink);
          font-size: 14px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .footer p {
          margin: 0;
          line-height: 1.7;
          font-size: 13px;
        }

        .footer a {
          color: inherit;
          text-decoration: none;
          font-size: 13px;
          display: block;
          margin-bottom: 8px;
        }

        .footer-bottom {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #8c857b;
          padding-top: 12px;
        }

        .socials {
          display: flex;
          gap: 10px;
        }

        .socials span {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #d8d3cb;
          display: grid;
          place-items: center;
          font-size: 14px;
        }

        @media (max-width: 980px) {
          .page {
            padding: 24px 28px 0;
          }

          .hero {
            grid-template-columns: 1fr;
          }

          .hero-right {
            order: -1;
            margin-bottom: 30px;
          }

          .steps {
            margin: 40px -28px 0;
          }
        }

        @media (max-width: 640px) {
          .nav {
            flex-wrap: wrap;
            justify-content: flex-start;
          }

          .nav-menu-btn {
            display: inline-flex;
            margin-left: 10px;
          }

          .nav-links {
            display: none;
            width: 100%;
            order: 4;
            margin-top: 12px;
            padding: 12px;
            border: 1px solid #e6e0d7;
            border-radius: 12px;
            background: #fff;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .nav-links.open {
            display: flex;
          }

          .nav-actions {
            margin-left: auto;
          }

          .carousel {
            grid-template-columns: auto 1fr auto;
            gap: 8px;
          }

          .nav-btn {
            width: 34px;
            height: 34px;
            border-radius: 999px;
            font-size: 16px;
            display: grid;
            place-items: center;
          }

          .book-grid {
            gap: 0;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            touch-action: pan-x;
          }

          .book-grid::-webkit-scrollbar {
            display: none;
          }

          .book-card {
            min-width: 100%;
            width: 100%;
            scroll-snap-align: start;
          }

          .footer {
            grid-template-columns: 1fr;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>

      <header className="nav">
        <div className="logo">
          BOOKCLUB<span>.</span>
        </div>
        <button
          className="nav-menu-btn"
          type="button"
          aria-controls="primary-nav-home"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav id="primary-nav-home" className={`nav-links${isMenuOpen ? ' open' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/catalog" onClick={() => setIsMenuOpen(false)}>Catalog</Link>
          <Link to="/aboutUs" onClick={() => setIsMenuOpen(false)}>About Us</Link>
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

      <section className="hero">
        <div className="hero-left">
          <h1>What book are you looking for?</h1>
          <p>
            Not sure what to read next? Explore our catalog of public domain
            books curated by our editors. Discover stories that keep you
            inspired and curious.
          </p>
          <div className="hero-cta">
            <button
              className="btn-primary"
              type="button"
              onClick={() => navigate('/catalog')}
            >
              Explore now
            </button>
            <button
              className="btn-icon"
              type="button"
              aria-label="Log in"
              title="Go to Log in"
              onClick={() => navigate('/login')}
            >
              Log in <span aria-hidden="true">{'\u2192'}</span>
            </button>
          </div>
          <div className="community">
            <div>
              <strong>40k+</strong> book lovers joined
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="discount">
            60%
            <span>Off</span>
          </div>
          <div className="hero-book main">
            <div>
              <h3>The Psychology of Money</h3>
              <span>Morgan Housel</span>
            </div>
          </div>
          <div className="hero-book accent">
            <div>
              <h3>How Innovation Works</h3>
              <span>Matt Ridley</span>
            </div>
          </div>
        </div>
      </section>

      <div className="steps" aria-hidden="true" />

      <section className="trending">
        <h2>Top Trending Books</h2>
        <div className="carousel">
          <button className="nav-btn" type="button" aria-label="Previous" onClick={() => scrollTrending('prev')}>
            {'\u2190'}
          </button>
          <div className="book-grid" ref={bookGridRef}>
            {loading && <div className="loading">Loading books...</div>}
            {!loading && books.length === 0 && (
              <div className="loading">
                We could not load the catalog right now.
              </div>
            )}
            {books.map((book, index) => (
              <article className="book-card" key={book.key}>
                <div className="book-rank">#{index + 1}</div>
                <div className="book-cover">
                  {book.cover_id ? (
                    <img
                      src={coverUrl(book.cover_id)}
                      alt={book.title}
                      loading="lazy"
                    />
                  ) : (
                    <span>Classic</span>
                  )}
                </div>
                <div className="book-title">{book.title}</div>
                <div className="book-author">
                  {(book.authors || [])
                    .map((author) => author.name)
                    .join(', ') || 'Unknown author'}
                </div>
                <div className="book-pill">Public Domain</div>
              </article>
            ))}
          </div>
          <button className="nav-btn" type="button" aria-label="Next" onClick={() => scrollTrending('next')}>
            {'\u2192'}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default App;





