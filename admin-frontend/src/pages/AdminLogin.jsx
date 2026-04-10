import { useState, useEffect } from "react";
import "./Login.css";
import { buildApiUrl } from "../config/api";
import adminApi from "../config/axios";
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
    const { data } = await adminApi.post(buildApiUrl("/admin/login"), {
      email,
      password,
    });

    if (data.success) {
      localStorage.setItem("adminToken", data.token);
      window.location.href = "/admin";
    } else {
      alert("Invalid Login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-ambient login-ambient-one"></div>
      <div className="login-ambient login-ambient-two"></div>
      <div className="login-box">
        <div className="left">
          <div className="left-overlay"></div>
          <img src={loginImg} alt="login" />
          <div className="left-copy">
            <span className="admin-badge">Admin Console</span>
            <h1>Manage products, orders, and store activity from one place.</h1>
            <p>
              Sign in to access the FASHIONISTA admin workspace and monitor the
              storefront with a cleaner operational view.
            </p>
          </div>
        </div>

        <div className="right">
          <span className="panel-tag">Secure Access</span>
          <h2>Welcome back, Admin</h2>
          <p className="subtitle">
            Use your admin credentials to continue to the dashboard.
          </p>

          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-btn" onClick={handleLogin}>
            Enter Dashboard
          </button>

          <div className="login-note">
            Protected area. Only authorized admins should continue.
          </div>
        </div>
      </div>
    </div>
  );
}
