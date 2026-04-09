
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

const Search = ({ products }) => {
  const query = new URLSearchParams(useLocation().search).get("query");

  // 🔥 useMemo for optimization
  const filteredProducts = useMemo(() => {
    if (!query) return [];

    return products.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, products]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search Results for "{query}"</h2>

      {filteredProducts.length === 0 ? (
        <h3 style={{ color: "red" }}>Product not found</h3>
      ) : (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {filteredProducts.map((item) => (
            <div key={item._id} style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "8px"
            }}>
              <img src={item.image} alt="" width="150" />
              <h4>{item.name}</h4>
              <p>₹{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;