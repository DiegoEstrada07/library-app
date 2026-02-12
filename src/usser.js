import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { useAppState } from './context/AppStateContext';

const EMPTY_LIST_MESSAGE = 'No books in this list.';

const demoUsers = [
  { name: 'Emma Parker', email: 'emma@demo.com', password: 'Emma123!' },
  { name: 'James Carter', email: 'james@demo.com', password: 'Carter#45' },
];

const Usser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {
    isLoggedIn,
    currentUser,
    borrowedBooks,
    purchasedBooks: ownedEbooks,
    catalogEbooks,
    login,
    logout,
    returnBorrowedBook,
    updateBorrowedDueDate,
    addPurchasedBook,
    removePurchasedBook,
    removeCatalogEbook,
    showToast,
  } = useAppState();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    const match = demoUsers.find(
      (user) => user.email === email.trim() && user.password === password
    );

    if (!match) {
      setError('Invalid credentials. Try a demo user.');
      showToast('Invalid credentials. Try a demo user.', 'error');
      return;
    }

    login(match.name);
    showToast(`Welcome, ${match.name}.`, 'success');
  };

  const handleLogout = () => {
    logout();
    setEmail('');
    setPassword('');
    showToast('Session closed.', 'info');
  };

  const handleReturnBorrowed = (bookId) => {
    returnBorrowedBook(bookId);
    showToast('Book returned successfully.', 'success');
  };

  const handleRenewBorrowed = (bookId) => {
    updateBorrowedDueDate(bookId, 7);
    showToast('Due date updated (+7 days).', 'success');
  };

  const handleBuyEbook = (ebook) => {
    const existsInCatalog = catalogEbooks.some((item) => item.id === ebook.id);
    if (!existsInCatalog) {
      showToast('This ebook must be in the buy list before purchase.', 'error');
      return;
    }
    addPurchasedBook(ebook);
    showToast('Ebook added to purchased list.', 'success');
  };

  const handleRemoveCatalogEbook = (ebookId) => {
    removeCatalogEbook(ebookId);
    showToast('Ebook removed from catalog list.', 'info');
  };

  const visibleCatalogEbooks = catalogEbooks.filter(
    (ebook) => !ownedEbooks.some((item) => item.id === ebook.id)
  );
  const handleRemoveEbook = (ebookId) => {
    removePurchasedBook(ebookId);
    showToast('Ebook removed from purchased list.', 'info');
  };

  return (
    <div className="account-page">
      <style>{`
        .account-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 0;
          background:
            radial-gradient(circle at 10% 10%, rgba(217, 75, 96, 0.08), transparent 45%),
            radial-gradient(circle at 85% 20%, rgba(122, 144, 126, 0.1), transparent 50%),
            linear-gradient(180deg, #faf8f5 0%, #f7f4ef 50%, #ffffff 100%);
          font-family: 'Nunito Sans', 'Segoe UI', sans-serif;
          color: #12110e;
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(18, 17, 14, 0.08);
          background: rgba(250, 248, 245, 0.94);
          backdrop-filter: blur(8px);
        }

        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          letter-spacing: 1.5px;
          font-size: 20px;
        }

        .logo span {
          color: #c2562d;
        }

        .nav-links {
          display: flex;
          gap: 26px;
          font-size: 15px;
          color: #4e4a45;
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
          background: #12110e;
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
          color: #12110e;
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

        .account-main {
          flex: 1;
          width: 100%;
          display: grid;
          place-items: center;
          padding: 24px 24px 40px;
        }

        .account-page * {
          box-sizing: border-box;
        }

        .account-card {
          width: min(900px, 100%);
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 24px 60px rgba(18, 17, 14, 0.12);
          display: grid;
          grid-template-columns: minmax(260px, 320px) 1fr;
          gap: 32px;
          padding: 36px;
        }

        .account-panel {
          background: #f4efe7;
          border-radius: 18px;
          padding: 28px;
          display: grid;
          gap: 12px;
          align-content: start;
        }

        .account-panel h2 {
          margin: 0;
          font-size: 24px;
        }

        .account-panel p {
          margin: 0;
          color: #4e4a45;
          line-height: 1.6;
          font-size: 14px;
        }

        .account-form {
          display: grid;
          gap: 16px;
        }

        .account-form > div {
          display: grid;
          gap: 6px;
        }

        .account-form label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #7c7367;
        }

        .account-form input {
          width: 100%;
          height: 56px;
          border-radius: 16px;
          border: 1px solid #d6ccc0;
          background: #ffffff;
          padding: 0 18px;
          font-size: 14px;
          box-shadow: inset 0 1px 2px rgba(18, 17, 14, 0.06);
        }

        .account-form button {
          border: none;
          border-radius: 16px;
          padding: 16px;
          width: 100%;
          background: #12110e;
          color: #ffffff;
          font-weight: 700;
          cursor: pointer;
        }

        .error {
          color: #b12e45;
          font-size: 13px;
        }

        .borrowed-section h3 {
          margin: 0 0 16px;
          font-size: 22px;
        }

        .borrowed-section h4 {
          margin: 18px 0 10px;
          font-size: 16px;
          color: #4e4a45;
        }

        .borrowed-grid {
          display: grid;
          gap: 14px;
        }

        .borrowed-card {
          border: 1px solid #ece6de;
          border-radius: 14px;
          padding: 14px 16px;
          display: grid;
          gap: 6px;
          background: #fffdfb;
        }

        .borrowed-title {
          font-weight: 700;
        }

        .borrowed-meta {
          color: #6b645b;
          font-size: 13px;
        }

        .borrowed-actions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .small-btn {
          border: 1px solid #ded7cd;
          border-radius: 10px;
          background: #ffffff;
          color: #12110e;
          font-size: 12px;
          padding: 6px 10px;
          cursor: pointer;
        }

        .small-btn.primary {
          background: #12110e;
          color: #ffffff;
          border-color: #12110e;
        }

        .logout {
          margin-top: 16px;
          border: 1px solid #ded7cd;
          background: transparent;
          color: #12110e;
        }

        @media (max-width: 800px) {
          .account-card {
            grid-template-columns: 1fr;
          }

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
            aria-label={`Carrito: ${borrowedBooks.length} prestados y ${ownedEbooks.length} comprados`}
            title={`Prestados: ${borrowedBooks.length} | Comprados: ${ownedEbooks.length}`}
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
            {borrowedBooks.length}
          </span>
          <span className="cart-badge purchased" aria-hidden="true">
            {ownedEbooks.length}
          </span>
          </div>
        </div>
      </header>

      <main className="account-main">
        <div className="account-card">
          <div className="account-panel">
            <h2>Welcome back</h2>
            <p>
              Access your library account to view your borrowed books and due
              dates.
            </p>
            {!isLoggedIn && (
              <form className="account-form" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit">Log in</button>
              </form>
            )}
          </div>

          <div className="borrowed-section">
            {isLoggedIn ? (
              <>
                <h3>{currentUser ? `${currentUser}'s library` : 'Your library'}</h3>
                <h4>Borrowed books</h4>
                {borrowedBooks.length === 0 ? (
                  <p className="borrowed-meta">{EMPTY_LIST_MESSAGE}</p>
                ) : (
                  <div className="borrowed-grid">
                    {borrowedBooks.map((book) => (
                      <article className="borrowed-card" key={book.id}>
                        <div className="borrowed-title">{book.title}</div>
                        <div className="borrowed-meta">{book.author}</div>
                        <div className="borrowed-meta">Due: {book.due}</div>
                        <div className="borrowed-actions">
                          <button
                            type="button"
                            className="small-btn primary"
                            onClick={() => handleRenewBorrowed(book.id)}
                          >
                            Renew +7 days
                          </button>
                          <button
                            type="button"
                            className="small-btn"
                            onClick={() => handleReturnBorrowed(book.id)}
                          >
                            Return
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                <h4>Ebooks catalog to buy</h4>
                {visibleCatalogEbooks.length === 0 ? (
                  <p className="borrowed-meta">{EMPTY_LIST_MESSAGE}</p>
                ) : (
                  <div className="borrowed-grid">
                    {visibleCatalogEbooks.map((ebook) => {
                      return (
                        <article className="borrowed-card" key={ebook.id}>
                          <div className="borrowed-title">{ebook.title}</div>
                          <div className="borrowed-meta">{ebook.author}</div>
                          <div className="borrowed-meta">Format: {ebook.format}</div>
                          <div className="borrowed-actions">
                            <button
                              type="button"
                              className="small-btn primary"
                              onClick={() => handleBuyEbook(ebook)}
                            >
                              Buy ebook
                            </button>
                            <button
                              type="button"
                              className="small-btn"
                              onClick={() => handleRemoveCatalogEbook(ebook.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}

                <h4>Purchased ebooks</h4>
                {ownedEbooks.length === 0 ? (
                  <p className="borrowed-meta">{EMPTY_LIST_MESSAGE}</p>
                ) : (
                  <div className="borrowed-grid">
                    {ownedEbooks.map((ebook) => (
                      <article className="borrowed-card" key={`owned-${ebook.id}`}>
                        <div className="borrowed-title">{ebook.title}</div>
                        <div className="borrowed-meta">{ebook.author}</div>
                        <div className="borrowed-meta">Format: {ebook.format}</div>
                        <div className="borrowed-actions">
                          <button
                            type="button"
                            className="small-btn"
                            onClick={() => handleRemoveEbook(ebook.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
                <button type="button" className="account-form button logout" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <h3>Your borrowed books</h3>
                <p className="borrowed-meta">
                  Log in to see the books currently on your account.
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Usser;





