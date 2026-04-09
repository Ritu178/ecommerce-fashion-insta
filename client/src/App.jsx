// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Contact from "./pages/Contact"; // path check karo
// import Search from "./pages/Search";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import ProductList from "./pages/ProductList";
// import ProductDetail from "./pages/ProductDetail";
// import CartPage from "./pages/CartPage";
// import MenPage from "./pages/MenPage";
// import KidsProducts from "./pages/KidsProducts";
// import PlaceOrder from "./pages/PlaceOrder";
// import  CartProvider  from "./context/CartContext";


// function App() {
//   return (
//     <CartProvider>
//       <Router>
//         <Navbar />

//         <Routes>
//           {/* Home Page */}
//           <Route path="/" element={<Home />} />
// <Route path="/contact" element={<Contact />} />
//           {/* Auth Pages */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />

//           {/* Products Page (9 cards) */}
//           <Route path="/products" element={<ProductList />} />

//           {/* Product Detail Page */}
//           <Route path="/products/:id" element={<ProductDetail />} />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/place-order" element={<PlaceOrder />} />
//           <Route path="/men" element={<MenPage />} />
//           <Route path="/kids" element={<KidsProducts />} />
//         </Routes>
//       </Router>
//     </CartProvider>
//   );
// }

// export default App;



import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Search from "./pages/SearchResults";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import MenPage from "./pages/MenPage";
import KidsProducts from "./pages/KidsProducts";
import PlaceOrder from "./pages/PlaceOrder";

import CartProvider from "./context/CartContext";

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts([
      { _id: 1, name: "Men Shirt", price: 500 },
      { _id: 2, name: "Women Dress", price: 800 },
      { _id: 3, name: "Kids T-shirt", price: 300 },
    ]);
  }, []);

  return (
    <CartProvider>
      <Router>
        <Navbar />

        {/* ✅ ONLY ONE ROUTES */}
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          <Route path="/men" element={<MenPage />} />
          <Route path="/kids" element={<KidsProducts />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/place-order" element={<PlaceOrder />} />

          {/* 🔥 IMPORTANT */}
          <Route path="/searchResults" element={<Search products={products} />} />
        </Routes>

      </Router>
    </CartProvider>
  );
};

export default App;