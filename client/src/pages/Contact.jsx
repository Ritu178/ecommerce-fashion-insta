import React, { useState, useEffect } from "react";
import "./Contact.css";
import Swal from "sweetalert2";
import contactImg from "../assets/contact-img.png";
import { FiArrowRight, FiClock, FiMail, FiMapPin, FiMinus, FiPhoneCall, FiPlus } from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";
import apiClient from "../config/axios";

const contactCards = [
  {
    icon: <FiPhoneCall />,
    title: "Call us",
    detail: "+91 98765 43210",
    note: "Mon to Sat, 10:00 AM to 7:00 PM",
  },
  {
    icon: <FiMail />,
    title: "Email support",
    detail: "hello@urbanwear.com",
    note: "Replies within one business day",
  },
  {
    icon: <FiMapPin />,
    title: "Visit store",
    detail: "Ranjit Avenue, Amritsar",
    note: "Walk-ins welcome for orders and returns",
  },
];

const faqs = [
  {
    q: "What are your store hours?",
    a: "Our team is available Monday to Saturday from 10:00 AM to 7:00 PM.",
  },
  {
    q: "Do you offer international shipping?",
    a: "Yes. We ship to multiple countries, and shipping options appear at checkout based on your location.",
  },
  {
    q: "What is your return policy?",
    a: "You can request a return within 7 days of delivery for eligible items in original condition.",
  },
];

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await apiClient.post("/api/contact", form);

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
      <section className="contact-banner">
        <div className="contact-banner-inner" data-aos="fade-up">
          <span className="contact-eyebrow">Contact Studio</span>
          <h1>Let&apos;s make your next order easy.</h1>
          <p>
            Reach out for sizing help, order updates, returns, or styling questions.
            We reply fast and keep things straightforward.
          </p>

          <div className="contact-banner-meta">
            <div className="contact-meta-pill">
              <FiClock />
              <span>Support hours: 10 AM to 7 PM</span>
            </div>
            <div className="contact-meta-pill">
              <FiMapPin />
              <span>Amritsar flagship store</span>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-overview">
        {contactCards.map((card) => (
          <article className="contact-card" key={card.title} data-aos="fade-up">
            <div className="contact-card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p className="contact-card-detail">{card.detail}</p>
            <p>{card.note}</p>
          </article>
        ))}
      </section>

      <section className="contact-main">
        <div className="contact-visual" data-aos="fade-right">
          <div className="contact-image-wrap">
            <img src={contactImg} alt="Customer support and fashion assistance" />
          </div>

          <div className="contact-visual-panel">
            <span className="contact-panel-label">Why customers reach out</span>
            <h2>Support for shopping, delivery, and after-sales help.</h2>
            <ul className="contact-feature-list">
              <li>Quick help with order tracking and delivery issues</li>
              <li>Guidance on sizes, availability, and product details</li>
              <li>Simple assistance for returns and exchanges</li>
            </ul>
          </div>
        </div>

        <div className="contact-form-shell" data-aos="fade-left">
          <div className="contact-form-header">
            <span className="contact-panel-label">Send a message</span>
            <h2>Tell us what you need.</h2>
            <p>
              Share your question and our team will get back to you as soon as possible.
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field-grid">
              <label className="contact-field">
                <span>Your Name</span>
                <input
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="contact-field">
                <span>Your Email</span>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label className="contact-field">
              <span>Phone Number</span>
              <input
                name="phone"
                placeholder="Optional phone number"
                value={form.phone}
                onChange={handleChange}
              />
            </label>

            <label className="contact-field">
              <span>Your Message</span>
              <textarea
                name="message"
                placeholder="Write your message here"
                value={form.message}
                onChange={handleChange}
                required
              />
            </label>

            <button className="contact-submit" type="submit">
              <span>Send Message</span>
              <FiArrowRight />
            </button>
          </form>
        </div>
      </section>

      <section className="contact-location" data-aos="zoom-in">
        <div className="contact-section-heading">
          <span className="contact-panel-label">Visit us</span>
          <h2>Our location</h2>
          <p>Stop by the store for in-person support, pickups, or product browsing.</p>
        </div>

        <div className="contact-map-frame">
          <iframe
            src="https://www.google.com/maps?q=SCO%2090,%20District%20Shopping%20Centre,%20Gumtala%20Sub%20Urban,%20B%20Block,%20Ranjit%20Avenue,%20Amritsar,%20Punjab%20143001&output=embed"
            title="Urban Wear Amritsar location"
            width="100%"
            height="340"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>
      </section>

      <section className="faq" data-aos="fade-up">
        <div className="contact-section-heading">
          <span className="contact-panel-label">FAQs</span>
          <h2>Common questions</h2>
        </div>

        <div className="faq-list">
          {faqs.map((item, index) => (
            <div
              key={item.q}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
            >
              <button
                type="button"
                className="faq-question"
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <span>{item.q}</span>
                {activeIndex === index ? <FiMinus /> : <FiPlus />}
              </button>

              {activeIndex === index && <div className="faq-answer">{item.a}</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;
