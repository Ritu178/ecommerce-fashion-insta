import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./ProductDetail.css";
import { FiMinus, FiPlus } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import Footer from "../components/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cart, addToCart, increment, decrement, removeItem } =
    useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/products/women").then(res => res.json()),
      fetch("http://localhost:5000/api/products/men").then(res => res.json()),
      fetch("http://localhost:5000/api/products/children").then(res => res.json())
    ])
      .then(([women, men, kids]) => {
        const allProducts = [...women, ...men, ...kids];

        const foundProduct = allProducts.find(
          (p) => p.id == id
        );

        setProduct(foundProduct);

        // ✅ RELATED PRODUCTS
        if (foundProduct) {
          const filtered = allProducts.filter(
            (p) =>
              p.category === foundProduct.category &&
              p.id !== foundProduct.id
          );

          setRelated(filtered.slice(0, 4));
        }
      })
      .catch(err => console.log(err));
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  const images = product.images
    ? product.images
    : [product.image, product.image];

  const cartItem = cart.find(
    (c) => c.product_id === product.id
  );

  return (
    <>
      <div className="product-detail-container">

        {/* LEFT IMAGE */}
        <div className="left">
          <div className="zoom-container">
            <img
              className="main-img zoom-img"
              src={
                product.images
                  ? images[selectedImg]
                  : `http://localhost:5000/uploads/${images[selectedImg]}`
              }
              alt=""
            />
          </div>

          <div className="thumbs">
            {images.map((img, i) => (
              <img
                key={i}
                src={
                  product.images
                    ? img
                    : `http://localhost:5000/uploads/${img}`
                }
                alt=""
                onClick={() => setSelectedImg(i)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT DETAILS */}
        <div className="right">
          <h2>{product.title}</h2>
          <h3>₹{product.price}</h3>

          {/*  Rating */}
          <div className="rating">
            ⭐ {product.rating || 4.2}
          </div>

          <p className="desc">
            Premium quality product with modern design.
          </p>

          {/* SIZE */}
          <div className="size-section">
            <p>Select Size</p>
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                className={selectedSize === size ? "active" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          {/* CART */}
          {!cartItem ? (
            <>
              <button
                className="add-btn"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>

              {/*  BUY NOW */}
              <button
                className="buy-btn"
                onClick={() => {
                  addToCart(product);
                  navigate("/checkout");
                }}
              >
                Buy Now
              </button>
            </>
          ) : (
            <div className="qty-pill-container">
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

          {/*  WISHLIST */}
          <button
            className="wishlist-btn"
            onClick={() => setWishlist([...wishlist, product])}
          >
            ❤️ Add to Wishlist
          </button>

          {/* EXTRA */}
          <div className="extra">
            <p>🚚 Delivery in 3-5 days</p>
            <p>💰 50% Discount</p>
          </div>
        </div>
      </div>

      {/*  RELATED PRODUCTS */}
      <div className="related-section">
        <h3>Related Products</h3>

        <div className="related-grid">
          {related.map((item) => (
            <div
              key={item.id}
              className="related-card"
              onClick={() => navigate(`/products/${item.id}`)}
            >
              <img
                src={
                  item.images
                    ? item.images[0]
                    : `http://localhost:5000/uploads/${item.image}`
                }
                alt=""
              />
              <p>{item.title}</p>
              <span>₹{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;