import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaArrowUp,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./SiteFooter.css";

const SiteFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer">
      <div className="footer-glow footer-glow-left"></div>
      <div className="footer-glow footer-glow-right"></div>

      <div className="footer-topline">
        <div>
          <span className="footer-eyebrow">Style, curated daily</span>
          <h2>Make every outfit feel editorial.</h2>
        </div>
        <Link to="/products" className="footer-cta">
          Explore Products
        </Link>
      </div>

      <div className="footer-container">
        <div className="footer-brand">
          <p className="footer-label">Fashion house</p>
          <h2 className="footer-logo">FASHIONISTA</h2>
          <p className="footer-copy">
            Modern fashion for women, men, and kids. Built for everyday wear,
            elevated with sharper silhouettes and cleaner styling.
          </p>

          <div className="footer-contact">
            <span>
              <FaEnvelope /> support@fashionista.com
            </span>
            <span>
              <FaMapMarkerAlt /> Amritsar, Punjab
            </span>
          </div>

          <div className="footer-socials">
            <a href="/" aria-label="Instagram" onClick={(e) => e.preventDefault()}>
              <FaInstagram />
            </a>
            <a href="/" aria-label="Facebook" onClick={(e) => e.preventDefault()}>
              <FaFacebookF />
            </a>
            <a href="/" aria-label="Twitter" onClick={(e) => e.preventDefault()}>
              <FaTwitter />
            </a>
            <a href="/" aria-label="LinkedIn" onClick={(e) => e.preventDefault()}>
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/men">Men</Link></li>
            <li><Link to="/products">Women</Link></li>
            <li><Link to="/kids">Kids</Link></li>
            <li><Link to="/products">New Arrivals</Link></li>
            <li><Link to="/products">Sale</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Help</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/order-tracking">Order Tracking</Link></li>
            <li><Link to="/returns">Returns</Link></li>
            <li><Link to="/faqs">FAQs</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
            <li><Link to="/shipping-policy">Shipping Policy</Link></li>
            <li><Link to="/refund-policy">Refund Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 FASHIONISTA. All rights reserved.</p>
        <button className="footer-back-top" onClick={scrollToTop}>
          <FaArrowUp />
          Back to Top
        </button>
      </div>
    </footer>
  );
};

export default SiteFooter;
