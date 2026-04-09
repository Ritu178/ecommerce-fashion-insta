import React, { useEffect, useState } from "react";
import "./Home.css";

import img1 from "../assets/img.1.jpg.png";
import img2 from "../assets/img.2.png";
import img3 from "../assets/img.3.png";
import img4 from "../assets/img.4.png";
import img5 from "../assets/img.5.png";

const images = [img1, img2, img3, img4, img5];

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
        <h1 className="main-text">
          LET'S EXPLORE <br /> UNIQUE CLOTHES.
        </h1>

        <p className="sub-text">
          Live for influential and innovative fashion!
        </p>

        <button className="shop-btn">Shop Now</button>
      </div>

    </div>
  );
};

export default HomeHero;