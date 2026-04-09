import React from "react";
import "./AboutUs.css";
import aboutImg from "../assets/about.jpg";
export default function About() {
  return (
    <div className="about-container">
      {/* HERO SECTION */}
      <div className="about-hero">
        <h1>About Our Brand</h1>
        <p>Where fashion meets confidence ✨</p>
      </div>

      {/* STORY SECTION */}
      <div className="about-section">
        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            Our journey started with a simple idea — to make trendy and
            affordable fashion available for everyone. We believe that fashion
            is not just clothing, it's a way to express yourself.
          </p>
        </div>
         <div className="about-image" data-aos="fade-right">
                 <img src={aboutImg} alt="about" />
               </div>
      </div>

      {/* MISSION & VISION */}
      <div className="about-mission">
        <div>
          <h3>Our Mission</h3>
          <p>To deliver high-quality, trendy fashion at affordable prices.</p>
        </div>
        <div>
          <h3>Our Vision</h3>
          <p>To become one of the top fashion brands loved by everyone.</p>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="about-why">
        <h2>Why Choose Us</h2>
        <div className="why-grid">
          <div className="card">High Quality Products</div>
          <div className="card">Affordable Prices</div>
          <div className="card">Fast Delivery</div>
          <div className="card">Easy Returns</div>
        </div>
      </div>

      {/* CTA */}
      <div className="about-cta">
        <h2>Explore Our Collection</h2>
        <button>Shop Now</button>
      </div>
    </div>
  );
}
