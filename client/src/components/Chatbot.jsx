import React, { useState, useRef } from "react";
import "./Chatbot.css";
import axios from "axios";
import sound from "../assets/notification.mp3.wav";
import { FaComments, FaTimes } from "react-icons/fa";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);

 const audioRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });

      setTimeout(() => {
        setTyping(false);

        let botMsg;

        // PRODUCT CARD RESPONSE
        if (res.data.reply.includes("Dress")) {
          botMsg = {
            sender: "bot",
            type: "product",
            name: "Red Dress",
            img: "https://via.placeholder.com/150",
          };
        } else {
          botMsg = { sender: "bot", text: res.data.reply };
        }

        setMessages((prev) => [...prev, botMsg]);
if (audioRef.current) {
    audioRef.current.play().catch(() => {});
  }

}, 1000);

    } catch (err) {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error" },
      ]);
    }

    setInput("");
  };

  return (
    <>
      {/* SOUND */}
  <audio ref={audioRef} src={sound} />


      {/* ICON */}
      <div className="chat-icon" onClick={() => setOpen(!open)}>
        {open ? <FaTimes /> : <FaComments />}
      </div>

      {/* CHATBOX */}
      {open && (
        <div className="chatbot">

          <div className="chat-header">Sky Garden Assistant</div>

          <div className="chatbox">
            {messages.map((msg, i) => (
              <div key={i}>
                {/* TEXT */}
                {msg.text && (
                  <div className={msg.sender}>{msg.text}</div>
                )}

                {/* PRODUCT CARD */}
                {msg.type === "product" && (
                  <div className="product-card">
                    <img src={msg.img} alt="" />
                    <p>{msg.name}</p>
                    <button>View Product</button>
                  </div>
                )}
              </div>
            ))}

            {/* TYPING */}
            {typing && (
              <div className="bot typing">
                Typing...
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>

        </div>
      )}
    </>
  );
};

export default Chatbot;