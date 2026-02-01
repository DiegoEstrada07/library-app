import React, { useState } from 'react';

const borrowedSeed = [
  {
    id: 'bk-1',
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    due: '2026-02-12',
  },
  {
    id: 'bk-2',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    due: '2026-02-20',
  },
  {
    id: 'bk-3',
    title: 'The Time Machine',
    author: 'H. G. Wells',
    due: '2026-02-28',
  },
];

const demoUsers = [
  { name: 'Emma Parker', email: 'emma@demo.com', password: 'Emma123!' },
  { name: 'James Carter', email: 'james@demo.com', password: 'Carter#45' },
];

const Usser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

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
      return;
    }

    setCurrentUser(match.name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setCurrentUser('');
  };

  return (
    <div className="account-page">
      <style>{`
        .account-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 40px 24px;
          background: linear-gradient(120deg, #f7f4ef 0%, #ffffff 100%);
          font-family: 'Nunito Sans', 'Segoe UI', sans-serif;
          color: #12110e;
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
        }
      `}</style>

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
              <h3>{currentUser ? `${currentUser}'s borrowed books` : 'Your borrowed books'}</h3>
              <div className="borrowed-grid">
                {borrowedSeed.map((book) => (
                  <article className="borrowed-card" key={book.id}>
                    <div className="borrowed-title">{book.title}</div>
                    <div className="borrowed-meta">{book.author}</div>
                    <div className="borrowed-meta">Due: {book.due}</div>
                  </article>
                ))}
              </div>
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
    </div>
  );
};

export default Usser;
