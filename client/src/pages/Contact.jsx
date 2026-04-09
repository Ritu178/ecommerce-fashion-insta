import React, { useState, useEffect } from "react";
import "./Contact.css";
import axios from "axios";
import Swal from "sweetalert2";
import Footer from "../components/Footer";
import contactImg from "../assets/contact-img.png";

import AOS from "aos";
import "aos/dist/aos.css";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/contact", form);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Message Sent",
          text: "We will contact you soon!",
        });

        setForm({ name: "", email: "", phone: "", message: "" });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
      });
    }
  };

  return (
    <div className="contact-page">

      {/* BANNER */}
      <div className="contact-banner">
        <h1>Contact Us</h1>
        <p>Get in Touch With Us</p>
      </div>

      {/* MAIN */}
      <div className="contact-main">

        {/* IMAGE */}
        <div className="contact-image" data-aos="fade-right">
          <img src={contactImg} alt="contact" />
        </div>

        {/* FORM */}
        <div className="contact-right" data-aos="fade-left">
          <h3>Send Us a Message</h3>

          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Your Name" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Your Email" onChange={handleChange} required />
            <input name="phone" placeholder="Phone Number" onChange={handleChange} />
            <textarea name="message" placeholder="Your Message" onChange={handleChange} required />
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>

      {/* MAP */}
      <div className="location" data-aos="zoom-in">
        <h3>Our Location</h3>

        <iframe
          src="https://www.google.com/maps?q=SCO%2090,%20District%20Shopping%20Centre,%20Gumtala%20Sub%20Urban,%20B%20Block,%20Ranjit%20Avenue,%20Amritsar,%20Punjab%20143001&output=embed"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: "10px" }}
          loading="lazy"
        ></iframe>
      </div>

      {/* FAQ */}
      <div className="faq" data-aos="fade-up">
        <h3>Frequently Asked Questions</h3>

        {[
          {
            q: "What are your store hours?",
            a: "Monday to Saturday, 10:00 AM - 7:00 PM",
          },
          {
            q: "Do you offer international shipping?",
            a: "Yes, we ship worldwide.",
          },
          {
            q: "What is your return policy?",
            a: "Return within 7 days.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
          >
            <div
              className="faq-question"
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
            >
              {item.q}
            </div>

            {activeIndex === index && (
              <div className="faq-answer">{item.a}</div>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Contact;