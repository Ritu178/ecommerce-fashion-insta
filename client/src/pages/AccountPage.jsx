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
                      <div className="order-item-main">
                        <div className="order-item-head">
                          <strong>Order #{order.id}</strong>
                          <p>{order.status || "Pending"}</p>
                        </div>

                        <div className="order-products">
                          {Array.isArray(order.products) && order.products.length > 0 ? (
                            order.products.map((item, index) => (
                              <div key={`${order.id}-${index}`} className="order-product-chip">
                                <span>{item.title || item.name || `Item ${index + 1}`}</span>
                                <strong>Qty {item.quantity || 1}</strong>
                              </div>
                            ))
                          ) : (
                            <p className="order-empty-items">No item details available</p>
                          )}
                        </div>
                      </div>
                      <div className="order-total-box">
                        <span>Total</span>
                        <strong>Rs. {Number(order.total ?? order.total_price ?? 0)}</strong>
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
