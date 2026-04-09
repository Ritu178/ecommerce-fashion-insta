import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductsPage.css";

import img1 from "../assets/img.6.jpg";
import img2 from "../assets/img.7.jpg";
import img3 from "../assets/img.8.jpg";
import img4 from "../assets/img.9.jpg";
import img5 from "../assets/img.10.jpeg";

const data = [
  { id: 1, title: "Summer Wear", img: img1 },
  { id: 2, title: "Winter Wear", img: img2 },
  { id: 3, title: "Party Wear", img: img3 },
  { id: 4, title: "Casual Wear", img: img4 },
  { id: 5, title: "Ethnic Wear", img: img5 },
];

const ProductsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="products-page">
      <h1 className="title">Products</h1>

      <div className="slider">
        {data.map((item, index) => (
          <div
            key={item.id}
            className={`card animate-${index}`}
            onClick={() => navigate(`/products/${item.id}`)}
          >
            <img src={item.img} alt={item.title} />
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;