import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import computerWindowsImg from "../images/a. Computer - Windows.jpg";

const articleImages = {
  "Computer - Windows": computerWindowsImg,
  "Computer - Mac": computerWindowsImg,
  "Laptop": computerWindowsImg,
  "Tablet": computerWindowsImg,
  "Projector": computerWindowsImg,
  "Printer": computerWindowsImg,
  "Barcode Scanner": computerWindowsImg,
  "Book Scanner": computerWindowsImg,
  "UPS": computerWindowsImg,
  "Aircon": computerWindowsImg,
  "TV": computerWindowsImg,
  "Flashdrive": computerWindowsImg,
  "Camera": computerWindowsImg,
  "Others - Electronic": computerWindowsImg,
  "Conference Table": computerWindowsImg,
  "Center Table": computerWindowsImg,
  "Computer Table": computerWindowsImg,
  "Chair": computerWindowsImg,
  "Stool Chair": computerWindowsImg,
  "Cabinet": computerWindowsImg,
  "Card Catalog": computerWindowsImg,
  "Others - Non Electronic": computerWindowsImg,
  "Others": computerWindowsImg,
};

const electronicArticles = [
  "Computer - Windows",
  "Computer - Mac",
  "Laptop",
  "Tablet",
  "Projector",
  "Printer",
  "Barcode Scanner",
  "Book Scanner",
  "UPS",
  "Aircon",
  "TV",
  "Flashdrive",
  "Camera",
  "Others - Electronic",
];

const nonElectronicArticles = [
  "Conference Table",
  "Center Table",
  "Computer Table",
  "Chair",
  "Stool Chair",
  "Cabinet",
  "Card Catalog",
  "Others - Non Electronic",
  "Others",
];

export default function Dashboard() {
  const [articleCounts, setArticleCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/properties/")
      .then((response) => {
        const grouped = {};
        response.data.forEach((prop) => {
          const article = prop.article;
          if (article && article !== "Unknown") {
            if (!grouped[article]) {
              grouped[article] = { count: 0 };
            }
            grouped[article].count += 1;
          }
        });
        setArticleCounts(grouped);
      })
      .catch((err) => console.error("Error fetching properties:", err));
  }, []);

  const handleCardClick = (article) => {
    navigate(`/app/filter-by-article/${encodeURIComponent(article)}`);
  };

  const renderSection = (title, articles, color) => {
    const cardWidth = 220; // increased card width
    const gap = 20;
    const cardsPerRow = 5;
    const containerMaxWidth = cardsPerRow * cardWidth + (cardsPerRow - 1) * gap; // 4*220 + 3*20 = 880 + 60 = 940

    return (
      <>
        <div
          style={{
            backgroundColor: color,
            color: "#7b1113",
            padding: "10px 20px",
            borderRadius: "8px",
            margin: "20px auto 10px",
            fontSize: "1.4rem",
            fontWeight: "bold",
            letterSpacing: "0.5px",
            maxWidth: containerMaxWidth,
            textAlign: "left",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: `${gap}px`,
            marginBottom: "20px",
            maxWidth: containerMaxWidth,
            marginLeft: "auto",
            marginRight: "auto",
            justifyContent: "flex-start",
          }}
        >
          {articles
            .filter((article) => articleCounts[article])
            .map((article) => (
              <div
                key={article}
                onClick={() => handleCardClick(article)}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "15px",
                  width: `${cardWidth}px`,
                  cursor: "pointer",
                  textAlign: "center",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                }}
              >
                <img
                  src={articleImages[article]}
                  alt={article}
                  style={{ width: "120px", height: "120px" }}
                />
                <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginTop: "20px" }}>{article}</div>
              </div>
            ))}
        </div>
      </>
    );
  };


  return (
    <div>
      {renderSection("Electronic Properties", electronicArticles, "#f2dede")}
      {renderSection("Non-Electronic Properties", nonElectronicArticles, "#f2dede")}
    </div>
  );
}
