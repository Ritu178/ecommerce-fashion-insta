import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ✅ USER ID (MySQL style)
  const getUserId = () => {
    return Number(localStorage.getItem("userId"));
  };

  // ✅ FETCH CART
  const fetchCart = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/cart/${userId}`
      );

      setCart(res.data || []);
    } catch (err) {
      console.log("Fetch Cart Error:", err);
    }
  };

  // ✅ ADD TO CART
  const addToCart = async (product) => {
    const userId = getUserId();

    if (!userId) {
      alert("Please login first ❌");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/cart/add", {
        userId,
        productId: product.id,
      });

      fetchCart(); // 🔥 IMPORTANT
    } catch (err) {
      console.log("Add Error:", err);
    }
  };

  // ✅ DELETE ITEM
  // const removeItem = async (productId) => {
  //   const userId = getUserId();

  //   try {
  //     await axios.delete("http://localhost:5000/api/cart/delete", {
  //       data: { userId, productId },
  //     });

  //     fetchCart();
  //   } catch (err) {
  //     console.log("Delete Error:", err);
  //   }
  // };

  const removeItem = async (productId) => {
  const userId = getUserId();

  try {
    await axios.delete(
      `http://localhost:5000/api/cart/delete/${userId}/${productId}`
    );

    fetchCart();
  } catch (err) {
    console.log("Delete Error:", err);
  }
};

  // ✅ INCREMENT
  const increment = async (productId) => {
    const userId = getUserId();

    try {
      await axios.put("http://localhost:5000/api/cart/update", {
        userId,
        productId,
        type: "inc",
      });

      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ DECREMENT
  const decrement = async (productId) => {
    const userId = getUserId();

    try {
      await axios.put("http://localhost:5000/api/cart/update", {
        userId,
        productId,
        type: "dec",
      });

      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ SAVE FOR LATER
  const saveItem = async (productId) => {
    const userId = getUserId();

    try {
      await axios.post("http://localhost:5000/api/cart/save", {
        userId,
        productId,
      });

      fetchCart();
    } catch (err) {
      console.log("Save Error:", err);
    }
  };

  // ✅ CHECKOUT
  const checkout = async () => {
    const userId = getUserId();

    try {
      await axios.post("http://localhost:5000/api/cart/checkout", {
        userId,
      });

      alert("Order Placed Successfully 🎉");
      setCart([]);
    } catch (err) {
      console.log("Checkout Error:", err);
    }
  };

  // ✅ LOAD CART
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeItem,
        increment,
        decrement,
        saveItem,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;





// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);

//   const getUserId = () => Number(localStorage.getItem("userId"));

//   const fetchCart = async () => {
//     const userId = getUserId();
//     if (!userId) return;

//     try {
//       const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
//       setCart(res.data || []);
//     } catch (err) {
//       console.log("Fetch Cart Error:", err);
//     }
//   };

//   const addToCart = (product) => {
//   setCart((prev) => {
//     const existing = prev.find(
//       (item) => item.product_id === product.id
//     );

//     if (existing) {
//       return prev.map((item) =>
//         item.product_id === product.id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//     }

//     return [
//       ...prev,
//       {
//         product_id: product.id, // ✅ IMPORTANT
//         quantity: 1,
//         ...product,
//       },
//     ];
//   });
// };

//   const removeItem = async (productId) => {
//     const userId = getUserId();

//     try {
//       await axios.delete(
//         `http://localhost:5000/api/cart/delete/${userId}/${productId}`
//       );
//       fetchCart();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const increment = async (productId) => {
//     const userId = getUserId();

//     await axios.put("http://localhost:5000/api/cart/update", {
//       userId,
//       productId,
//       type: "inc",
//     });

//     fetchCart();
//   };

//   const decrement = async (productId) => {
//     const userId = getUserId();

//     await axios.put("http://localhost:5000/api/cart/update", {
//       userId,
//       productId,
//       type: "dec",
//     });

//     fetchCart();
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeItem,
//         increment,
//         decrement,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;


// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);

//   // ✅ USER ID
//   const getUserId = () => Number(localStorage.getItem("userId"));

//   // ✅ FETCH CART
//   const fetchCart = async () => {
//     const userId = getUserId();
//     if (!userId) return;

//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/cart/${userId}`
//       );

//       console.log("CART DATA 👉", res.data); // DEBUG
//       setCart(res.data || []);
//     } catch (err) {
//       console.log("Fetch Cart Error:", err);
//     }
//   };

//   // ✅ ADD TO CART (🔥 BACKEND CALL FIX)
//   // const addToCart = async (product) => {
//   //   const userId = getUserId();

//   //   if (!userId) {
//   //     alert("Please login first ❌");
//   //     return;
//   //   }

//   //   try {
//   //     await axios.post("http://localhost:5000/api/cart/add", {
//   //       userId,
//   //       productId: product.id || product.product_id, // ✅ FIX
//   //     });

//   //     fetchCart(); // 🔥 IMPORTANT
//   //   } catch (err) {
//   //     console.log("Add Error:", err);
//   //   }
//   // };

//   const addToCart = async (product) => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     alert("Please login first ❌");
//     return;
//   }

//   try {
//     await axios.post(
//       "http://localhost:5000/api/cart/add",
//       {
//         productId: product.id || product.product_id,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`, // ✅ IMPORTANT
//         },
//       }
//     );

//     fetchCart();
//   } catch (err) {
//     console.log("Add Error:", err);
//   }
// };

//   // ✅ DELETE ITEM
//   const removeItem = async (productId) => {
//     const userId = getUserId();

//     try {
//       await axios.delete(
//         `http://localhost:5000/api/cart/delete/${userId}/${productId}`
//       );

//       fetchCart();
//     } catch (err) {
//       console.log("Delete Error:", err);
//     }
//   };

//   // ✅ INCREMENT
//   const increment = async (productId) => {
//     const userId = getUserId();

//     try {
//       await axios.put("http://localhost:5000/api/cart/update", {
//         userId,
//         productId,
//         type: "inc",
//       });

//       fetchCart();
//     } catch (err) {
//       console.log("Increment Error:", err);
//     }
//   };

//   // ✅ DECREMENT
//   const decrement = async (productId) => {
//     const userId = getUserId();

//     try {
//       await axios.put("http://localhost:5000/api/cart/update", {
//         userId,
//         productId,
//         type: "dec",
//       });

//       fetchCart();
//     } catch (err) {
//       console.log("Decrement Error:", err);
//     }
//   };

//   // ✅ LOAD CART
//   useEffect(() => {
//     fetchCart();
//   }, []);

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeItem,
//         increment,
//         decrement,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;