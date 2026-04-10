import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import videoBg from "../assets/video.2.mp4";
import Swal from "sweetalert2";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // const handleLogin = async () => {
  //   try {
  //     const res = await axios.post("http://localhost:5000/api/login", {
  //       email,
  //       password,
  //     });

  //     // SAVE DATA
  //     localStorage.setItem("token", res.data.token);
  //     localStorage.setItem("user", JSON.stringify(res.data.user));

  //     alert("Login Successful ");

  //     //  REDIRECT
  //     navigate("/");
  //   } catch (error) {
  //     console.log(error);
  //     alert("Login failed ");
  //   }
  // };


//   const handleLogin = async () => {
//   try {
//     const res = await axios.post("http://localhost:5000/api/login", {
//       email,
//       password,
//     });

//     // 🔥 DEBUG (YAHAN ADD KARO)
//     console.log("FULL RESPONSE:", res.data);
//     console.log("USER:", res.data.user);

//     localStorage.setItem("token", res.data.token);
//     localStorage.setItem("user", JSON.stringify(res.data.user));

//     alert("Login Successful");
//     navigate("/");
//   } catch (error) {
//     console.log(error);
//     alert("Login failed");
//   }
// };
const handleLogin = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/login", {
      email,
      password,
    });
  console.log("LOGIN RESPONSE:", res.data);
    console.log("FULL RESPONSE:", res.data);
    console.log("USER:", res.data.user);
 localStorage.setItem("token", res.data.token);
 localStorage.setItem("user", JSON.stringify(res.data.user));
 localStorage.setItem("userId", String(res.data.user._id));
// localStorage.setItem("userId", res.data.user._id);
// localStorage.setItem("userId", res.data.user._id);
  

  //     alert("Login Successful ");


    //  SUCCESS ALERT
    Swal.fire({
      title: "Login Successful ",
      text: "Welcome back!",
      icon: "success",
      confirmButtonText: "OK"
    });

    navigate("/");
  } catch (error) {
    console.log(error);

    //  ERROR ALERT
    Swal.fire({
      title: "Login Failed ",
      text: "Invalid email or password",
      icon: "error",
      confirmButtonText: "Try Again"
    });
  }
};
  return (
    <div className="login-container">
      {/* BACKGROUND VIDEO */}
      <video autoPlay loop muted playsInline className="video-bg">
        <source src={videoBg} type="video/mp4" />
      </video>

      {/* OVERLAY */}
      <div className="overlay"></div>

      {/* LOGIN FORM */}
      <div className="login-form">
        <span className="login-eyebrow">Member Access</span>
        <h2>Welcome Back</h2>
        <p className="login-subtitle">
          Sign in to continue shopping, manage your cart, and place orders faster.
        </p>

        <input
          type="email"
          placeholder="Email address"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Continue
        </button>

        <p className="extra-text">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>
            Signup
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
