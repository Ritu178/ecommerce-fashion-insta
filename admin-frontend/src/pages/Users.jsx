// import { useEffect, useState } from "react";

// export default function Users() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/users")
//       .then(res => res.json())
//       .then(setData);
//   }, []);

//   return (
//     <div className="container mt-4">
//       <h4>Users</h4>
//       {data.map(u => <div key={u.id}>{u.email}</div>)}
//     </div>
//   );
// }