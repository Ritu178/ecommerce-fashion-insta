import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchResults.css";

const Search = ({ products }) => {
  const query = new URLSearchParams(useLocation().search).get("query") || "";
  const navigate = useNavigate();
  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase();

    return safeProducts.filter((item) => {
      const haystack = [item?.name, item?.title, item?.brand, item?.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [query, safeProducts]);

  const resolveImage = (item) => {
    const image = item?.image || "";
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000/uploads/${image}`;
  };

  return (
    <div className="search-page">
      <div className="search-shell">
        <div className="search-hero">
          <span className="search-eyebrow">Search Results</span>
          <h2>{query ? `Results for \"${query}\"` : "Search products"}</h2>
          <p>
            Browse products by title, brand, or category.
          </p>
        </div>

        {!query.trim() ? (
          <div className="search-empty-card">
            <strong>Start typing in the search bar.</strong>
            <p>Search by product title, brand, or category.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="search-empty-card">
            <strong>No products found</strong>
            <p>Try a different keyword or browse the catalog.</p>
            <button type="button" onClick={() => navigate("/products")}>Browse Women</button>
          </div>
        ) : (
          <div className="search-grid">
            {filteredProducts.map((item) => (
              <article key={item.id || item._id} className="search-card">
                <div className="search-image-wrap">
                  {resolveImage(item) ? (
                    <img src={resolveImage(item)} alt={item.title || item.name || "Product"} />
                  ) : (
                    <div className="search-image-placeholder">{(item.title || item.name || "P")[0]}</div>
                  )}
                </div>

                <div className="search-card-body">
                  <span>{item.brand || "Brand"}</span>
                  <h4>{item.title || item.name}</h4>
                  <p>Rs. {Number(item.price || 0).toFixed(2)}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
