// import React, { useState, useContext } from "react";
// import { CartContext } from "../context/CartContext";
// import "./PlaceOrder.css";

// const PlaceOrder = () => {
//   const { cart } = useContext(CartContext);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//     payment: "COD",
//     coupon: "",
//     notes: "",
//     saveAddress: false,
//     terms: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const subtotal = cart.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );

//   const shipping = subtotal > 1000 ? 0 : 50;
//   const discount = form.coupon === "DISCOUNT10" ? subtotal * 0.1 : 0;

//   const total = subtotal + shipping - discount;

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!form.terms) {
//       alert("Please accept terms & conditions");
//       return;
//     }

//     alert("🎉 Order Placed Successfully!");
//   };
// const deleteOrder = async (id) => {
//   try {
//     const res = await fetch(`http://localhost:5000/orders/${id}`, {
//       method: "DELETE",
//     });

//     const data = await res.json();

//     if (data.success) {
//       alert("Order deleted");
//     } else {
//       alert("Error deleting order");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };


//   return (
//     <div className="order-container">
//       <h2>🛍 Place Your Order</h2>

//       <form onSubmit={handleSubmit} className="order-form">

//         {/* USER DETAILS */}
//         <input name="name" placeholder="Full Name" onChange={handleChange} required />
//         <input name="email" placeholder="Email Address" onChange={handleChange} required />
//         <input name="phone" placeholder="Phone Number" onChange={handleChange} required />

//         {/* ADDRESS */}
//         <textarea name="address" placeholder="Delivery Address" onChange={handleChange} required />

//         <div className="row">
//           <input name="city" placeholder="City" onChange={handleChange} required />
//           <input name="state" placeholder="State" onChange={handleChange} required />
//         </div>

//         <input name="pincode" placeholder="Postal Code" onChange={handleChange} required />

//         {/* ADDRESS TYPE */}
//         <select name="addressType" onChange={handleChange}>
//           <option>Home</option>
//           <option>Office</option>
//           <option>Other</option>
//         </select>

//         {/* PAYMENT */}
//         <select name="payment" onChange={handleChange}>
//           <option value="COD">Cash on Delivery</option>
//           <option value="Online">Online Payment</option>
//         </select>

//         {/* COUPON */}
//         <input
//           name="coupon"
//           placeholder="Enter Coupon Code (e.g. DISCOUNT10)"
//           onChange={handleChange}
//         />

//         {/* NOTES */}
//         <textarea
//           name="notes"
//           placeholder="Order Notes (optional)"
//           onChange={handleChange}
//         />

//         {/* SAVE ADDRESS */}
//         <label>
//           <input
//             type="checkbox"
//             name="saveAddress"
//             onChange={handleChange}
//           />
//           Save this address for future orders
//         </label>

//         {/* ORDER SUMMARY */}
//         <div className="summary">
//           <h3>Order Summary</h3>

//           {cart.map((item) => (
//             <div key={item.product_id} className="summary-item">
//               <span>{item.title} × {item.quantity}</span>
//               <span>₹{item.price * item.quantity}</span>
//             </div>
//           ))}

//           <hr />

//           <p>Subtotal: ₹{subtotal}</p>
//           <p>Shipping: ₹{shipping}</p>
//           <p>Discount: ₹{discount}</p>

//           <h3>Total: ₹{total}</h3>
//         </div>

//         {/* TERMS */}
//         <label>
//           <input type="checkbox" name="terms" onChange={handleChange} />
//           I agree to Terms & Conditions
//         </label>

//         {/* BUTTON */}
//         <button type="submit" className="place-btn">
//           Place Order
//         </button>

//       </form>
//     </div>
//   );
// };

// export default PlaceOrder;


import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./PlaceOrder.css";
import Swal from "sweetalert2";
const PlaceOrder = () => {
  const { cart } = useContext(CartContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "COD",
    coupon: "",
    notes: "",
    saveAddress: false,
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 1000 ? 0 : 50;
  const discount = form.coupon === "DISCOUNT10" ? subtotal * 0.1 : 0;

  const total = subtotal + shipping - discount;

//  const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await fetch("http://localhost:5000/api/orders", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         user_id: 1, // login se lena (temporary 1)
//         products: cart, //  cart se products
//         total_price: total, // total_price
//         address: form.address,
//       }),
//     });

//     const data = await res.json();
//     console.log("Response:", data);

//     if (data.success) {
//       alert(" Order Placed Successfully!");
//     } else {
//       alert(" Order failed: " + data.message);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: 1,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        payment: form.payment,
        notes: form.notes,
        products: cart,
        total_price: total
      })
    });

    const data = await res.json();
    console.log("FULL RESPONSE ", data);

    if (data.success) {
      Swal.fire({
        title: "Order Placed Successfully!",
        text: "Your order has been confirmed.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#ff9900",
      });
    } else {
      Swal.fire({
        title: "Order Failed",
        text: "Something went wrong.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }

  } catch (err) {
    console.log(err);
    Swal.fire({
      title: "Server Error",
      text: "Please try again later.",
      icon: "error"
    });
  }
};

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await fetch("http://localhost:5000/api/orders", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//      body: JSON.stringify({
//   user_id: 1,
//   name: form.name,
//   email: form.email,
//   phone: form.phone,
//   address: form.address,
//   city: form.city,
//   state: form.state,
//   pincode: form.pincode,
//   payment: form.payment,
//   notes: form.notes,
//   products: cart,
//   total_price: total
// })
//     });

//     const data = await res.json();
// console.log("FULL RESPONSE 👉", data); 
//     if (data.success) {
//       alert("🎉 Order Placed Successfully!");
//     } else {
//       alert("❌ Order failed");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
  // return (
  //   <div className="order-container">
  //     <h2>🛍 Place Your Order</h2>

  //     <form onSubmit={handleSubmit} className="order-form">

  //       {/* USER DETAILS */}
  //       <input name="name" placeholder="Full Name" onChange={handleChange} required />
  //       <input name="email" placeholder="Email Address" onChange={handleChange} required />
  //       <input name="phone" placeholder="Phone Number" onChange={handleChange} required />

  //       {/* ADDRESS */}
  //       <textarea name="address" placeholder="Delivery Address" onChange={handleChange} required />

  //       <div className="row">
  //         <input name="city" placeholder="City" onChange={handleChange} required />
  //         <input name="state" placeholder="State" onChange={handleChange} required />
  //       </div>

  //       <input name="pincode" placeholder="Postal Code" onChange={handleChange} required />

  //       {/* PAYMENT */}
  //       <select name="payment" onChange={handleChange}>
  //         <option value="COD">Cash on Delivery</option>
  //         <option value="Online">Online Payment</option>
  //       </select>

  //       {/* COUPON */}
  //       <input
  //         name="coupon"
  //         placeholder="Enter Coupon Code (DISCOUNT10)"
  //         onChange={handleChange}
  //       />

  //       {/* NOTES */}
  //       <textarea
  //         name="notes"
  //         placeholder="Order Notes (optional)"
  //         onChange={handleChange}
  //       />

  //       {/* SAVE ADDRESS */}
  //       <label>
  //         <input
  //           type="checkbox"
  //           name="saveAddress"
  //           onChange={handleChange}
  //         />
  //         Save this address for future orders
  //       </label>

  //       {/* ORDER SUMMARY */}
  //       <div className="summary">
  //         <h3>Order Summary</h3>

  //         {cart.map((item) => (
  //           <div key={item.product_id} className="summary-item">
  //             <span>{item.title} × {item.quantity}</span>
  //             <span>₹{item.price * item.quantity}</span>
  //           </div>
  //         ))}

  //         <hr />

  //         <p>Subtotal: ₹{subtotal}</p>
  //         <p>Shipping: ₹{shipping}</p>
  //         <p>Discount: ₹{discount}</p>

  //         <h3>Total: ₹{total}</h3>
  //       </div>

  //       {/* TERMS */}
  //       <label>
  //         <input type="checkbox" name="terms" onChange={handleChange} />
  //         I agree to Terms & Conditions
  //       </label>

  //       {/* BUTTON */}
  //       <button type="submit" className="place-btn">
  //         Place Order
  //       </button>

  //     </form>
  //   </div>
  // );
  return (
  <div className="amazon-checkout">

    <div className="checkout-left">
      <h2>Checkout</h2>

      <form onSubmit={handleSubmit} className="amazon-form">

        <div className="section">
          <h3>Your Details</h3>
          <input name="name" placeholder="Full Name" onChange={handleChange} required />
          <input name="email" placeholder="Email Address" onChange={handleChange} required />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
        </div>

        <div className="section">
          <h3>Delivery Address</h3>
          <textarea name="address" placeholder="Full Address" onChange={handleChange} required />

          <div className="row">
            <input name="city" placeholder="City" onChange={handleChange} required />
            <input name="state" placeholder="State" onChange={handleChange} required />
          </div>

          <input name="pincode" placeholder="Pincode" onChange={handleChange} required />
        </div>

        <div className="section">
          <h3>Payment</h3>
          <select name="payment" onChange={handleChange}>
            <option value="COD">Cash on Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <div className="section">
          <h3>Coupon</h3>
          <input name="coupon" placeholder="Enter coupon (DISCOUNT10)" onChange={handleChange} />
        </div>

        <div className="section">
          <label>
            <input type="checkbox" name="terms" onChange={handleChange} />
            I agree to Terms & Conditions
          </label>
        </div>

        <button type="submit" className="amazon-btn">
          Place Order
        </button>

      </form>
    </div>

    {/* RIGHT SIDE - ORDER SUMMARY */}
    <div className="checkout-right">
      <h3>Order Summary</h3>

      {cart.map((item) => (
        <div key={item.product_id} className="item">
          <span>{item.title} × {item.quantity}</span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}

      <hr />

      <p>Subtotal: ₹{subtotal}</p>
      <p>Shipping: ₹{shipping}</p>
      <p>Discount: ₹{discount}</p>

      <h2>Total: ₹{total}</h2>
    </div>

  </div>
);
};

export default PlaceOrder;