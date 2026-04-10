// import React, { useState, useContext } from "react";
// import "./Navbar.css";
// import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { CartContext } from "../context/CartContext";

// const Navbar = () => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const navigate = useNavigate();

//   const { cart } = useContext(CartContext);
//   const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

//   return (
//     <div className="navbar">

//       {/* LEFT - LOGO */}
//       <h2 className="logo" onClick={() => navigate("/")}>
//         skygarden
//       </h2>

//       {/* CENTER - MENU */}
//       <ul className="nav-links">
//         <li onClick={() => navigate("/")}>Home</li>

//         <li
//           className={`dropdown ${showDropdown ? "active" : ""}`}
//           onClick={() => setShowDropdown(!showDropdown)}
//         >
//           Category
//           <ul className="dropdown-menu">
//             <li>Men</li>
//             <li>Women</li>
//             <li>Children</li>
//           </ul>
//         </li>

//         <li>About</li>
//         <li>Contact</li>
//       </ul>

//       {/* SEARCH */}
//       <div className="nav-center">
//         <input placeholder="Search..." />
//         <button className="search-btn">
//           <FaSearch />
//         </button>
//       </div>

//       {/* RIGHT */}
//       <div className="nav-right">

//         <div
//           className="nav-item"
//           onClick={() => navigate("/login")}
//         >
//           <FaUser />
//           <span>Login</span>
//         </div>

//         <div
//           className="nav-item"
//           onClick={() => navigate("/signup")}
//         >
//           <FaUser />
//           <span>Signup</span>
//         </div>

//         <div
//           className="nav-item cart"
//           onClick={() => navigate("/cart")}
//         >
//           <FaShoppingCart />
//           <span>Cart ({totalItems})</span>
//         </div>

//       </div>

//     </div>
//   );
// };

// export default Navbar;



import React, { useEffect, useRef, useState, useContext } from "react";
import "./Navbar.css";
import { FaChevronDown, FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const { cart } = useContext(CartContext);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSearch = () => {
    console.log("SEARCH VALUE:", search);

    if (!search.trim()) return;

    navigate(`/search?query=${encodeURIComponent(search)}`);
  };

  return (
    <header className="navbar-shell">
      <div className="navbar-accent"></div>
      <div className="navbar">
        <button className="logo-block" onClick={() => navigate("/")}>
          <span className="logo-tag">premium edit</span>
          <span className="logo">FASHIONISTA</span>
        </button>

        <nav className="nav-links">
          <button className="nav-link" onClick={() => navigate("/")}>
            Home
          </button>

          <div
            ref={dropdownRef}
            className={`dropdown ${showDropdown ? "active" : ""}`}
          >
            <button
              className="nav-link nav-link-dropdown"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              Category <FaChevronDown className="dropdown-icon" />
            </button>

            {showDropdown && (
              <ul className="dropdown-menu">
                <li
                  onClick={() => {
                    navigate("/men");
                    setShowDropdown(false);
                  }}
                >
                  Men
                </li>
                <li
                  onClick={() => {
                    navigate("/products");
                    setShowDropdown(false);
                  }}
                >
                  Women
                </li>
                <li
                  onClick={() => {
                    navigate("/kids");
                    setShowDropdown(false);
                  }}
                >
                  Children
                </li>
              </ul>
            )}
          </div>

          <button className="nav-link" onClick={() => navigate("/about")}>
            About
          </button>
          <button className="nav-link" onClick={() => navigate("/contact")}>
            Contact
          </button>
        </nav>

        <div className="nav-center">
          <input
            type="text"
            placeholder="Search jackets, dresses, kids wear..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          <button className="search-btn" onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>

        <div className="nav-right">
          {!isLoggedIn ? (
            <>
              <button className="nav-item" onClick={() => navigate("/login")}>
                <FaUser />
                <span>Login</span>
              </button>

              <button className="nav-item nav-item-outline" onClick={() => navigate("/signup")}>
                <FaUser />
                <span>Signup</span>
              </button>
            </>
          ) : (
            <button className="nav-item cart" onClick={() => navigate("/cart")}>
              <FaShoppingCart />
              <span>Cart</span>
              <span className="cart-count">{totalItems}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
