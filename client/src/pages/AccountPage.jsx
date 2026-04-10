import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../config/axios";
import "./AccountPage.css";

const TAB_MAP = {
  profile: "profile",
  orders: "orders",
  password: "password",
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

const formatMoney = (value) => {
  const amount = Number(value || 0);
  return `Rs. ${amount.toFixed(2)}`;
};

const getProductImage = (item) => {
  const rawImage = item?.image || item?.product_image || item?.thumbnail || "";

  if (!rawImage) return "";
  if (rawImage.startsWith("http")) return rawImage;
  if (rawImage.startsWith("/")) return rawImage;

  return `http://localhost:5000/uploads/${rawImage}`;
};

const getOrderItems = (order) => {
  if (!Array.isArray(order?.products)) return [];
  return order.products.map((item, index) => {
    const unitPrice = Number(item.price ?? item.unit_price ?? 0);
    const quantity = Number(item.quantity ?? 1);
    return {
      key: `${order.id}-${index}`,
      title: item.title || item.name || `Item ${index + 1}`,
      image: getProductImage(item),
      unitPrice,
      quantity,
      lineTotal: unitPrice * quantity,
    };
  });
};

export default function AccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getStoredUser());
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const activeTab = useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path.endsWith("/orders")) return TAB_MAP.orders;
    if (path.endsWith("/change-password")) return TAB_MAP.password;
    return TAB_MAP.profile;
  }, [location.pathname]);

  useEffect(() => {
    let mounted = true;

    apiClient
      .get("/api/me")
      .then((res) => {
        if (mounted && res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      })
      .catch(() => {
        // fall back to stored user data
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (activeTab !== TAB_MAP.orders || !user?._id) return;

    setLoadingOrders(true);
    apiClient
      .get(`/api/orders/user/${user._id}`)
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, [activeTab, user?._id]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Swal.fire({
        title: "Password mismatch",
        text: "New password and confirm password must match.",
        icon: "warning",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiClient.put("/api/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (res.data?.success) {
        Swal.fire({
          title: "Updated",
          text: "Your password has been changed.",
          icon: "success",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        throw new Error(res.data?.message || "Unable to update password");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || error.message || "Password update failed",
        icon: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="account-page">
      <div className="account-shell">
        <aside className="account-nav">
          <h2>My Account</h2>
          <button
            className={activeTab === TAB_MAP.profile ? "active" : ""}
            onClick={() => navigate("/account/profile")}
          >
            My Profile
          </button>
          <button
            className={activeTab === TAB_MAP.orders ? "active" : ""}
            onClick={() => navigate("/account/orders")}
          >
            My Orders
          </button>
          <button
            className={activeTab === TAB_MAP.password ? "active" : ""}
            onClick={() => navigate("/account/change-password")}
          >
            Change Password
          </button>
        </aside>

        <main className="account-content">
          {activeTab === TAB_MAP.profile && (
            <section className="account-card">
              <span className="account-eyebrow">Profile</span>
              <h1>{user?.name || "My Profile"}</h1>
              <div className="account-grid">
                <div>
                  <label>Name</label>
                  <p>{user?.name || "Not available"}</p>
                </div>
                <div>
                  <label>Email</label>
                  <p>{user?.email || "Not available"}</p>
                </div>
                <div>
                  <label>User ID</label>
                  <p>{user?._id || user?.id || "Not available"}</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === TAB_MAP.orders && (
            <section className="account-card">
              <span className="account-eyebrow">Orders</span>
              <h1>My Orders</h1>
              {loadingOrders ? (
                <p>Loading orders...</p>
              ) : orders.length === 0 ? (
                <p>You have no orders yet.</p>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <article key={order.id} className="order-item">
                      <div className="order-topbar">
                        <div>
                          <span className="order-kicker">Order #{order.id}</span>
                          <h3>{order.status || "Pending"}</h3>
                        </div>
                        <div className="order-total-box">
                          <span>Total</span>
                          <strong>{formatMoney(order.total ?? order.total_price ?? 0)}</strong>
                        </div>
                      </div>

                      <div className="order-body">
                        <div className="order-products">
                          {getOrderItems(order).length > 0 ? (
                            getOrderItems(order).map((item) => (
                              <div key={item.key} className="order-product-row">
                                <div className="order-product-image">
                                  {item.image ? (
                                    <img src={item.image} alt={item.title} />
                                  ) : (
                                    <div className="order-product-placeholder">{item.title.charAt(0)}</div>
                                  )}
                                </div>

                                <div className="order-product-meta">
                                  <strong>{item.title}</strong>
                                  <div className="order-product-pricing">
                                    <span>Qty {item.quantity}</span>
                                    <span>{formatMoney(item.unitPrice)} each</span>
                                    <span>{formatMoney(item.lineTotal)} total</span>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="order-empty-items">No item details available</p>
                          )}
                        </div>

                        <div className="order-summary-mini">
                          <div>
                            <span>Items</span>
                            <strong>{getOrderItems(order).length}</strong>
                          </div>
                          <div>
                            <span>Status</span>
                            <strong>{order.status || "Pending"}</strong>
                          </div>
                          <div>
                            <span>Order Total</span>
                            <strong>{formatMoney(order.total ?? order.total_price ?? 0)}</strong>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === TAB_MAP.password && (
            <section className="account-card">
              <span className="account-eyebrow">Security</span>
              <h1>Change Password</h1>
              <form className="password-form" onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  placeholder="Current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                  required
                />

                <button type="submit" disabled={submitting}>
                  {submitting ? "Updating..." : "Update Password"}
                </button>
              </form>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
