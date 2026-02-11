import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';
import { useAppState } from './context/AppStateContext';

const SUBJECT_URL = 'https://openlibrary.org/subjects/public_domain.json?limit=40';

const coverUrl = (coverId) =>
  coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : '';

const Catalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevant');
  const [activeBook, setActiveBook] = useState(null);
  const [authNotice, setAuthNotice] = useState('');
  const {
    isLoggedIn,
    borrowedBooks,
    purchasedBooks,
    addBorrowedBook,
    addPurchasedBook,
  } = useAppState();
  const [filters, setFilters] = useState({
    withCover: false,
    withAuthor: false,
    digital: false,
    classic: false,
    popular: false,
    shortTitle: false,
  });
  const [activeChip, setActiveChip] = useState('all');
  const borrowedCount = borrowedBooks.length;
  const purchasedCount = purchasedBooks.length;

  useEffect(() => {
    let isMounted = true;

    axios
      .get(SUBJECT_URL)
      .then((data) => {
        if (!isMounted) return;
        const works = Array.isArray(data?.data?.works) ? data.data.works : [];
        setBooks(works.slice(0, 40));
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setBooks([]);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const chips = useMemo(() => {
    const subjectCount = {};
    books.forEach((book) => {
      (book.subject || []).slice(0, 4).forEach((subject) => {
        subjectCount[subject] = (subjectCount[subject] || 0) + 1;
      });
    });
    const topSubjects = Object.entries(subjectCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name]) => name);
    return ['all', ...topSubjects];
  }, [books]);

  const filteredBooks = useMemo(() => {
    let list = [...books];

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter((book) => {
        const authorNames = (book.authors || [])
          .map((author) => author.name.toLowerCase())
          .join(' ');
        return book.title.toLowerCase().includes(q) || authorNames.includes(q);
      });
    }

    if (activeChip !== 'all') {
      list = list.filter((book) => (book.subject || []).includes(activeChip));
    }

    if (filters.withCover) {
      list = list.filter((book) => Boolean(book.cover_id));
    }
    if (filters.withAuthor) {
      list = list.filter((book) => Array.isArray(book.authors) && book.authors.length > 0);
    }
    if (filters.digital) {
      list = list.filter((book) => book.availability && book.availability.is_readable);
    }
    if (filters.classic) {
      list = list.filter((book) => (book.first_publish_year || 3000) <= 1950);
    }
    if (filters.popular) {
      list = list.filter((book) => (book.edition_count || 0) >= 25);
    }
    if (filters.shortTitle) {
      list = list.filter((book) => book.title.trim().split(/\s+/).length <= 4);
    }

    if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'year') {
      list.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
    } else if (sortBy === 'popular') {
      list.sort((a, b) => (b.edition_count || 0) - (a.edition_count || 0));
    }

    return list;
  }, [books, searchTerm, sortBy, filters, activeChip]);

  const handleFilterToggle = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toListBook = (book) => ({
    id: book.key,
    title: book.title,
    author:
      (book.authors || [])
        .map((author) => author.name)
        .join(', ') || 'Unknown author',
    due: '2026-03-01',
    format: 'EPUB',
  });

  const handleAddBorrowed = () => {
    if (!isLoggedIn) {
      setAuthNotice('You need to log in before adding books to borrowed.');
      return;
    }
    if (!activeBook) return;
    const mapped = toListBook(activeBook);
    addBorrowedBook(mapped);
  };

  const handleAddPurchased = () => {
    if (!isLoggedIn) {
      setAuthNotice('You need to log in before adding books to purchased.');
      return;
    }
    if (!activeBook) return;
    const mapped = toListBook(activeBook);
    addPurchasedBook(mapped);
  };

  return (
    <div className="catalog-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Nunito+Sans:wght@300;400;600;700&display=swap');

        :root {
          --ink: #12110e;
          --muted: #4e4a45;
          --paper: #f7f4ef;
          --accent: #c2562d;
          --surface: #ffffff;
          --line: #e8e1d8;
          --shadow: 0 16px 40px rgba(18, 17, 14, 0.08);
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: var(--paper);
        }

        .catalog-page {
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

        .search-row {
          margin-top: 26px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
        }

        .search-row input {
          width: 100%;
          border: 1px solid var(--line);
          background: var(--surface);
          border-radius: 14px;
          height: 52px;
          padding: 0 16px;
          font-size: 15px;
          outline: none;
          box-shadow: 0 4px 12px rgba(18, 17, 14, 0.04);
        }

        .result-count {
          display: grid;
          place-items: center;
          background: #f4efe7;
          border: 1px solid #e5ddd2;
          border-radius: 14px;
          padding: 0 18px;
          min-width: 140px;
          font-weight: 700;
          color: var(--muted);
        }

        .catalog-toolbar {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .breadcrumb {
          color: #7d766c;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .sort-group {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--muted);
          font-size: 14px;
          white-space: nowrap;
        }

        .sort-group select {
          border-radius: 10px;
          border: 1px solid var(--line);
          background: #fff;
          height: 40px;
          padding: 0 12px;
          color: var(--ink);
        }

        .chip-row {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 4px 2px 6px;
          margin-bottom: 16px;
        }

        .chip {
          border: 1px solid #ddd5ca;
          background: #fff;
          color: #5d564d;
          border-radius: 999px;
          padding: 9px 14px;
          font-size: 13px;
          white-space: nowrap;
          cursor: pointer;
        }

        .chip.active {
          border-color: var(--ink);
          color: #fff;
          background: var(--ink);
        }

        .catalog-layout {
          margin-top: 14px;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 26px;
          align-items: start;
        }

        .filters {
          display: grid;
          gap: 12px;
        }

        .filter-card {
          background: #fff;
          border: 1px solid #e8e1d8;
          border-radius: 14px;
          padding: 14px 16px;
          box-shadow: 0 6px 18px rgba(18, 17, 14, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .filter-title {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
        }

        .filter-sub {
          margin: 2px 0 0;
          font-size: 13px;
          color: #6d665d;
        }

        .switch {
          position: relative;
          width: 50px;
          height: 28px;
          flex-shrink: 0;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          inset: 0;
          cursor: pointer;
          background: #d9d3c8;
          border-radius: 999px;
          transition: 0.2s ease;
        }

        .slider::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          left: 4px;
          top: 4px;
          border-radius: 50%;
          background: #fff;
          transition: 0.2s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.16);
        }

        .switch input:checked + .slider {
          background: #7a907e;
        }

        .switch input:checked + .slider::before {
          transform: translateX(22px);
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 18px;
        }

        .book-card {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: var(--shadow);
          display: grid;
        }

        .book-cover {
          height: 250px;
          background: linear-gradient(135deg, #f2d7c8, #d7e4f6);
          display: grid;
          place-items: center;
          overflow: hidden;
          border: none;
          padding: 0;
          width: 100%;
          cursor: pointer;
        }

        .book-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .book-cover:focus-visible {
          outline: 3px solid #2f6cb4;
          outline-offset: -3px;
        }

        .no-cover {
          color: #5b5348;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          font-size: 22px;
          letter-spacing: 0.6px;
        }

        .book-body {
          padding: 14px 14px 16px;
          display: grid;
          gap: 8px;
        }

        .tag {
          justify-self: start;
          background: #ffe2c9;
          color: #8d3f0d;
          font-size: 11px;
          font-weight: 700;
          padding: 5px 8px;
          border-radius: 999px;
          text-transform: uppercase;
        }

        .book-title {
          margin: 0;
          font-size: 19px;
          line-height: 1.25;
          font-family: 'Cormorant Garamond', serif;
        }

        .book-author {
          color: var(--muted);
          font-size: 14px;
        }

        .book-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: #6a6258;
          padding-top: 2px;
        }

        .meta-rate {
          color: #2f6cb4;
          font-weight: 700;
        }

        .state {
          grid-column: 1 / -1;
          border: 1px dashed #d5ccc1;
          background: #fff;
          border-radius: 14px;
          min-height: 170px;
          display: grid;
          place-items: center;
          color: #6b645b;
          text-align: center;
          padding: 12px;
        }

        @media (max-width: 980px) {
          .catalog-page {
            padding: 24px 28px 0;
          }

          .catalog-layout {
            grid-template-columns: 1fr;
          }

          .filters {
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          }
        }

        @media (max-width: 640px) {
          .nav-links {
            display: none;
          }

          .catalog-toolbar {
            flex-direction: column;
            align-items: flex-start;
          }

          .search-row {
            grid-template-columns: 1fr;
          }
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(18, 17, 14, 0.55);
          display: grid;
          place-items: center;
          padding: 20px;
          z-index: 30;
        }

        .modal-card {
          width: min(560px, 100%);
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 24px 60px rgba(18, 17, 14, 0.25);
          padding: 20px;
          display: grid;
          gap: 12px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          gap: 12px;
        }

        .modal-title {
          margin: 0;
          font-size: 24px;
          font-family: 'Cormorant Garamond', serif;
        }

        .modal-close {
          border: 1px solid #d6cec2;
          background: #fff;
          border-radius: 10px;
          width: 34px;
          height: 34px;
          cursor: pointer;
        }

        .modal-content {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 14px;
          align-items: start;
        }

        .modal-media {
          width: 100%;
          height: 240px;
          border: 1px solid #e3dbcf;
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(135deg, #f2d7c8, #d7e4f6);
          display: grid;
          place-items: center;
        }

        .modal-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .details-grid {
          display: grid;
          gap: 8px;
          font-size: 14px;
          color: #5f574e;
        }

        .details-grid strong {
          color: #12110e;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .action-btn {
          border: 1px solid #d9d2c8;
          border-radius: 10px;
          background: #fff;
          color: #12110e;
          padding: 10px 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .action-btn.primary {
          background: #12110e;
          color: #fff;
          border-color: #12110e;
        }

        .action-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .auth-notice {
          color: #b12e45;
          font-size: 13px;
          font-weight: 600;
        }

        .auth-login-link {
          color: #12110e;
          font-size: 13px;
          font-weight: 700;
          text-decoration: underline;
          width: fit-content;
        }

        @media (max-width: 640px) {
          .modal-content {
            grid-template-columns: 1fr;
          }

          .modal-media {
            height: 220px;
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

      <section className="search-row">
        <input
          type="search"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          aria-label="Search books"
        />
        <div className="result-count">{filteredBooks.length} books</div>
      </section>

      <section className="catalog-toolbar">
        <div className="breadcrumb">
          <span>Home</span>
          <span>{'>'}</span>
          <span>Catalog</span>
          <span>{'>'}</span>
          <span>Public Domain</span>
        </div>
        <div className="sort-group">
          <span>Sort by</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="relevant">Most relevant</option>
            <option value="popular">Most popular</option>
            <option value="title">Title A-Z</option>
            <option value="year">Newest year</option>
          </select>
        </div>
      </section>

      <section className="catalog-layout">
        <aside className="filters">
          <div className="filter-card">
            <div>
              <p className="filter-title">Only with cover</p>
              <p className="filter-sub">Show books with image preview</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={filters.withCover}
                onChange={() => handleFilterToggle('withCover')}
              />
              <span className="slider" />
            </label>
          </div>
          <div className="filter-card">
            <div>
              <p className="filter-title">Known author</p>
              <p className="filter-sub">Hide books without author details</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={filters.withAuthor}
                onChange={() => handleFilterToggle('withAuthor')}
              />
              <span className="slider" />
            </label>
          </div>
          <div className="filter-card">
            <div>
              <p className="filter-title">Readable online</p>
              <p className="filter-sub">Books with digital access</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={filters.digital}
                onChange={() => handleFilterToggle('digital')}
              />
              <span className="slider" />
            </label>
          </div>
          <div className="filter-card">
            <div>
              <p className="filter-title">Classics</p>
              <p className="filter-sub">Published before 1950</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={filters.classic}
                onChange={() => handleFilterToggle('classic')}
              />
              <span className="slider" />
            </label>
          </div>
          <div className="filter-card">
            <div>
              <p className="filter-title">Popular editions</p>
              <p className="filter-sub">At least 25 editions</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={filters.popular}
                onChange={() => handleFilterToggle('popular')}
              />
              <span className="slider" />
            </label>
          </div>
          <div className="filter-card">
            <div>
              <p className="filter-title">Short titles</p>
              <p className="filter-sub">Up to four words</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={filters.shortTitle}
                onChange={() => handleFilterToggle('shortTitle')}
              />
              <span className="slider" />
            </label>
          </div>
        </aside>

        <div>
          <div className="chip-row">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                className={`chip ${activeChip === chip ? 'active' : ''}`}
                onClick={() => setActiveChip(chip)}
              >
                {chip === 'all' ? 'All categories' : chip}
              </button>
            ))}
          </div>

          <div className="results-grid">
            {loading && <div className="state">Loading catalog...</div>}
            {!loading && filteredBooks.length === 0 && (
              <div className="state">
                No books match your filters. Try another search or disable some filters.
              </div>
            )}
            {!loading &&
              filteredBooks.map((book) => {
                const rating = (4 + ((book.edition_count || 0) % 10) / 10).toFixed(1);
                const sales = (book.edition_count || 0) * 20;
                return (
                  <article className="book-card" key={book.key}>
                    <button
                      type="button"
                      className="book-cover"
                      onClick={() => {
                        setActiveBook(book);
                        setAuthNotice('');
                      }}
                      aria-label={`Show details for ${book.title}`}
                    >
                      {book.cover_id ? (
                        <img
                          src={coverUrl(book.cover_id)}
                          alt={book.title}
                          loading="lazy"
                        />
                      ) : (
                        <span className="no-cover">BOOKCLUB</span>
                      )}
                    </button>
                    <div className="book-body">
                      {(book.edition_count || 0) > 30 && <div className="tag">Best Seller</div>}
                      <h3 className="book-title">{book.title}</h3>
                      <div className="book-author">
                        {(book.authors || [])
                          .map((author) => author.name)
                          .join(', ') || 'Unknown author'}
                      </div>
                      <div className="book-meta">
                        <span className="meta-rate">* {rating}</span>
                        <span>+{sales} readers</span>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>
      </section>

      {activeBook && (
        <div className="modal-overlay" onClick={() => setActiveBook(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{activeBook.title}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setActiveBook(null)}
                aria-label="Close details"
              >
                x
              </button>
            </div>
            <div className="modal-content">
              <div className="modal-media">
                {activeBook.cover_id ? (
                  <img
                    src={coverUrl(activeBook.cover_id)}
                    alt={activeBook.title}
                    loading="lazy"
                  />
                ) : (
                  <span className="no-cover">BOOKCLUB</span>
                )}
              </div>
              <div className="details-grid">
                <div>
                  <strong>Book Details</strong>
                </div>
                <div>
                  Author:{' '}
                  {(activeBook.authors || []).map((author) => author.name).join(', ') ||
                    'Unknown author'}
                </div>
                <div>First publish year: {activeBook.first_publish_year || 'Unknown'}</div>
                <div>Edition count: {activeBook.edition_count || 0}</div>
                <div>
                  Readable online:{' '}
                  {activeBook.availability && activeBook.availability.is_readable ? 'Yes' : 'No'}
                </div>
                <div>
                  Subjects:{' '}
                  {(activeBook.subject || []).slice(0, 3).join(', ') || 'Not available'}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="action-btn"
                onClick={handleAddBorrowed}
                disabled={
                  !isLoggedIn || borrowedBooks.some((book) => book.id === activeBook.key)
                }
              >
                {!isLoggedIn
                  ? 'Log in required'
                  : borrowedBooks.some((book) => book.id === activeBook.key)
                  ? 'Already borrowed'
                  : 'Add to borrowed'}
              </button>
              <button
                type="button"
                className="action-btn primary"
                onClick={handleAddPurchased}
                disabled={
                  !isLoggedIn || purchasedBooks.some((book) => book.id === activeBook.key)
                }
              >
                {!isLoggedIn
                  ? 'Log in required'
                  : purchasedBooks.some((book) => book.id === activeBook.key)
                  ? 'Already purchased'
                  : 'Add to purchased'}
              </button>
            </div>
            {!isLoggedIn && (
              <>
                <div className="auth-notice">
                  {authNotice || 'Log in to add this book to borrowed or purchased lists.'}
                </div>
                <Link className="auth-login-link" to="/login">
                  Go to log in
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Catalog;
