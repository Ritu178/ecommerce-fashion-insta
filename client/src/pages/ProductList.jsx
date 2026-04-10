import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { CartContext } from "../context/CartContext";
import "./ProductList.css";

const ProductCard = ({ product, cart, addToCart, increment, decrement, removeItem, navigate }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const images = product.images ? product.images : [product.image, product.image];

  useEffect(() => {
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

  const cartItem = cart.find((c) => c.product_id === product.id);

  return (
    <div className="product-card">
      <div className="product-img">
        <img
          src={
            product.images
              ? images[imgIndex]
              : `http://localhost:5000/uploads/${images[imgIndex]}`
          }
          alt={product.title}
          onClick={() => navigate(`/products/${product.id}`)}
        />
        <span className="tag">NEW</span>
      </div>

      <div className="product-info">
        <h6 className="brand">{product.brand || "Brand"}</h6>
        <p className="title">{product.title}</p>

        <div className="price-box">
          <span className="price">₹{product.price}</span>
        </div>

        {!cartItem ? (
          <button className="cart-btn" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        ) : (
          <div className="qty-pill-container">
            <button
              className="qty-action-btn"
              onClick={() => {
                if (cartItem.quantity === 1) {
                  removeItem(product.id);
                } else {
                  decrement(product.id);
                }
              }}
            >
              {cartItem.quantity === 1 ? <FaTrash size={14} /> : <FiMinus />}
            </button>

            <span className="qty-display">{cartItem.quantity}</span>

            <button className="qty-action-btn" onClick={() => increment(product.id)}>
              <FiPlus />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductList = () => {
  const { cart, addToCart, increment, decrement, removeItem } = useContext(CartContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products/women")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.log(err);
        setProducts([]);
      });
  }, []);

  return (
    <>
      <div className="hero-section">
        <h1>Find Your Style</h1>
      </div>

      <div className="container my-5">
        <div className="product-grid">
          {(Array.isArray(products) ? products : []).map((product) => (
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
    </>
  );
};

export default ProductList;
