import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
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
const QR_POLL_INTERVAL_MS = 4000;
const QR_TIMEOUT_MS = 5 * 60 * 1000;

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
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [isProfilePrefilled, setIsProfilePrefilled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [qrSession, setQrSession] = useState(null);
  const [qrStatus, setQrStatus] = useState("");
  const [qrCreating, setQrCreating] = useState(false);
  const [qrChecking, setQrChecking] = useState(false);
  const userId = Number(localStorage.getItem("userId"));
  const qrPollRef = useRef(null);
  const qrTimeoutRef = useRef(null);
  const qrClosedRef = useRef(false);

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

  useEffect(
    () => () => {
      if (qrPollRef.current) {
        clearInterval(qrPollRef.current);
      }

      if (qrTimeoutRef.current) {
        clearTimeout(qrTimeoutRef.current);
      }
    },
    []
  );

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
  const totalInPaise = Math.round(total * 100);

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

  const handleStandardRazorpayPayment = async () => {
    const keyId = process.env.REACT_APP_RAZORPAY_KEY_ID;

    if (!keyId) {
      throw new Error("Razorpay key is missing. Set REACT_APP_RAZORPAY_KEY_ID.");
    }

    const scriptLoaded = await loadScript(RAZORPAY_SCRIPT_URL);
    if (!scriptLoaded) {
      throw new Error("Unable to load Razorpay checkout.");
    }

    const orderResponse = await apiClient.post("/api/payments/razorpay/order", {
      amount: total,
      receipt: `checkout_${Date.now()}`,
      notes: {
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
      },
    });

    const razorpayOrder = orderResponse.data?.order;

    if (!razorpayOrder?.id) {
      throw new Error("Unable to create Razorpay order.");
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: keyId,
        amount: totalInPaise,
        currency: "INR",
        order_id: razorpayOrder.id,
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

  const clearQrTimers = () => {
    if (qrPollRef.current) {
      clearInterval(qrPollRef.current);
      qrPollRef.current = null;
    }

    if (qrTimeoutRef.current) {
      clearTimeout(qrTimeoutRef.current);
      qrTimeoutRef.current = null;
    }
  };

  const closeQrSession = () => {
    qrClosedRef.current = true;
    clearQrTimers();
    setQrSession(null);
    setQrStatus("");
    setQrCreating(false);
    setQrChecking(false);
  };

  const fetchQrPayments = async (qrId) => {
    const response = await apiClient.get(`/api/payments/razorpay/qr/${qrId}/payments`);
    return response.data?.payments || [];
  };

  const confirmQrPayment = async (qr, payment) => {
    qrClosedRef.current = true;
    clearQrTimers();

    const data = await submitOrder("Online", {
      razorpay_qr_code_id: qr.id,
      razorpay_payment_id: payment.id,
      razorpay_payment_status: payment.status,
      razorpay_payment_method: payment.method,
      razorpay_payment_amount: payment.amount,
    });

    if (data?.success) {
      clearCheckoutStorage();
      clearCart();
      closeQrSession();

      Swal.fire({
        title: "Payment Received",
        text: "Your UPI payment was confirmed and the order has been placed.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#111827",
      }).then(() => {
        navigate("/account/orders");
      });
    }

    return data;
  };

  const checkQrPayment = async (qr) => {
    if (!qr?.id || qrClosedRef.current) return;

    setQrChecking(true);

    try {
      const payments = await fetchQrPayments(qr.id);
      const matchedPayment = payments.find(
        (payment) =>
          Number(payment.amount) === totalInPaise &&
          ["captured", "authorized"].includes(payment.status)
      );

      if (matchedPayment) {
        await confirmQrPayment(qr, matchedPayment);
      } else {
        setQrStatus("Waiting for payment confirmation...");
      }
    } catch (error) {
      if (!qrClosedRef.current) {
        setQrStatus(error.message || "Unable to verify payment yet.");
      }
    } finally {
      setQrChecking(false);
    }
  };

  const startQrPolling = (qr) => {
    qrClosedRef.current = false;
    clearQrTimers();
    setQrSession(qr);
    setQrStatus("Scan the QR code from your phone and complete the payment.");

    checkQrPayment(qr);

    qrPollRef.current = setInterval(() => {
      checkQrPayment(qr);
    }, QR_POLL_INTERVAL_MS);

    qrTimeoutRef.current = setTimeout(() => {
      if (qrClosedRef.current) return;
      clearQrTimers();
      setQrStatus("Payment not detected. You can close this and try again.");
    }, QR_TIMEOUT_MS);
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

    if (qrSession) {
      return;
    }

    setSubmitting(true);

    try {
      if (form.payment === "Online") {
        setQrCreating(true);

        try {
          const qrResponse = await apiClient.post("/api/payments/razorpay/qr", {
            amount: total,
            name: "FASHIONISTA Checkout",
            description: `Order payment for ${form.name || "customer"}`,
            notes: {
              customer_name: form.name,
              customer_email: form.email,
              customer_phone: form.phone,
            },
          });

          const qr = qrResponse.data?.qr;

          if (!qr?.id) {
            throw new Error("Unable to create Razorpay QR code.");
          }

          startQrPolling(qr);
          return;
        } catch (qrError) {
          const fallbackData = await handleStandardRazorpayPayment();

          if (fallbackData?.success) {
            clearCheckoutStorage();
            clearCart();

            Swal.fire({
              title: "Order Placed Successfully!",
              text: "Payment received and order confirmed.",
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#111827",
            }).then(() => {
              navigate("/account/orders");
            });
          } else {
            throw qrError;
          }

          return;
        } finally {
          setQrCreating(false);
        }
      }

      const data = await submitOrder("COD");

      if (data?.success) {
        clearCheckoutStorage();
        clearCart();

        Swal.fire({
          title: "Order Placed Successfully!",
          text: "Your cash on delivery order has been confirmed.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#111827",
        }).then(() => {
          navigate("/account/orders");
        });
      } else {
        throw new Error(data?.message || "Order creation failed");
      }
    } catch (err) {
      clearQrTimers();
      setQrSession(null);
      setQrStatus("");
      setQrCreating(false);
      setQrChecking(false);

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
                  <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
                  <input name="state" placeholder="State" value={form.state} onChange={handleChange} required />
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
                      <strong>Pay with UPI QR</strong>
                      <p>Scan the Razorpay QR code from your phone.</p>
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
                  <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} />
                  Terms & Conditions
                </label>
              </div>

              <button
                type="submit"
                className="checkout-btn"
                disabled={submitting || isCartEmpty || Boolean(qrSession)}
              >
                {submitting
                  ? qrCreating
                    ? "Creating QR..."
                    : "Processing..."
                  : qrSession
                    ? "Waiting for payment..."
                    : form.payment === "Online"
                      ? "Pay with UPI QR"
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

            <div className="summary-note">UPI QR will appear for the online payment option.</div>
          </aside>
        </div>
      </div>

      {qrSession && (
        <div className="qr-backdrop" role="dialog" aria-modal="true" aria-label="Razorpay UPI QR checkout">
          <div className="qr-modal">
            <div className="qr-modal-head">
              <div>
                <span className="qr-eyebrow">Razorpay UPI QR</span>
                <h3>Scan and pay from your phone</h3>
              </div>
              <button type="button" className="qr-close" onClick={closeQrSession} aria-label="Close QR dialog">
                ×
              </button>
            </div>

            <div className="qr-modal-grid">
              <div className="qr-card">
                <img
                  src={qrSession.image_url}
                  alt="Razorpay UPI QR code"
                  className="qr-image"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <a href={qrSession.image_url} target="_blank" rel="noreferrer" className="qr-link">
                  Open QR in a new tab
                </a>
                {qrSession.image_content && (
                  <p className="qr-content">
                    UPI string:
                    <span>{qrSession.image_content}</span>
                  </p>
                )}
              </div>

              <div className="qr-meta">
                <strong>Amount</strong>
                <p>Rs. {total.toFixed(2)}</p>
                <strong>Status</strong>
                <p>{qrStatus || "Waiting for payment..."}</p>
                <strong>Instructions</strong>
                <ul>
                  <li>Open any UPI app on your phone.</li>
                  <li>Scan the QR code and complete the payment.</li>
                  <li>Return here and wait for confirmation.</li>
                </ul>
                <div className="qr-actions">
                  <button type="button" className="checkout-btn" onClick={() => checkQrPayment(qrSession)} disabled={qrChecking}>
                    {qrChecking ? "Checking..." : "Refresh payment status"}
                  </button>
                  <button type="button" className="qr-secondary" onClick={closeQrSession}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
