import React from "react";
import "./Footer.css";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LEFT SECTION */}
        <div className="footer-left">
          <h2 className="logo">FASHIONISTA</h2>
          <p>
            Discover the latest trends in fashion. Shop stylish outfits and
            upgrade your wardrobe with us.
          </p>

          <div className="social-icons">
            <FaInstagram />
            <FaFacebook />
            <FaTwitter />
            <FaLinkedin />
          </div>

          <button className="back-top">↑ Back to Top</button>
        </div>

        {/* MIDDLE SECTION */}
        <div className="footer-links">
          <h4>Shop</h4>
          <ul>
            <li>Men</li>
            <li>Women</li>
            <li>Kids</li>
            <li>New Arrivals</li>
            <li>Sale</li>
          </ul>
        </div>

        {/* RIGHT SECTION */}
        <div className="footer-links">
          <h4>Help</h4>
          <ul>
            <li>Contact Us</li>
            <li>Order Tracking</li>
            <li>Returns</li>
            <li>FAQs</li>
          </ul>
        </div>

        {/* EXTRA SECTION */}
        <div className="footer-links">
          <h4>Legal</h4>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© 2026 Fashionista. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;