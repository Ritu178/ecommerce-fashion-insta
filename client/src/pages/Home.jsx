// pages/Home.jsx

import React from "react";

import HomeHero from "../components/HomeHero";
import FashionSection from "../components/FashionSection";
import MensSection from "../components/MensSection"; 
import ChildrenSection from "../components/ChildrenSection";
import HomeExtraSections from "../components/HomeExtraSections";

import Chatbot from "../components/Chatbot";
function Home() {
  return (
    <>
      <HomeHero />
      <HomeExtraSections />
      <FashionSection />
      <MensSection /> 
      <ChildrenSection />
      <Chatbot />
    </>
  );
}

export default Home;
