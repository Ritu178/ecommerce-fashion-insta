// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./AdminProducts.css";
// export default function AdminProducts() {
//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("");

//   const navigate = useNavigate();
//   const token = localStorage.getItem("adminToken");

//   // 🔥 FETCH PRODUCTS
//   const fetchProducts = async () => {
//     const res = await fetch("http://localhost:5000/admin/products");
//     const data = await res.json();
//     setProducts(data);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // 🔥 DELETE
//   const deleteProduct = async (id) => {
//     await fetch(`http://localhost:5000/admin/delete-product/${id}`, {
//       method: "DELETE",
//       headers: { Authorization: token }
//     });

//     alert("Deleted ✅");
//     fetchProducts();
//   };

//   // 🔥 FILTER LOGIC
//   const filteredProducts = products.filter((p) => {
//     return (
//       p.title.toLowerCase().includes(search.toLowerCase()) &&
//       (category === "" || p.category === category)
//     );
//   });

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-4">All Products</h2>

//       {/* 🔍 SEARCH + FILTER */}
//       <div className="row mb-3">
//         <div className="col-md-6">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search product..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <div className="col-md-4">
//           <select
//             className="form-select"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             <option value="">All Categories</option>
//             <option value="women">Women</option>
//             <option value="men">Men</option>
//             <option value="children">Children</option>
//           </select>
//         </div>

//         <div className="col-md-2">
//           <button
//             className="btn btn-success w-100"
//             onClick={() => navigate("/add-product")}
//           >
//             + Add
//           </button>
//         </div>
//       </div>

//       {/* 📊 TABLE */}
//       <table className="table table-hover shadow">
//         <thead className="table-dark">
//           <tr>
//             <th>Image</th>
//             <th>Title</th>
//             <th>Price</th>
//             <th>Category</th>
//             <th style={{ width: "180px" }}>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredProducts.map((p) => (
//             <tr key={p.id}>
              
//               <td>
//                 <img
//                   src={`http://localhost:5000/uploads/${p.image}`}
//                   alt=""
//                   width="60"
//                   height="60"
//                   style={{ objectFit: "cover", borderRadius: "8px" }}
//                 />
//               </td>

//               <td>{p.title}</td>
//               <td>₹{p.price}</td>
//               <td>
//                 <span className="badge bg-info text-dark">
//                   {p.category}
//                 </span>
//               </td>

//               <td>
//                 <button
//                   className="btn btn-warning btn-sm"
//                   onClick={() => navigate(`/edit/${p.id}`)}
//                 >
//                   Edit
//                 </button>

//                 <button
//                   className="btn btn-danger btn-sm ms-2"
//                   onClick={() => deleteProduct(p.id)}
//                 >
//                   Delete
//                 </button>
//               </td>

//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function AdminProducts() {
//   const [products, setProducts] = useState([]);
//   const navigate = useNavigate();

//   const token = localStorage.getItem("adminToken");

//   const fetchProducts = () => {
//     fetch("http://localhost:5000/products")
//       .then(res => res.json())
//       .then(data => setProducts(data));
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const deleteProduct = async (id) => {
//   await fetch(`http://localhost:5000/admin/delete-product/${id}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${token}`,  // correct
//     },
//   });

//   alert("Deleted ");
//   fetchProducts();
// };
//   return (
//     <div className="container mt-4">
//       <h3>Admin Products</h3>

//       <button
//         className="btn btn-success mb-3"
//         onClick={() => navigate("/add-product")}
//       >
//         + Add Product
//       </button>

//       <div className="row">
//         {products.map(p => (
//           <div key={p.id} className="col-md-3 mb-3">
//             <div className="card p-2">

//               <img
//                 src={`http://localhost:5000/uploads/${p.image}`}
//                 alt={p.title}
//                 className="img-fluid"
//               />

//               <h6>{p.title}</h6>
//               <p>₹{p.price}</p>

//               <button
//                 className="btn btn-primary mb-1"
//                 onClick={() => navigate(`/edit/${p.id}`)}
//               >
//                 Edit
//               </button>

//               <button
//                 className="btn btn-danger"
//                 onClick={() => deleteProduct(p.id)}
//               >
//                 Delete
//               </button>

//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./AdminProducts.css";
import { buildApiUrl, buildAssetUrl } from "../config/api";
import adminApi from "../config/axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = () => {
    adminApi.get(buildApiUrl("/products"))
      .then((res) => setProducts(res.data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Delete?",
      text: "This product will be removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    await adminApi.delete(buildApiUrl(`/admin/delete-product/${id}`));

    Swal.fire("Deleted!", "", "success");

    fetchProducts();
  };

  return (
    <div className="admin-layout">

     

      {/*MAIN */}
      <div className="main">

        {/* TOP BAR */}
        <div className="topbar">
          <h2>Admin Panel</h2>

          <button onClick={() => navigate("/add-product")}>
            + Add Product
          </button>
        </div>


        {/* GRID */}
        <div className="product-grid">

          {products.map(p => (
            <div key={p.id} className="product-card">

              <img
                src={buildAssetUrl(`/uploads/${p.image}`)}
                alt={p.title}
              />

              <h4>{p.title}</h4>
              <p className="price">₹{p.price}</p>

              <div className="actions">
                <button onClick={() => navigate(`/edit/${p.id}`)}>
                  Edit
                </button>

                <button onClick={() => deleteProduct(p.id)}>
                  Delete
                </button>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
