import { useEffect, useMemo, useState } from "react";
import "./Orders.css";
import Swal from "sweetalert2";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders");
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
      await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      loadOrders();
    } catch (err) {
      console.log(err);
    }
  };
useEffect(() => {
  console.log("SELECTED:", selectedOrder);
}, [selectedOrder]);
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
      await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "DELETE",
      });

      Swal.fire("Deleted!", "Order deleted successfully.", "success");
      loadOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const revenue = orders.reduce(
      (sum, order) => sum + Number(order.total_price || 0),
      0
    );

    return { total, pending, delivered, revenue };
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.email?.toLowerCase().includes(search.toLowerCase()) ||
      order.phone?.includes(search);

    const matchesFilter =
      filter === "All" || order.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page">
      <h1>Orders Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* STATS */}
          <div className="cards">
            <div className="card total">
              <h3>Total</h3>
              <strong>{stats.total}</strong>
            </div>

            <div className="card pending">
              <h3>Pending</h3>
              <strong>{stats.pending}</strong>
            </div>

            <div className="card delivered">
              <h3>Delivered</h3>
              <strong>{stats.delivered}</strong>
            </div>

            <div className="card revenue">
              <h3>Revenue</h3>
              <strong>₹{stats.revenue}</strong>
            </div>
          </div>

          {/* SEARCH + FILTER */}
          <div className="filters">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* TABLE */}
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
                    <td>₹{order.total_price}</td>

                    <td>
                      <span className={`badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>

                    <td>
                      {/* <button onClick={() => setSelectedOrder(order)}>
                        View
                      </button>{" "} */}
                      <button onClick={() => {
  console.log("ORDER:", order); 
  setSelectedOrder(order);
}}>
  View
</button>
                      <button onClick={() => deleteOrder(order.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MODAL */}
          {/* {selectedOrder && (
            <div className="modal">
              <div className="modal-content">
                <h2>Order #{selectedOrder.id}</h2>

                <p><b>Name:</b> {selectedOrder.name}</p>
                <p><b>Email:</b> {selectedOrder.email}</p>
                <p><b>Phone:</b> {selectedOrder.phone}</p>
                <p><b>Address:</b> {selectedOrder.address}</p>
                <p><b>Total:</b> ₹{selectedOrder.total_price}</p>
                <p><b>Status:</b> {selectedOrder.status}</p>

                <button onClick={() => setSelectedOrder(null)}>
                  Close
                </button>
              </div>
            </div>
          )} */}
          {/* MODAL */}
{selectedOrder && (
  <div className="modal">
    <div className="modal-content">

      <h2>Order #{selectedOrder.id}</h2>

      <p><b>Name:</b> {selectedOrder.name}</p>
      <p><b>Email:</b> {selectedOrder.email}</p>
      <p><b>Phone:</b> {selectedOrder.phone}</p>
      <p><b>Address:</b> {selectedOrder.address}</p>
      <p><b>Total:</b> ₹{selectedOrder.total_price}</p>
      <p><b>Status:</b> {selectedOrder.status}</p>

      <hr />

      <h3>Products</h3>

      {/* PRODUCTS WITH IMAGE */}
      {Array.isArray(selectedOrder.products) &&
        selectedOrder.products.map((p, i) => (
          <div key={i} className="productItem">
            <img
              src={
                p.image
                  ? p.image.startsWith("http")
                    ? p.image
                    : `http://localhost:5000/${p.image}`
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

      <button onClick={() => setSelectedOrder(null)}>
        Close
      </button>

    </div>
  </div>
)}
        </>
      )}
    </div>
  );
}