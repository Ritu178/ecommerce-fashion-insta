// import { useEffect, useState } from "react";

// export default function Products() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/products")
//       .then(res => res.json())
//       .then(setData);
//   }, []);

//   const deleteItem = (id) => {
//     fetch(`http://localhost:5000/products/${id}`, {
//       method: "DELETE"
//     }).then(() => setData(data.filter(p => p.id !== id)));
//   };

//   return (
//     <div className="container mt-4">
//       <h4>Products</h4>

//       <table className="table">
//         <tbody>
//           {data.map(p => (
//             <tr key={p.id}>
//               <td>{p.title}</td>
//               <td>{p.price}</td>
//               <td>
//                 <button onClick={() => deleteItem(p.id)} className="btn btn-danger btn-sm">
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