import React from "react";
import "./StaticInfoPage.css";

const StaticInfoPage = ({ eyebrow, title, intro, sections }) => {
  return (
    <div className="static-page">
      <div className="static-page-hero">
        <span className="static-page-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>

      <div className="static-page-content">
        {sections.map((section) => (
          <section key={section.heading} className="static-page-section">
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
};

export default StaticInfoPage;
