import { useState, useEffect } from "react";
import "./Login.css";
import loginImg from "../assest/login.png"; // ⚠️ assest → assets

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      window.location.href = "/admin";
    }
  }, []);

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("adminToken", data.token);
      window.location.href = "/admin";
    } else {
      alert("Invalid Login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        {/* LEFT IMAGE */}
        <div className="left">
          <img src={loginImg} alt="login" />
        </div>

        {/* RIGHT SIDE */}
        <div className="right">
          <h2>Admin Login</h2>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
        </div>

      </div>
    </div>
  );
}