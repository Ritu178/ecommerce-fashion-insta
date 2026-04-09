import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import "./kids.css";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import Footer from "../components/Footer";

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

  //  FIX (VERY IMPORTANT)
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
          /*  AMAZON STYLE */
          <div className="qty-pill">

            <button
              onClick={() => {
                if (cartItem.quantity === 1) {
                  removeItem(product.id);
                } else {
                  decrement(product.id);
                }
              }}
            >
              {cartItem.quantity === 1 ? <FaTrash /> : <FiMinus />}
            </button>

            <span>{cartItem.quantity}</span>

            <button onClick={() => increment(product.id)}>
              <FiPlus />
            </button>

          </div>
        )}
      </div>
    </div>
  );
};


const KidsProducts = () => {
  const { cart, addToCart, increment, decrement, removeItem } =
    useContext(CartContext);

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products/children")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className="hero-section kids-hero">
        <h1>Kids Collection </h1>
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
              removeItem={removeItem} 
              navigate={navigate}
            />
          ))}

        </div>
      </div>
         <Footer />
    </>
  );
};

export default KidsProducts;