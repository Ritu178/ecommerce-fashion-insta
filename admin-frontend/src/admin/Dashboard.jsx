import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  //  GLOBAL SEARCH ITEMS
  const searchItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Products", path: "/products" },
    { name: "Users", path: "/users" },
    { name: "Orders", path: "/orders" },
    { name: "Add Product", path: "/add-product" }
  ];

  useEffect(() => {
    if (search.trim() === "") {
      setResults([]);
    } else {
      const filtered = searchItems.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setResults(filtered);
    }
  }, [search]);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="layout">

      {/* SIDEBAR */}
      {/* <div className="sidebar">
        <h2 className="logo">Purple</h2>

        <div className="profile">
          <img src="https://i.pravatar.cc/40" alt="" />
          <div>
            <h4>David Grey</h4>
            <p>Project Manager</p>
          </div>
        </div>

        <ul className="menu">
          <li className="active">Dashboard</li>
          <li onClick={() => navigate("/products")}>Products</li>
          <li onClick={() => navigate("/users")}>Users</li>
          <li onClick={() => navigate("/orders")}>Orders</li>
        </ul>
      </div> */}

      {/* MAIN */}
      <div className="main">

        {/*  TOPBAR */}
        <div className="topbar">

          <div className="search-box">
            <input
              type="text"
              placeholder="Search anything..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* SEARCH DROPDOWN */}
            {search && (
              <div className="search-dropdown">
                {results.length > 0 ? (
                  results.map((item, i) => (
                    <div
                      key={i}
                      className="search-item"
                      onClick={() => {
                        navigate(item.path);
                        setSearch("");
                      }}
                    >
                      {item.name}
                    </div>
                  ))
                ) : (
                  <div className="not-found">Not Found</div>
                )}
              </div>
            )}
          </div>

          {/* USER + LOGOUT */}
          <div className="top-actions">
            <div className="user">Admin</div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

        </div>

        <h2 className="title">Dashboard</h2>

        {/* CARDS */}
        <div className="cards">

          <div className="card pink">
            <h5>Weekly Sales</h5>
            <h2>$15,000</h2>
            <p>Increased by 60%</p>
          </div>

          <div className="card blue">
            <h5>Weekly Orders</h5>
            <h2>45,633</h2>
            <p>Decreased by 10%</p>
          </div>

          <div className="card green">
            <h5>Visitors Online</h5>
            <h2>95,574</h2>
            <p>Increased by 5%</p>
          </div>

        </div>

        {/* CHART SECTION */}
        <div className="charts">

          <div className="chart-box">
            <h4>Visit And Sales Statistics</h4>
            <div className="fake-chart"></div>
          </div>

          <div className="chart-box small">
            <h4>Traffic Sources</h4>

            <div className="donut"></div>

            <div className="legend">
              <div><span className="dot red"></span> Search Engines</div>
              <div><span className="dot blue"></span> Direct Click</div>
              <div><span className="dot green"></span> Bookmarks Click</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}