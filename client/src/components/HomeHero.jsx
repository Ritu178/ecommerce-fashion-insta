import React, { useEffect, useState } from "react";
import "./Home.css";

const images = [
  "https://images.pexels.com/photos/17691640/pexels-photo-17691640.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/18468127/pexels-photo-18468127.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/18990151/pexels-photo-18990151.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/14622650/pexels-photo-14622650.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/1644889/pexels-photo-1644889.jpeg?auto=compress&cs=tinysrgb&w=1600",
];

const HomeHero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      
      {/* IMAGE SLIDER */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="banner"
          className={`bg-image ${index === current ? "active" : ""}`}
        />
      ))}

      {/* OVERLAY */}
      <div className="overlay"></div>

      {/* CONTENT */}
      <div className="home-content">
        <span className="hero-eyebrow">New Season / Curated Looks</span>
        <h1 className="main-text">
          WEAR WHAT <br /> TURNS HEADS.
        </h1>

        <p className="sub-text">
          Discover elevated everyday fashion with statement silhouettes,
          cleaner layers, and trend-led pieces for every mood.
        </p>

        <button className="shop-btn">Explore The Edit</button>
      </div>

    </div>
  );
};

export default HomeHero;
