// import React, { useContext, useState, useEffect } from "react";
// import { CartContext } from "../context/CartContext";
// import "./ProductList.css"; // SAME CSS
// import { useNavigate } from "react-router-dom";
// import { FaTrash } from "react-icons/fa";
// import { FiMinus, FiPlus } from "react-icons/fi";
// /* ================= PRODUCT CARD ================= */
// // const ProductCard = ({
// //   product,
// //   cart,
// //   addToCart,
// //   increment,
// //   decrement,
// //   navigate,
// // }) => {
// //   const [imgIndex, setImgIndex] = useState(0);

// //   const images = product.images
// //     ? product.images
// //     : [product.image, product.image];

// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       setImgIndex((prev) =>
// //         prev === images.length - 1 ? 0 : prev + 1
// //       );
// //     }, 2000);

// //     return () => clearInterval(interval);
// //   }, [images.length]);

// //   const cartItem = cart.find((c) => c.id === product.id);

// //   return (
// //     <div className="product-card">
// //       <div className="product-img">
// //         <img
// //           src={
// //             product.images
// //               ? images[imgIndex]
// //               : `http://localhost:5000/uploads/${images[imgIndex]}`
// //           }
// //           alt=""
// //           onClick={() => navigate(`/products/${product.id}`)}
// //         />

// //         <span className="tag">NEW</span>
// //       </div>

// //       <div className="product-info">
// //         <h6 className="brand">{product.brand || "Brand"}</h6>
// //         <p className="title">{product.title}</p>

// //         <div className="rating">⭐ 4.3 | 2.5k</div>

// //         <div className="price-box">
// //           <span className="price">₹{product.price}</span>
// //           <span className="old-price">₹{product.price + 1000}</span>
// //           <span className="discount">(60% OFF)</span>
// //         </div>

// //         {!cartItem ? (
// //           <button
// //             className="cart-btn"
// //             onClick={() => addToCart(product)}
// //           >
// //             Add to Cart
// //           </button>
// //         ) : (
// //           <div className="qty-box">
// //             <button onClick={() => decrement(product.id)}>-</button>
// //             <span>{cartItem.quantity}</span>
// //             <button onClick={() => increment(product.id)}>+</button>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };


// const ProductCard = ({
//   product,
//   cart,
//   addToCart,
//   increment,
//   decrement,
//   removeItem,
//   navigate,
// }) => {

//   const [imgIndex, setImgIndex] = useState(0);

//   const images = product.images
//     ? product.images
//     : [product.image, product.image];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setImgIndex((prev) =>
//         prev === images.length - 1 ? 0 : prev + 1
//       );
//     }, 2000);

//     return () => clearInterval(interval);
//   }, [images.length]);

//   // FIXED MATCH
//   const cartItem = cart.find(
//     (c) => c.product_id === product.id
//   );

//   return (
//     <div className="product-card">

//       <div className="product-img">
//         <img
//           src={
//             product.images
//               ? images[imgIndex]
//               : `http://localhost:5000/uploads/${images[imgIndex]}`
//           }
//           alt="product"
//           onClick={() => navigate(`/products/${product.id}`)}
//         />

//         <span className="tag">NEW</span>
//       </div>

//       <div className="product-info">
//         <h6 className="brand">{product.brand || "Brand"}</h6>
//         <p className="title">{product.title}</p>

//         <div className="rating"> 4.3 | 2.5k</div>

//         <div className="price-box">
//           <span className="price">₹{product.price}</span>
//           <span className="old-price">₹{product.price + 1000}</span>
//           <span className="discount">(60% OFF)</span>
//         </div>

//         {!cartItem ? (
//           <button
//             className="cart-btn"
//             onClick={() => addToCart(product)}
//           >
//             Add to Cart
//           </button>
//         ) : (
//           // <div className="qty-box">

//           //   {/*  */}
//           //   <button onClick={() => decrement(product.id)}>
//           //     -
//           //   </button>

//           //   <span>{cartItem.quantity}</span>

//           //   {/*  */}
//           //   <button onClick={() => increment(product.id)}>
//           //     +
//           //   </button>

//           //   {/* 🗑 DELETE */}
//           //   <button
//           //     onClick={() => removeItem(product.id)}
//           //     style={{ background: "red" }}
//           //   >
//           //     🗑
//           //   </button>

//           // </div>
//           <div className="qty-box">

//   <button
//     className="qty-btn"
//     onClick={() => decrement(product.id)}
//   >
//     <FiMinus />
//   </button>

//   <span className="qty-number">
//     {cartItem.quantity}
//   </span>

//   <button
//     className="qty-btn"
//     onClick={() => increment(product.id)}
//   >
//     <FiPlus />
//   </button>

//   <button
//     className="delete-btn"
//     onClick={() => removeItem(product.id)}
//   >
//     <FaTrash />
//   </button>

// </div>
//         )}
//       </div>
//     </div>
//   );
// };
// /* ================= MEN PAGE ================= */
// const MenPage = () => {
//   const { cart, addToCart, increment, decrement } =
//     useContext(CartContext);

//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/products/men")
//       .then((res) => res.json())
//       .then((data) => setProducts(data))
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <>
//       <div className="hero-section">
//         <h1>Men Collection</h1>
//       </div>

//       <div className="container my-5">

//         {/*  GRID (5 CARDS) */}
//         <div className="product-grid">
//           {products.map((product) => (
//             <ProductCard
//               key={product.id}
//               product={product}
//               cart={cart}
//               addToCart={addToCart}
//               increment={increment}
//               decrement={decrement}
//               navigate={navigate}
//             />
//           ))}
//         </div>

//       </div>
//     </>
//   );
// };

// export default MenPage;

import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import "./ProductList.css"; 
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import Footer from "../components/Footer";

/* ================= PRODUCT CARD ================= */
const ProductCard = ({
  product,
  cart,
  addToCart,
  increment,
  decrement,
  removeItem,
  navigate,
}) => {
  const [imgIndex, setImgIndex] = useState(0);

  const images = product.images
    ? product.images
    : [product.image, product.image];

  useEffect(() => {
    const interval = setInterval(() => {
      setImgIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

  //  Cart item find karne ka logic
  const cartItem = cart.find(
    (c) => c.product_id === product.id
  );

  return (
    <div className="product-card">
      <div className="product-img">
        <img
          src={
            product.images
              ? images[imgIndex]
              : `http://localhost:5000/uploads/${images[imgIndex]}`
          }
          alt="product"
          onClick={() => navigate(`/products/${product.id}`)}
        />
        <span className="tag">NEW</span>
      </div>

      <div className="product-info">
        <h6 className="brand">{product.brand || "Brand"}</h6>
        <p className="title">{product.title}</p>

        <div className="rating">⭐ 4.3 | 2.5k</div>

        <div className="price-box">
          <span className="price">₹{product.price}</span>
          <span className="old-price">₹{product.price + 1000}</span>
          <span className="discount">(60% OFF)</span>
        </div>

        {!cartItem ? (
          <button
            className="cart-btn"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        ) : (
          /*  YELLOW PILL DESIGN WITH DELETE LOGIC */
          <div className="qty-pill-container">
            <button
              className="qty-action-btn"
              onClick={() => {
                if (cartItem.quantity === 1) {
                  removeItem(product.id); // Delete function
                } else {
                  decrement(product.id); // Minus function
                }
              }}
            >
              {/* Image ke hisaab se: 1 qty par trash dikhega */}
              {cartItem.quantity === 1 ? <FaTrash size={14} color="#333" /> : <FiMinus />}
            </button>

            <span className="qty-display">{cartItem.quantity}</span>

            <button
              className="qty-action-btn"
              onClick={() => increment(product.id)}
            >
              <FiPlus />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= MEN PAGE ================= */
const MenPage = () => {
  // removeItem ko Context se nikaalna zaroori hai
  const { cart, addToCart, increment, decrement, removeItem } =
    useContext(CartContext);

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products/men")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className="hero-section">
        <h1>Men Collection</h1>
      </div>

      <div className="container my-5">
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cart={cart}
              addToCart={addToCart}
              increment={increment}
              decrement={decrement}
              removeItem={removeItem} // Passing delete function
              navigate={navigate}
            />
          ))}
        </div>
      </div>
        <Footer />
    </>
  );
};

export default MenPage;