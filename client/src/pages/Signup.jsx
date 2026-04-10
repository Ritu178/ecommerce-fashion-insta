// import React, { useState } from "react";
// import "./Signup.css";
// import axios from "axios";
// import videoBg from "../assets/video.mp4.mp4";
// import Swal from "sweetalert2";
// const Signup = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // const handleSignup = async () => {
//   //   try {
//   //     const res = await axios.post("http://localhost:5000/api/signup", {
//   //       name,
//   //       email,
//   //       password,
//   //     });

//   //     alert(res.data);
//   //   } catch (error) {
//   //     console.log(error);
//   //     alert("Error in signup");
//   //   }
//   // };
// const handleSignup = async () => {
//   // basic validation
//   if (!name || !email || !password) {
//     Swal.fire({
//       title: "Missing Fields ",
//       text: "Please fill all fields",
//       icon: "warning",
//     });
//     return;
//   }

//   try {
//     const res = await axios.post("http://localhost:5000/api/signup", {
//       name,
//       email,
//       password,
//     });

//     //  CHECK RESPONSE (IMPORTANT)
//     if (res.data.success) {
//       Swal.fire({
//         title: "Signup Successful",
//         text: res.data.message || "Account created",
//         icon: "success",
//       });
//     } else {
//       Swal.fire({
//         title: "Signup Failed ",
//         text: res.data.message || "Signup not allowed",
//         icon: "error",
//       });
//     }

//   } catch (error) {
//     console.log(error);

//     Swal.fire({
//       title: "Error ",
//       text: error.response?.data?.message || "Server error",
//       icon: "error",
//     });
//   }
// };
//   return (
//     <div className="signup-container">
      
//       {/* BACKGROUND VIDEO */}
//       <video autoPlay loop muted className="video-bg">
//         <source src={videoBg} type="video/mp4" />
//       </video>

//       {/* OVERLAY */}
//       <div className="overlay"></div>

//       {/* FORM */}
//       <div className="signup-form">
//         <h2>Signup</h2>

//         <input
//           type="text"
//           placeholder="Full Name"
//           onChange={(e) => setName(e.target.value)}
//         />

//         <input
//           type="email"
//           placeholder="Email"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button onClick={handleSignup}>Signup</button>
//       </div>

//     </div>
//   );
// };

// export default Signup;

import React, { useState } from "react";
import "./Signup.css";
import videoBg from "../assets/video.mp4.mp4";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import apiClient from "../config/axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    //validation
    if (!name || !email || !password) {
      Swal.fire({
        title: "Missing Fields",
        text: "Please fill all fields",
        icon: "warning",
      });
      return;
    }

    try {
      const res = await apiClient.post("/api/signup", {
        name,
        email,
        password,
      });

      // CHECK RESPONSE
      if (res.data.success) {
        Swal.fire({
          title: "Signup Successful",
          text: "Redirecting to login...",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/login"); //  redirect
        });
      } else {
        Swal.fire({
          title: "Signup Failed",
          text: res.data.message || "Signup not allowed",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Server error",
        icon: "error",
      });
    }
  };

  return (
    <div className="signup-container">
      
      {/* BACKGROUND VIDEO */}
      <video autoPlay loop muted className="video-bg">
        <source src={videoBg} type="video/mp4" />
      </video>

      {/* OVERLAY */}
      <div className="overlay"></div>

      {/* FORM */}
      <div className="signup-form">
        <span className="signup-eyebrow">Create Account</span>
        <h2>Join FASHIONISTA</h2>
        <p className="signup-subtitle">
          Create your account to save favorites, manage your cart, and check out faster.
        </p>

        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSignup}>Create Account</button>

        {/*  LOGIN LINK */}
        <p className="extra-text">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#ffc107", cursor: "pointer", textDecoration: "underline" }}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Signup;
