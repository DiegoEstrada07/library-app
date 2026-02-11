import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div>
        <div className="logo">
          BOOKCLUB<span>.</span>
        </div>
        <p>
          Discover public domain classics, curated collections, and upcoming
          recommendations from our community of readers.
        </p>
      </div>
      <div>
        <h4>Company</h4>
        <Link to="/aboutUs">About</Link>
      </div>
      <div>
        <h4>Explore</h4>
        <Link to="/catalog">Catalog</Link>
      </div>
      <div>
        <h4>Support</h4>
        <Link to="/login">Log in</Link>
      </div>
      <div className="site-footer-bottom">
        <div>(c) 2026 Bookclub. All rights reserved.</div>
        <div className="site-footer-socials" aria-label="Social links">
          <span>O</span>
          <span>*</span>
          <span>+</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
