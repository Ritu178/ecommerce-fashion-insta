import React from "react";
import { useNavigate } from "react-router-dom";
import "./PreFooterSection.css";

const PreFooterSection = () => {
  const navigate = useNavigate();

  return (
    <section className="prefooter-section">
      <div className="prefooter-panel">
        <div className="prefooter-copy">
          <span className="prefooter-eyebrow">Before You Go</span>
          <h2>Refresh your wardrobe with pieces that actually stand out.</h2>
          <p>
            Explore curated drops for women, men, and kids with cleaner styling,
            better layering, and more wearable statement looks.
          </p>
        </div>

        <div className="prefooter-actions">
          <button onClick={() => navigate("/products")}>Shop Women</button>
          <button className="secondary" onClick={() => navigate("/men")}>
            Shop Men
          </button>
          <button className="secondary" onClick={() => navigate("/kids")}>
            Shop Kids
          </button>
        </div>
      </div>
    </section>
  );
};

export default PreFooterSection;
