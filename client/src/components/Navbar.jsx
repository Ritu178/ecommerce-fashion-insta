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



import React, { useState, useContext } from "react";
import "./Navbar.css";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { cart } = useContext(CartContext);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
const handleSearch = () => {
  console.log("SEARCH VALUE:", search); 

  if (!search.trim()) return;

navigate(`/search?query=${encodeURIComponent(search)}`);
};
  return (
    <div className="navbar">

      {/* LEFT - LOGO */}
      <h2 className="logo" onClick={() => navigate("/")}>
        SkyGarden
      </h2>

      {/* CENTER - MENU */}
      <ul className="nav-links">
        <li onClick={() => navigate("/")}>Home</li>

<li className={`dropdown ${showDropdown ? "active" : ""}`}>
  
  <span onClick={(e) => {
    e.stopPropagation(); 
    setShowDropdown(!showDropdown);
  }}>
    Category
  </span>

  {showDropdown && (
    <ul className="dropdown-menu">
      <li onClick={(e) => {
        e.stopPropagation();
        navigate("/men");
        setShowDropdown(false);
      }}>Men</li>

      <li onClick={(e) => {
        e.stopPropagation();
        navigate("/products");
        setShowDropdown(false);
      }}>Women</li>

      <li onClick={(e) => {
        e.stopPropagation();
        navigate("/kids");
        setShowDropdown(false);
      }}>Children</li>
    </ul>
  )}
</li>

         <li onClick={() => navigate("/about")}>About</li>
        <li onClick={() => navigate("/contact")}>Contact</li>
      </ul>


      <div className="nav-center">
        <input
          type="text"
          placeholder="Search products..."
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

      {/* RIGHT SIDE */}
      <div className="nav-right">

        <div className="nav-item" onClick={() => navigate("/login")}>
          <FaUser />
          <span>Login</span>
        </div>

        <div className="nav-item" onClick={() => navigate("/signup")}>
          <FaUser />
          <span>Signup</span>
        </div>

        <div className="nav-item cart" onClick={() => navigate("/cart")}>
          <FaShoppingCart />
          <span>Cart ({totalItems})</span>
        </div>

      </div>

    </div>
  );
};

export default Navbar;