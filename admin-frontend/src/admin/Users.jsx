import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { buildApiUrl } from "../config/api";
import adminApi from "../config/axios";
import "./Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await adminApi.get(buildApiUrl("/admin/users"));
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setUsers([]);
      setError(err.response?.data?.error || err.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    return (
      user.name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      String(user.id).includes(q)
    );
  });

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <span className="users-eyebrow">Registered members</span>
          <h1>Users</h1>
          <p>All registered customer accounts in one place.</p>
        </div>

        <div className="users-actions">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="refresh-btn"
            onClick={() => {
              Swal.fire({
                title: "Refreshing",
                text: "Reloading registered users",
                timer: 700,
                showConfirmButton: false,
              });
              loadUsers();
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="users-summary">
        <div className="summary-card">
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </div>
        <div className="summary-card accent">
          <span>Visible</span>
          <strong>{filteredUsers.length}</strong>
        </div>
      </div>

      {loading ? (
        <div className="users-empty">Loading registered users...</div>
      ) : error ? (
        <div className="users-empty error">{error}</div>
      ) : filteredUsers.length === 0 ? (
        <div className="users-empty">No users found.</div>
      ) : (
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
