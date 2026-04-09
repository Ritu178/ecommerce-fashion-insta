// import React, { useEffect, useState, useRef } from "react";
// import "./FashionSection.css";
// import { useNavigate } from "react-router-dom";

// import img1 from "../assets/img.6.jpg";
// import img2 from "../assets/img.7.jpg";
// import img3 from "../assets/img.8.jpg";
// import img4 from "../assets/img.9.jpg";
// import img5 from "../assets/img.10.jpeg";

// const FashionSection = () => {
//   const navigate = useNavigate();

//   const sectionRef = useRef();
//   const [animate, setAnimate] = useState(false);

//   // scroll animation (on view)
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           setAnimate(true);
//         }
//       },
//       { threshold: 0.3 }
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => {
//       if (sectionRef.current) {
//         observer.unobserve(sectionRef.current);
//       }
//     };
//   }, []);

//   // parallax effect
//   useEffect(() => {
//     const handleScroll = () => {
//       if (!sectionRef.current) return;

//       const scrollY = window.scrollY;
//       sectionRef.current.style.setProperty("--scroll", `${scrollY}px`);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <div
//       ref={sectionRef}
//       className={`fashion-container ${animate ? "show" : ""}`}
//     >
//       <h1 className="section-title">Women Section</h1>

//       <p className="small-text">
//         Why Global Republic Is the
//       </p>

//       <h1 className="main-heading">
//         Go-To Fashion Brand for Women
//       </h1>

//       <div className="fashion-images">
//         <img src={img1} alt="fashion1" />
//         <img src={img2} alt="fashion2" />
//         <img src={img3} alt="fashion3" />
//         <img src={img4} alt="fashion4" />
//         <img src={img5} alt="fashion5" />
//       </div>

//       <button
//         className="fashion-btn"
//         onClick={() => navigate("/products")}
//       >
//         Explore Products →
//       </button>
//     </div>
//   );
// };

// export default FashionSection;

import React, { useEffect, useState, useRef } from "react";
import "./FashionSection.css";
import { useNavigate } from "react-router-dom";

import img1 from "../assets/img.6.jpg";
import img2 from "../assets/img.7.jpg";
import img3 from "../assets/img.8.jpg";
import img4 from "../assets/img.9.jpg";
import img5 from "../assets/img.10.jpeg";

const FashionSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimate(true);
        }
      },
      { threshold: 0.2 } // Jab 20% section dikhega tab start hoga
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`fashion-container ${animate ? "start-animation" : ""}`}
    >
      <div className="bg-blob-light"></div>

      <div className="content-wrapper">
        <h1 className="section-title">Women Section</h1>
        <p className="small-text">Why Global Republic Is the</p>
        <h1 className="main-heading">Go-To Fashion Brand for Women</h1>

        <div className="fashion-images">
          <img src={img1} alt="fashion1" className="float-1" />
          <img src={img2} alt="fashion2" className="float-2" />
          <img src={img3} alt="fashion3" className="float-3" />
          <img src={img4} alt="fashion4" className="float-2" />
          <img src={img5} alt="fashion5" className="float-1" />
        </div>

        <button className="fashion-btn" onClick={() => navigate("/products")}>
          Explore Products →
        </button>
      </div>
    </div>
  );
};

export default FashionSection;