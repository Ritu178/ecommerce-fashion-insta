import React, { useEffect, useState, useRef } from "react";
import "./MensSection.css";
import { useNavigate } from "react-router-dom";

import r1 from "../assets/m1.jpg";
import r2 from "../assets/m2.jpg";
import r3 from "../assets/m3.jpg";
import r4 from "../assets/m4.jpg";
import r5 from "../assets/m5.jpg";

import l1 from "../assets/m1.jpg";
import l2 from "../assets/m2.jpg";
import l3 from "../assets/m3.jpg";

const rightImages = [r1, r2, r3, r4, r5];

const MensSection = () => {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef();
  const navigate = useNavigate();

  // Slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % rightImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current.classList.add("show");
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mens-container" ref={sectionRef}>
      
      {/* LEFT */}
      <div className="mens-left">
        <h1>Unlimited fashion at the next level</h1>
        <p>Lorem Ipsum is simply dummy text of the printing industry.</p>

        {/* NAVIGATION BUTTON */}
        <button
          className="explore-btn"
          onClick={() => navigate("/men")}
        >
          Explore
        </button>

        <div className="left-images">
          <img src={l1} className="small-img" alt="" />
          <img src={l2} className="big-img" alt="" />
          <img src={l3} className="small-img" alt="" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="mens-right">
        <img
          src={rightImages[current]}
          className="main-img"
          alt=""
        />

        <div className="dots">
          {rightImages.map((_, i) => (
            <span
              key={i}
              className={current === i ? "dot active" : "dot"}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MensSection;