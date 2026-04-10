import { NavLink } from "react-router-dom";
import "./Sidebar.css";
export default function Sidebar() {
  return (
    <aside className="sidebar-shell">
      <div className="sidebar-brand">
        <div className="brand-mark">F</div>
        <div>
          <p className="brand-kicker">Admin Console</p>
          <h4>FASHIONISTA</h4>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          Dashboard
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          Products
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          Users
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          Orders
        </NavLink>
        {/* <NavLink to="/my-orders" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          My Orders
        </NavLink> */}
      </nav>

      <div className="sidebar-footer">
        <span>Store operations</span>
        <p>Manage products, customers, and order flow from one workspace.</p>
      </div>
    </aside>
  );
}
