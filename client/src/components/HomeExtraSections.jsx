import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeExtraSections.css";

const trendCards = [
  {
    title: "Editorial Drop",
    text: "Sharp silhouettes, soft neutrals, and statement textures for everyday dressing.",
    image: "/home-assets/image1.jpg",
    route: "/products",
  },
  {
    title: "Kids Spotlight",
    text: "Playful colors and easy fits built for movement, comfort, and fun.",
    image: "/home-assets/kids-banner.webp",
    route: "/kids",
  },
  {
    title: "New Season Picks",
    text: "Fresh arrivals curated to make your wardrobe feel lighter and smarter.",
    image: "/home-assets/newsletter-banner.webp",
    route: "/products",
  },
];

const HomeExtraSections = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="editorial-section">
        <div className="editorial-copy">
          <span className="editorial-eyebrow">Curated Daily</span>
          <h2>Style-led picks for every part of your week.</h2>
          <p>
            Discover refined everyday fashion with standout edits for women,
            men, and kids. Built to make browsing feel sharper, lighter, and
            more inspiring from the first scroll.
          </p>

          <div className="editorial-stats">
            <div>
              <strong>120+</strong>
              <span>Fresh looks</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Core collections</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Style inspiration</span>
            </div>
          </div>

          <button className="editorial-btn" onClick={() => navigate("/products")}>
            Browse Collection
          </button>
        </div>

        <div className="editorial-visual">
          <div className="editorial-card editorial-card-main">
            <img src="/home-assets/image1.jpg" alt="Fashion editorial" />
          </div>
          <div className="editorial-card editorial-card-note">
            <span>Trend Focus</span>
            <strong>Minimal tones, elevated basics, cleaner styling.</strong>
          </div>
        </div>
      </section>

      <section className="scroll-gallery-section">
        <div className="scroll-gallery-heading">
          <div>
            <span className="editorial-eyebrow">Trending Now</span>
            <h2>Fresh fashion edits worth exploring.</h2>
          </div>
          <button className="gallery-link" onClick={() => navigate("/products")}>
            View all
          </button>
        </div>

        <div className="trend-scrollbar">
          {trendCards.map((card) => (
            <article
              key={card.title}
              className="trend-card"
              onClick={() => navigate(card.route)}
            >
              <img src={card.image} alt={card.title} />
              <div className="trend-card-overlay"></div>
              <div className="trend-card-content">
                <span>Featured</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="campaign-banner">
        <div className="campaign-banner-copy">
          <span className="editorial-eyebrow">Seasonal Spotlight</span>
          <h2>Statement pieces with a softer everyday feel.</h2>
          <p>
            Explore mood-led fashion picks designed to refresh your wardrobe
            with clean layers, lighter tones, and easy standout styling.
          </p>
          <div className="campaign-actions">
            <button onClick={() => navigate("/products")}>Shop Women</button>
            <button className="secondary" onClick={() => navigate("/kids")}>
              Shop Kids
            </button>
          </div>
        </div>

        <div className="campaign-banner-image">
          <img
            src="/home-assets/newsletter-banner.webp"
            alt="Fashionista campaign banner"
          />
        </div>
      </section>
    </>
  );
};

export default HomeExtraSections;
