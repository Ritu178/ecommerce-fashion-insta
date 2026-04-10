// // // import React, { useContext } from "react";
// // // import { CartContext } from "../context/CartContext";

// // // const CartPage = () => {
// // //   const { cart } = useContext(CartContext);

// // //   const total = cart.reduce(
// // //     (acc, item) => acc + item.price * item.qty,
// // //     0
// // //   );

// // //   return (
// // //     <div>
// // //       <h1>My Cart</h1>

// // //       {cart.map((item) => (
// // //         <div key={item.id}>
// // //           <h3>{item.name}</h3>
// // //           <p>
// // //             {item.qty} × ₹{item.price}
// // //           </p>
// // //         </div>
// // //       ))}

// // //       <h2>Total: ₹{total}</h2>
// // //     </div>
// // //   );
// // // };

// // // export default CartPage;
// // import React, { useContext, useState } from "react";
// // import { FaTrash, FaArrowRight, FaHeart } from "react-icons/fa";
// // import { CartContext } from "../context/CartContext";
// // import "./CartPage.css";

// // import img1 from "../assets/img.13.jpg";
// // import img2 from "../assets/img.14.jpg";
// // import img3 from "../assets/img.15.jpg";
// // import img4 from "../assets/img.16.jpg";
// // import img5 from "../assets/img.17.jpg";
// // import img6 from "../assets/img.18.jpg";
// // import img7 from "../assets/img.19.jpg";
// // import img8 from "../assets/img.20.jpg";
// // import img9 from "../assets/img.21.jpg";

// // const products = [
// //   { id: 1, title: "Summer Wear", price: 200, img: img1 },
// //   { id: 2, title: "Beautiful Engagement Lehenga", price: 1200, img: img2 },
// //   { id: 3, title: "Wide Leg Beige Trousers", price: 1300, img: img3 },
// //   { id: 4, title: "Maroon Printed Kurti", price: 500, img: img4 },
// //   { id: 5, title: "Casual Outfits", price: 200, img: img5 },
// //   { id: 6, title: "Half Sleeve Cottonblend", price: 260, img: img6 },
// //   { id: 7, title: "Summer Wear", price: 200, img: img7 },
// //   { id: 8, title: "Floral Elegance", price: 3200, img: img8 },
// //   { id: 9, title: "Floral Elegance", price: 3200, img: img9 },
// // ];

// // const CartPage = () => {
// //   const { cart, increment, decrement, removeItem } =
// //     useContext(CartContext);

// //   const [promo, setPromo] = useState("");
// //   const [discount, setDiscount] = useState(0);
// //   const [deliveryFee, setDeliveryFee] = useState(15);
// //   const [wishlist, setWishlist] = useState([]);

// //   const mergedCart = cart.map((item) => {
// //     const product = products.find((p) => p.id === item.product_id);
// //     return { ...item, ...product };
// //   });

// //   const totalPrice = mergedCart.reduce(
// //     (sum, item) => sum + item.price * item.quantity,
// //     0
// //   );

// //   const applyPromo = () => {
// //     if (promo === "SAVE20") {
// //       setDiscount(Math.floor(totalPrice * 0.2));
// //     } else if (promo === "FLAT100") {
// //       setDiscount(100);
// //     } else {
// //       alert("Invalid Code ❌");
// //     }

// //     if (totalPrice > 1000) {
// //       setDeliveryFee(0);
// //     }
// //   };

// //   const finalTotal = totalPrice - discount + deliveryFee;

// //   const toggleWishlist = (id) => {
// //     setWishlist((prev) =>
// //       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
// //     );
// //   };

// //   return (
// //     <div className="cart-page">

// //       {/* EMPTY CART */}
// //       {mergedCart.length === 0 && (
// //         <div className="empty-cart">
// //           🛍 Your cart is empty
// //         </div>
// //       )}

// //       {/* LEFT */}
// //       <div className="cart-left">
// //         <h2>Shopping Cart</h2>

// //         {mergedCart.map((item) => (
// //           <div className="cart-item fade-in" key={item.product_id}>

// //             <div className="image-box">
// //               <img src={item.img} alt={item.title} />

// //               {discount > 0 && (
// //                 <span className="discount-badge">
// //                   -{Math.round((discount / totalPrice) * 100)}%
// //                 </span>
// //               )}
// //             </div>

// //             <div className="item-details">
// //               <h4>{item.title}</h4>
// //               <p className="stock">In stock</p>

// //               <div className="qty-box">
// //                 <button onClick={() => decrement(item.product_id)}>-</button>
// //                 <span>{item.quantity}</span>
// //                 <button onClick={() => increment(item.product_id)}>+</button>
// //               </div>

// //               {/* ACTIONS */}
// //               <div className="actions">
// //                 <button
// //                   className="delete-btn"
// //                   onClick={() => removeItem(item.product_id)}
// //                 >
// //                   <FaTrash />
// //                 </button>

// //                 <button
// //                   className={`wishlist-btn ${
// //                     wishlist.includes(item.product_id) ? "active" : ""
// //                   }`}
// //                   onClick={() => toggleWishlist(item.product_id)}
// //                 >
// //                   <FaHeart />
// //                 </button>
// //               </div>
// //             </div>

// //             <div className="item-price">₹{item.price}</div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* RIGHT */}
// //       <div className="cart-right">
// //         <h3>Order Summary</h3>

// //         <div className="summary-row">
// //           <span>Subtotal</span>
// //           <span>₹{totalPrice}</span>
// //         </div>

// //         <div className="summary-row discount">
// //           <span>Discount</span>
// //           <span>-₹{discount}</span>
// //         </div>

// //         <div className="summary-row">
// //           <span>Delivery Fee</span>
// //           <span>₹{deliveryFee}</span>
// //         </div>

// //         <hr />

// //         <div className="summary-row total">
// //           <span>Total</span>
// //           <span>₹{finalTotal}</span>
// //         </div>

// //         {/* SAVED MESSAGE */}
// //         {discount > 0 && (
// //           <p className="saved-text">
// //             🎉 You saved ₹{discount}
// //           </p>
// //         )}

// //         {/* PROMO */}
// //         <div className="promo-box">
// //           <input
// //             type="text"
// //             placeholder="Add promo code"
// //             value={promo}
// //             onChange={(e) => setPromo(e.target.value)}
// //           />
// //           <button className="apply-btn" onClick={applyPromo}>
// //             Apply
// //           </button>
// //         </div>

// //         {/* SUCCESS */}
// //         {discount > 0 && (
// //           <p className="promo-success"> Promo Applied</p>
// //         )}

// //         <button className="checkout-btn">
// //           Go to Checkout <FaArrowRight />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// export default CartPage;
import React, { useContext, useState } from "react";
import {
  FaTrash,
  FaArrowRight,
  FaHeart,
  FaShoppingBag,
  FaTruck,
  FaTag,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./CartPage.css";

const CartPage = () => {
  const { cart, increment, decrement, removeItem } =
    useContext(CartContext);

  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(15);
  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();
  //  IMPORTANT: backend se aane wale data ko use karo
  const mergedCart = cart.map((item) => ({
    product_id: item.product_id,
    title: item.title,
    price: item.price,
    img: item.image
      ? `http://localhost:5000/uploads/${item.image}`
      : "https://via.placeholder.com/100",
    quantity: item.quantity,
  }));

  const totalPrice = mergedCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const isEmpty = mergedCart.length === 0;

  //  PROMO API CALL
  const applyPromo = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/promo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: promo,
          total: totalPrice,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setDiscount(data.discountAmount);
      } else {
        alert("Invalid Code ");
      }

      if (totalPrice > 1000) {
        setDeliveryFee(0);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const finalTotal = totalPrice - discount + deliveryFee;

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="cart-page">
      <div className="cart-left">
        {isEmpty ? (
          <div className="empty-cart-panel">
            <div className="empty-cart-badge">Your wardrobe is waiting</div>
            <div className="empty-cart-icon">
              <FaShoppingBag />
            </div>
            <h2>Shopping Cart</h2>
            <p className="empty-cart-title">Your cart is empty</p>
            <p className="empty-cart-copy">
              Add a few standout pieces and we will keep everything ready for a
              smoother checkout.
            </p>

            <div className="empty-cart-highlights">
              <div className="empty-highlight-card">
                <FaTruck />
                <div>
                  <strong>Fast dispatch</strong>
                  <span>Delivery fee updates once items are added.</span>
                </div>
              </div>

              <div className="empty-highlight-card">
                <FaTag />
                <div>
                  <strong>Promo ready</strong>
                  <span>Apply savings after you build your bag.</span>
                </div>
              </div>
            </div>

            <div className="empty-cart-actions">
              <button
                className="empty-cart-primary"
                onClick={() => navigate("/products")}
              >
                Explore Products <FaArrowRight />
              </button>
              <button
                className="empty-cart-secondary"
                onClick={() => navigate("/")}
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2>Shopping Cart</h2>

            {mergedCart.map((item) => (
          <div className="cart-item fade-in" key={item.product_id}>

            <div className="image-box">
              <img src={item.img} alt={item.title} />

              {discount > 0 && (
                <span className="discount-badge">
                  -{Math.round((discount / totalPrice) * 100)}%
                </span>
              )}
            </div>

            <div className="item-details">
              <h4>{item.title}</h4>
              <p className="stock">In stock</p>

              <div className="qty-box">
                <button onClick={() => decrement(item.product_id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increment(item.product_id)}>+</button>
              </div>

              <div className="actions">
                <button
                  className="delete-btn"
                  onClick={() => removeItem(item.product_id)}
                >
                  <FaTrash />
                </button>

                <button
                  className={`wishlist-btn ${wishlist.includes(item.product_id)
                      ? "active"
                      : ""
                    }`}
                  onClick={() =>
                    toggleWishlist(item.product_id)
                  }
                >
                  <FaHeart />
                </button>
              </div>
            </div>

            <div className="item-price">Rs. {item.price}</div>
          </div>
            ))}
          </>
        )}
      </div>

      {/* RIGHT */}
      <div className={`cart-right ${isEmpty ? "cart-right-empty" : ""}`}>
        <h3>Order Summary</h3>

        <div className="summary-row">
          <span>Subtotal</span>
          <span>Rs. {totalPrice}</span>
        </div>

        <div className="summary-row discount">
          <span>Discount</span>
          <span>-Rs. {discount}</span>
        </div>

        <div className="summary-row">
          <span>Delivery Fee</span>
          <span>{isEmpty ? "Calculated at checkout" : `Rs. ${deliveryFee}`}</span>
        </div>

        <hr />

        <div className="summary-row total">
          <span>Total</span>
          <span>{isEmpty ? "Rs. 0" : `Rs. ${finalTotal}`}</span>
        </div>

        {discount > 0 && !isEmpty && (
          <p className="saved-text">
            You saved Rs. {discount}
          </p>
        )}

        <div className="promo-box">
          <input
            type="text"
            placeholder="Add promo code"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            disabled={isEmpty}
          />
          <button className="apply-btn" onClick={applyPromo} disabled={isEmpty}>
            Apply
          </button>
        </div>

        {isEmpty && (
          <p className="empty-summary-note">
            Add products to unlock delivery options, promo codes, and checkout.
          </p>
        )}

        {discount > 0 && !isEmpty && (
          <p className="promo-success">
            Promo Applied
          </p>
        )}

        <button
          className="checkout-btn"
          onClick={() => navigate("/place-order")}
          disabled={isEmpty}
        >
          {isEmpty ? "Add items to continue" : "Place Order"} <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default CartPage;
