import { Link } from "react-router-dom";
import "./Sidebar.css";
export default function Sidebar() {
  return (
    <div style={{ width: "250px", height: "100vh", background: "#1e293b", color: "white" }}>
      <h4 className="p-3">Admin Panel</h4>

      <ul className="list-unstyled p-3">
        <li><Link to="/admin" className="text-white">Dashboard</Link></li>
        <li><Link to="/products" className="text-white">Products</Link></li>
        {/* <li><Link to="/add-product" className="text-white">Add Product</Link></li> */}
        <li><Link to="/users" className="text-white">Users</Link></li>
        <li><Link to="/admin/orders" className="text-white"> Orders</Link></li>
        <li><Link to="/my-orders" className="text-white">My Orders</Link></li>
      </ul>
    </div>
  );
}
