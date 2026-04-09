import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Admin.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <div className="content">
        {children}
      </div>

    </div>
  );
}