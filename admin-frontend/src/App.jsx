// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// // PAGES
// import AdminLogin from "./pages/AdminLogin";
// import AdminProducts from "./pages/AdminProducts";
// import EditProduct from "./admin/EditProduct";
// import AddProduct from "./pages/AddProduct";
// // import Orders from "./admin/Orders";

// // ADMIN
// import Dashboard from "./admin/Dashboard";
// import Users from "./admin/Users";
// import AdminOrders from "./admin/Orders";
// import Sidebar from "./components/Sidebar";

// //  PROTECTED ROUTE
// function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("adminToken");

//   if (!token) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }


// //  ADMIN LAYOUT


// function AdminLayout({ children }) {
//   return (
//     <div style={{ display: "flex" }}>
      
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Page Content */}
//       <div style={{ flex: 1, padding: "20px" }}>
//         {children}
//       </div>

//     </div>
//   );
// }
// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/*  LOGIN */}
//         <Route path="/" element={<AdminLogin />} />

//         {/*  ADMIN DASHBOARD */}
//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute>
//               <AdminLayout>
//                 <Dashboard />
//               </AdminLayout>
//             </ProtectedRoute>
//           }
//         />

//         {/*  PRODUCTS */}
//         <Route
//           path="/products"
//           element={
//             <ProtectedRoute>
//               <AdminLayout>
//                 <AdminProducts />
//               </AdminLayout>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/add-product"
//           element={
//             <ProtectedRoute>
//               <AdminLayout>
//                 <AddProduct />
//               </AdminLayout>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/edit/:id"
//           element={
//             <ProtectedRoute>
//               <AdminLayout>
//                 <EditProduct />
//               </AdminLayout>
//             </ProtectedRoute>
//           }
//         />

//         {/*  USERS */}
//         <Route
//           path="/users"
//           element={
//             <ProtectedRoute>
//               <AdminLayout>
//                 <Users />
//               </AdminLayout>
//             </ProtectedRoute>
//           }
//         />

      
//         <Route
//           path="/admin/orders"
//           element={
//             <ProtectedRoute>
//               <AdminLayout>
//                 <AdminOrders />
//               </AdminLayout>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//   path="/admin/orders"
//   element={
//     <ProtectedRoute>
//       <AdminLayout>
//         <AdminOrders /> 
//       </AdminLayout>
//     </ProtectedRoute>
//   }
// />

//         {/*  ORDERS (USER) */}
//         <Route
//           path="/my-orders"
//           element={
//             <ProtectedRoute>
//               <AdminLayout>
//                 <Orders />
//               </AdminLayout>
//             </ProtectedRoute>
//           }
//         />

//         {/*  FALLBACK */}
//         <Route path="*" element={<Navigate to="/" />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";
// PAGES
import AdminLogin from "./pages/AdminLogin";
import AdminProducts from "./pages/AdminProducts";
import EditProduct from "./admin/EditProduct";
import AddProduct from "./pages/AddProduct";

// ADMIN
import Dashboard from "./admin/Dashboard";
import Users from "./admin/Users";
import AdminOrders from "./admin/Orders"; //  correct
import Orders from "./admin/Orders"; //  for my-orders (same use kar sakti ho)
import Sidebar from "./components/Sidebar";

// PROTECTED ROUTE
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// ADMIN LAYOUT
function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Page Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<AdminLogin />} />

        {/* DASHBOARD */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* PRODUCTS */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-product"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AddProduct />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <EditProduct />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* USERS */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN ORDERS */}
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* MY ORDERS (OPTIONAL SAME PAGE) */}
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Orders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}