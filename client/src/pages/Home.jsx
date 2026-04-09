// pages/Home.jsx

import React from "react";

import HomeHero from "../components/HomeHero";
import FashionSection from "../components/FashionSection";
import MensSection from "../components/MensSection"; 
import ChildrenSection from "../components/ChildrenSection";

import Chatbot from "../components/Chatbot";
import Footer from "../components/Footer";
function Home() {
  return (
    <>
      <HomeHero />
      <FashionSection />
      <MensSection /> 
      <ChildrenSection />
    <Chatbot />
        <Footer />
    </>
  );
}

export default Home;