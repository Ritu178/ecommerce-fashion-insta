import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../config/api";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [orders, setOrders] = useState([]);
  const profileMenuRef = useRef(null);

  const searchItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Products", path: "/products" },
    { name: "Users", path: "/users" },
    { name: "Orders", path: "/orders" },
    { name: "Add Product", path: "/add-product" },
  ];

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    setResults(
      searchItems.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetch(buildApiUrl("/api/orders"));
        if (!res.ok) throw new Error("API Error");

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
        setOrders([]);
      }
    };

    loadOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.status === "Pending").length;
  const deliveredOrders = orders.filter((order) => order.status === "Delivered").length;
  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.total ?? order.total_price ?? 0),
    0
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Operations Overview</span>
          <h1>Dashboard</h1>
          <p>
            Track store activity, keep an eye on orders, and move through admin tasks faster.
          </p>
        </div>

        <div className="dashboard-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search anything..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <div className="search-dropdown">
                {results.length > 0 ? (
                  results.map((item, i) => (
                    <button
                      key={i}
                      className="search-item"
                      onClick={() => {
                        navigate(item.path);
                        setSearch("");
                      }}
                    >
                      {item.name}
                    </button>
                  ))
                ) : (
                  <div className="not-found">Not Found</div>
                )}
              </div>
            )}
          </div>

          <div className="top-actions" ref={profileMenuRef}>
            <button
              className="profile-trigger"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              aria-label="Open admin profile menu"
            >
              <span className="status-dot"></span>
              <span className="profile-initial">A</span>
            </button>

            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-head">
                  <div className="profile-avatar">A</div>
                  <div>
                    <strong>Admin</strong>
                    <p>Admin Console</p>
                  </div>
                </div>

                <button
                  className="profile-menu-item"
                  onClick={() => {
                    navigate("/admin");
                    setShowProfileMenu(false);
                  }}
                >
                  Profile
                </button>

                <button
                  className="profile-menu-item logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <article className="metric-card metric-pink">
          <span className="metric-label">Total Orders</span>
          <h2>{totalOrders}</h2>
          <p>All store orders</p>
        </article>

        <article className="metric-card metric-blue">
          <span className="metric-label">Pending Orders</span>
          <h2>{pendingOrders}</h2>
          <p>Awaiting fulfillment</p>
        </article>

        <article className="metric-card metric-green">
          <span className="metric-label">Delivered Orders</span>
          <h2>{deliveredOrders}</h2>
          <p>Completed deliveries</p>
        </article>

        <article className="metric-card metric-blue">
          <span className="metric-label">Revenue</span>
          <h2>₹{revenue}</h2>
          <p>Order total value</p>
        </article>
      </div>

      <div className="content-grid">
        <section className="panel panel-chart">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Performance</span>
              <h3>Visit and Sales Statistics</h3>
            </div>
            <button className="panel-link" onClick={() => navigate("/orders")}>View orders</button>
          </div>

          <div className="fake-chart">
            <div className="chart-bar bar-1"></div>
            <div className="chart-bar bar-2"></div>
            <div className="chart-bar bar-3"></div>
            <div className="chart-bar bar-4"></div>
            <div className="chart-bar bar-5"></div>
          </div>
        </section>

        <section className="panel panel-traffic">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Traffic</span>
              <h3>Traffic Sources</h3>
            </div>
          </div>

          <div className="donut"></div>

          <div className="legend">
            <div><span className="dot red"></span> Search Engines</div>
            <div><span className="dot blue"></span> Direct Click</div>
            <div><span className="dot green"></span> Bookmarks Click</div>
          </div>
        </section>
      </div>
    </div>
  );
}
