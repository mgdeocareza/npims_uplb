import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const articleImages = {
  Computer: "https://via.placeholder.com/100?text=Computer",
  Printer: "https://via.placeholder.com/100?text=Printer",
  Table: "https://via.placeholder.com/100?text=Table",
  Chair: "https://via.placeholder.com/100?text=Chair",
  Cabinet: "https://via.placeholder.com/100?text=Cabinet",
  Aircon: "https://via.placeholder.com/100?text=Aircon",
};

export default function Dashboard() {
  const [articleCounts, setArticleCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/properties/")
      .then((response) => {
        const grouped = {};
        response.data.forEach((prop) => {
          const article = prop.article || "Unknown";
          if (!grouped[article]) {
            grouped[article] = { count: 0 };
          }
          grouped[article].count += 1;
        });
        setArticleCounts(grouped);
      })
      .catch((err) => console.error("Error fetching properties:", err));
  }, []);

  const handleCardClick = (article) => {
    navigate(`/app/filter-by-article/${encodeURIComponent(article)}`);
  };

  return (
    <div>
      <h3>Filter Properties by Article</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "20px" }}>
        {Object.keys(articleCounts).map((article) => (
          <div
            key={article}
            onClick={() => handleCardClick(article)}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "20px",
              width: "180px",
              cursor: "pointer",
              textAlign: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
            }}
          >
            <img
              src={articleImages[article] || "https://via.placeholder.com/100"}
              alt={article}
              style={{ width: "100px", height: "100px" }}
            />
            <h4>{article}</h4>
            <p>{articleCounts[article].count} item(s)</p>
          </div>
        ))}
      </div>
    </div>
  );
}
