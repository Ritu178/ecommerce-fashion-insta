import React, { useContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { CartContext } from "../context/CartContext";
import apiClient from "../config/axios";
import "./PlaceOrder.css";

const EMPTY_FORM = {
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
};

const CHECKOUT_STORAGE_KEY = "checkoutDetails";
const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function clearCheckoutStorage() {
  localStorage.removeItem(CHECKOUT_STORAGE_KEY);
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

function getStoredCheckoutDetails() {
  try {
    return JSON.parse(localStorage.getItem(CHECKOUT_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function loadScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const PlaceOrder = () => {
  const { cart, clearCart } = useContext(CartContext);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isProfilePrefilled, setIsProfilePrefilled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedCheckout = getStoredCheckoutDetails();

    setForm((prev) => ({
      ...prev,
      ...storedCheckout,
      name: storedCheckout.name || storedUser.name || "",
      email: storedCheckout.email || storedUser.email || "",
      phone: storedCheckout.phone || storedUser.phone || "",
      saveAddress: Boolean(storedCheckout.saveAddress),
      terms: false,
    }));

    setIsProfilePrefilled(Boolean(storedUser.name || storedUser.email || storedCheckout.phone));
  }, []);

  useEffect(() => {
    if (!form.saveAddress) return;

    const { terms, ...checkoutDetails } = form;
    localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkoutDetails));
  }, [form]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      const nextForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "saveAddress" && !checked) {
        localStorage.removeItem(CHECKOUT_STORAGE_KEY);
      }

      return nextForm;
    });
  };

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0),
    [cart]
  );
  const isCartEmpty = cart.length === 0;
  const shipping = subtotal > 1000 ? 0 : 50;
  const discount = form.coupon === "DISCOUNT10" ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const submitOrder = async (paymentMode, paymentMeta = {}) => {
    const res = await apiClient.post("/api/orders", {
      user_id: userId,
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      payment: paymentMode,
      notes: form.notes,
      products: cart,
      total_price: total,
      ...paymentMeta,
    });

    return res.data;
  };

  const handleRazorpayPayment = async () => {
    const keyId = process.env.REACT_APP_RAZORPAY_KEY_ID;

    if (!keyId) {
      throw new Error("Razorpay key is missing. Set REACT_APP_RAZORPAY_KEY_ID.");
    }

    const scriptLoaded = await loadScript(RAZORPAY_SCRIPT_URL);
    if (!scriptLoaded) {
      throw new Error("Unable to load Razorpay checkout.");
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: keyId,
        amount: Math.round(total * 100),
        currency: "INR",
        name: "FASHIONISTA",
        description: "Checkout payment",
        handler: async (response) => {
          try {
            const data = await submitOrder("Online", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            resolve(data);
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#111827",
        },
        modal: {
          ondismiss: () => reject(new Error("Payment cancelled")),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      Swal.fire({
        title: "Login Required",
        text: "Please login before placing your order.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!form.terms) {
      Swal.fire({
        title: "Accept Terms",
        text: "Please accept Terms & Conditions before placing your order.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (isCartEmpty) {
      Swal.fire({
        title: "Cart Empty",
        text: "Add products to your cart before checkout.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    setSubmitting(true);

    try {
      const data =
        form.payment === "Online"
          ? await handleRazorpayPayment()
          : await submitOrder("COD");

      if (data?.success) {
        clearCheckoutStorage();
        clearCart();

        Swal.fire({
          title: "Order Placed Successfully!",
          text:
            form.payment === "Online"
              ? "Payment received and order confirmed."
              : "Your cash on delivery order has been confirmed.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#111827",
        });
      } else {
        throw new Error(data?.message || "Order creation failed");
      }
    } catch (err) {
      Swal.fire({
        title: "Checkout Failed",
        text: err.message || "Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-shell">
        <div className="checkout-hero">
          <span className="checkout-eyebrow">Secure checkout</span>
          <h1>Complete your order</h1>
          <p>
            Confirm your delivery details and choose either cash on delivery or Razorpay secure payment.
          </p>
        </div>

        <div className="checkout-layout">
          <form onSubmit={handleSubmit} className="checkout-form">
            <section className="checkout-card">
              <div className="section-head">
                <h3>Customer details</h3>
                {/* {isProfilePrefilled && <span className="pill">Prefilled from profile</span>} */}
              </div>

              <div className="field-grid customer-grid">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <input
                  className="full-span"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </section>
            <div className="mid-grid">
              <section className="checkout-card">
                <div className="section-head">
                  <h3>Delivery address</h3>
                </div>

                <textarea
                  className="full-span"
                  name="address"
                  placeholder="Full Address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />

                <div className="field-grid two-col">
                  <input
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="state"
                    placeholder="State"
                    value={form.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <input
                  className="full-span"
                  name="pincode"
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                />
              </section>

              <section className="checkout-card">
                <div className="section-head">
                  <h3>Payment method</h3>
                </div>

                <div className="payment-grid">
                  <label className={`payment-option ${form.payment === "COD" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={form.payment === "COD"}
                      onChange={handleChange}
                    />
                    <div>
                      <strong>Cash on Delivery</strong>
                      <p>Pay when your order arrives.</p>
                    </div>
                  </label>

                  <label className={`payment-option ${form.payment === "Online" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="Online"
                      checked={form.payment === "Online"}
                      onChange={handleChange}
                    />
                    <div>
                      <strong>Pay with Razorpay</strong>
                      <p>Card, UPI, net banking, and wallets.</p>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            <div className="checkout-actions">
              <div className="action-chips">
                <label className="check-row compact">
                  <input
                    type="checkbox"
                    name="saveAddress"
                    checked={form.saveAddress}
                    onChange={handleChange}
                  />
                  Save address
                </label>

                <label className="check-row compact">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={form.terms}
                    onChange={handleChange}
                  />
                  Terms & Conditions
                </label>
              </div>

              <button type="submit" className="checkout-btn" disabled={submitting || isCartEmpty}>
                {submitting
                  ? "Processing..."
                  : form.payment === "Online"
                    ? "Pay with Razorpay"
                    : "Place Order"}
              </button>
            </div>
          </form>

          <aside className="summary-card">
            <div className="summary-head">
              <h3>Order Summary</h3>
              <span>{cart.length} items</span>
            </div>

            <div className="summary-items">
              {isCartEmpty ? (
                <div className="summary-empty">
                  <strong>Your cart is empty</strong>
                  <p>Add items to see them here before you pay.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product_id} className="summary-item">
                    <div>
                      <strong>{item.title}</strong>
                      <span>Qty {item.quantity}</span>
                    </div>
                    <p>Rs. {(Number(item.price) * Number(item.quantity)).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>

            <div className="summary-breakdown">
              <div>
                <span>Subtotal</span>
                <strong>Rs. {subtotal.toFixed(2)}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</strong>
              </div>
              <div>
                <span>Discount</span>
                <strong>-Rs. {discount.toFixed(2)}</strong>
              </div>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>Rs. {total.toFixed(2)}</strong>
            </div>

            <div className="summary-note">
              Razorpay will open only for the online payment option.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
