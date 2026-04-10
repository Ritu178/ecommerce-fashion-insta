import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { buildApiUrl, buildAssetUrl } from "../config/api";
import "./Orders.css";

export default function Orders({ pageTitle = "Orders Dashboard", pageSubtitle }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      const res = await fetch(buildApiUrl("/api/orders"));
      if (!res.ok) throw new Error("API Error");

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(buildApiUrl(`/api/orders/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      loadOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteOrder = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This order will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(buildApiUrl(`/api/orders/${id}`), {
        method: "DELETE",
      });

      Swal.fire("Deleted!", "Order deleted successfully.", "success");
      loadOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.email?.toLowerCase().includes(search.toLowerCase()) ||
      order.phone?.includes(search);

    const matchesFilter = filter === "All" || order.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page">
      <h1>{pageTitle}</h1>
      {pageSubtitle && <p className="page-subtitle">{pageSubtitle}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="filters">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.name}</td>
                    <td>{order.email}</td>
                    <td>₹{Number(order.total ?? order.total_price ?? 0)}</td>
                    <td>
                      <span className={`badge ${String(order.status || "").toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => setSelectedOrder(order)}>View</button>{" "}
                      <button onClick={() => deleteOrder(order.id)}>Delete</button>{" "}
                      <select
                        value={order.status || "Pending"}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedOrder && (
            <div className="modal">
              <div className="modal-content">
                <h2>Order #{selectedOrder.id}</h2>

                <p><b>Name:</b> {selectedOrder.name}</p>
                <p><b>Email:</b> {selectedOrder.email}</p>
                <p><b>Phone:</b> {selectedOrder.phone}</p>
                <p><b>Address:</b> {selectedOrder.address}</p>
                <p><b>Total:</b> ₹{Number(selectedOrder.total ?? selectedOrder.total_price ?? 0)}</p>
                <p><b>Status:</b> {selectedOrder.status}</p>

                <hr />

                <h3>Products</h3>

                {Array.isArray(selectedOrder.products) &&
                  selectedOrder.products.map((p, i) => (
                    <div key={i} className="productItem">
                      <img
                        src={
                          p.image
                            ? p.image.startsWith("http")
                              ? p.image
                              : buildAssetUrl(p.image)
                            : "https://via.placeholder.com/50"
                        }
                        alt=""
                      />

                      <div>
                        <p className="pname">{p.name}</p>
                        <p className="pprice">₹{p.price}</p>
                      </div>
                    </div>
                  ))}

                <button onClick={() => setSelectedOrder(null)}>Close</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
