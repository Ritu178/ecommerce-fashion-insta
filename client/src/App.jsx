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
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import PreFooterSection from "./components/PreFooterSection";
import SiteFooter from "./components/SiteFooter";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import About from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Search from "./pages/SearchResults";
import StaticInfoPage from "./pages/StaticInfoPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import MenPage from "./pages/MenPage";
import KidsProducts from "./pages/KidsProducts";
import PlaceOrder from "./pages/PlaceOrder";
import AccountPage from "./pages/AccountPage";

import CartProvider from "./context/CartContext";

const AppContent = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const hideFooterSections = ["/login", "/signup", "/cart", "/place-order", "/account"].includes(
    location.pathname
  );

  useEffect(() => {
    setProducts([
      { _id: 1, name: "Men Shirt", price: 500 },
      { _id: 2, name: "Women Dress", price: 800 },
      { _id: 3, name: "Kids T-shirt", price: 300 },
    ]);
  }, []);

  return (
    <>
      <Navbar />

        {/* ✅ ONLY ONE ROUTES */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/order-tracking"
            element={
              <StaticInfoPage
                eyebrow="Help Center"
                title="Order Tracking"
                intro="Track your order status, delivery progress, and dispatch timeline from the moment your purchase is confirmed."
                sections={[
                  {
                    heading: "Tracking updates",
                    body: "Once your order is confirmed and packed, you will receive tracking-related updates through your registered contact details. Delivery progress may take a short time to refresh after dispatch.",
                  },
                  {
                    heading: "Delivery timeline",
                    body: "Most standard orders are processed quickly and delivered within the estimated window shown at checkout. Delays may happen during high-volume periods or public holidays.",
                  },
                  {
                    heading: "Need help",
                    body: "If your order status has not changed for an unusual amount of time, contact support with your order ID and registered email so the team can verify the shipment.",
                  },
                ]}
              />
            }
          />
          <Route
            path="/returns"
            element={
              <StaticInfoPage
                eyebrow="Help Center"
                title="Returns"
                intro="We keep returns straightforward for eligible products so you can shop with more confidence."
                sections={[
                  {
                    heading: "Return eligibility",
                    body: "Items must be unused, unwashed, and returned in their original condition with applicable tags or packaging intact.",
                  },
                  {
                    heading: "Return window",
                    body: "Return requests should be raised within the allowed return period after delivery. Products outside that window may not qualify.",
                  },
                  {
                    heading: "Inspection and approval",
                    body: "Once returned items are received and inspected, approved returns move forward for refund or exchange processing based on the product and payment method.",
                  },
                ]}
              />
            }
          />
          <Route
            path="/faqs"
            element={
              <StaticInfoPage
                eyebrow="Help Center"
                title="Frequently Asked Questions"
                intro="Common answers about ordering, deliveries, sizing, and support."
                sections={[
                  {
                    heading: "Do I need an account to order?",
                    body: "Creating an account gives you a smoother shopping experience, faster checkout, and easier access to cart and order-related actions.",
                  },
                  {
                    heading: "Can I cancel an order?",
                    body: "Orders may be cancelled before dispatch depending on their processing stage. Once shipped, cancellation may no longer be available.",
                  },
                  {
                    heading: "How do I choose the right size?",
                    body: "Use the product details and fit information on each listing. If you are between sizes, select based on your preferred fit or contact support before ordering.",
                  },
                ]}
              />
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <StaticInfoPage
                eyebrow="Legal"
                title="Privacy Policy"
                intro="Your privacy matters. We collect only the information needed to operate the store, support orders, and improve the shopping experience."
                sections={[
                  {
                    heading: "Information we collect",
                    body: "We may collect account, contact, delivery, and order-related information when you browse, sign up, or make a purchase.",
                  },
                  {
                    heading: "How information is used",
                    body: "Your data is used to process orders, provide support, improve services, and communicate order or account updates.",
                  },
                  {
                    heading: "Data protection",
                    body: "Reasonable safeguards are used to protect stored information, though no online platform can claim absolute security.",
                  },
                ]}
              />
            }
          />
          <Route
            path="/terms-and-conditions"
            element={
              <StaticInfoPage
                eyebrow="Legal"
                title="Terms & Conditions"
                intro="By using the website and purchasing from the store, you agree to the rules that govern access, ordering, and platform usage."
                sections={[
                  {
                    heading: "Use of the website",
                    body: "You agree to use the platform lawfully and avoid misuse, interference, or attempts to access restricted functionality.",
                  },
                  {
                    heading: "Orders and pricing",
                    body: "Product listings, prices, and availability may change. Orders may be declined or adjusted in case of technical or inventory issues.",
                  },
                  {
                    heading: "Liability",
                    body: "We aim to keep the website accurate and available, but temporary interruptions, data issues, or third-party service failures may occur.",
                  },
                ]}
              />
            }
          />
          <Route
            path="/shipping-policy"
            element={
              <StaticInfoPage
                eyebrow="Legal"
                title="Shipping Policy"
                intro="Shipping timelines and handling vary by order volume, destination, and delivery partner availability."
                sections={[
                  {
                    heading: "Processing",
                    body: "Orders are generally processed before dispatch within the normal business handling period, excluding weekends and holidays unless stated otherwise.",
                  },
                  {
                    heading: "Delivery estimates",
                    body: "Estimated arrival dates are indicative and can shift due to operational factors, address issues, weather conditions, or courier delays.",
                  },
                  {
                    heading: "Shipping charges",
                    body: "Applicable shipping costs, if any, are shown during checkout before order confirmation.",
                  },
                ]}
              />
            }
          />
          <Route
            path="/refund-policy"
            element={
              <StaticInfoPage
                eyebrow="Legal"
                title="Refund Policy"
                intro="Refunds are processed for eligible cancelled or returned orders after review and approval."
                sections={[
                  {
                    heading: "Refund approval",
                    body: "Refunds are issued only after the related cancellation or return request satisfies the applicable policy conditions.",
                  },
                  {
                    heading: "Refund method",
                    body: "Approved refunds are generally sent back through the original payment method when possible, subject to processing rules.",
                  },
                  {
                    heading: "Processing time",
                    body: "Banking or gateway timelines can vary, so final credit confirmation may take additional time after refund initiation.",
                  },
                ]}
              />
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          <Route path="/men" element={<MenPage />} />
          <Route path="/kids" element={<KidsProducts />} />

          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/place-order"
            element={
              <PrivateRoute>
                <PlaceOrder />
              </PrivateRoute>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <AccountPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/account/profile"
            element={
              <PrivateRoute>
                <AccountPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/account/orders"
            element={
              <PrivateRoute>
                <AccountPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/account/change-password"
            element={
              <PrivateRoute>
                <AccountPage />
              </PrivateRoute>
            }
          />

          {/* 🔥 IMPORTANT */}
          <Route path="/searchResults" element={<Search products={products} />} />
        </Routes>

      {!hideFooterSections && <PreFooterSection />}
      {!hideFooterSections && <SiteFooter />}
    </>
  );
};

const App = () => (
  <CartProvider>
    <Router>
      <AppContent />
    </Router>
  </CartProvider>
);

export default App;
