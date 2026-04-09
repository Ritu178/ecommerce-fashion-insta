import React, { useEffect, useState, useRef } from "react";
import "./ChildrenSection.css";
import { useNavigate } from "react-router-dom";

// 👉 videos import karo
import v1 from "../assets/k1.mp4";
import v2 from "../assets/k2.mp4";
import v3 from "../assets/k3.mp4";
import v4 from "../assets/k4.mp4";
import v5 from "../assets/k5.mp4";

const videos = [v1, v2, v3, v4, v5];

const ChildrenSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef();
  const [animate, setAnimate] = useState(false);

  // scroll animation (same as women)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimate(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`children-container ${animate ? "show" : ""}`}
    >
      <h1 className="section-title">Children Section</h1>

      <p className="small-text">
        Fun & Learning for Kids
      </p>

      <h1 className="main-heading">
        Best Education & Toys for Kids
      </h1>

      {/* 🔥 VIDEO CARDS */}
      <div className="children-videos">
        {videos.map((vid, index) => (
          <video
            key={index}
            src={vid}
            autoPlay
            loop
            muted
          />
        ))}
      </div>

      <button
        className="fashion-btn"
        onClick={() => navigate("/Kids")}
      >
        Explore Products →
      </button>
    </div>
  );
};

export default ChildrenSection;