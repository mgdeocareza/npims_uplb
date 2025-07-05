import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Electronic_A from "../images/Electronic/A. Computer Windows.jpg";
import Electronic_B from "../images/Electronic/B. Computer Mac.jpg";
import Electronic_C from "../images/Electronic/C. Laptop.jpg"
import Electronic_D from "../images/Electronic/D. Tablet.jpg"
import Electronic_E from "../images/Electronic/E. Projector.jpg"
import Electronic_F from "../images/Electronic/F. Printer.jpg";
import Electronic_G from "../images/Electronic/G. Barcode Scanner.jpg";
import Electronic_H from "../images/Electronic/H. Book Scanner.jpg";
import Electronic_I from "../images/Electronic/I. UPS.jpg";
import Electronic_J from "../images/Electronic/J. Aircon.jpg";
import Electronic_K from "../images/Electronic/K. TV.jpg";
import Electronic_L from "../images/Electronic/L. Flashdrive.jpg";
import Electronic_M from "../images/Electronic/M. Camera.jpg";
import Electronic_N from "../images/Electronic/N. Others Electronic.jpg";
import Non_Electronic_A from "../images/Non Electronic/A. Conference Table.jpg";
import Non_Electronic_B from "../images/Non Electronic/B. Center Table.webp";
import Non_Electronic_C from "../images/Non Electronic/C. Computer Table.jpg"
import Non_Electronic_D from "../images/Non Electronic/D. Chair.jpg"
import Non_Electronic_E from "../images/Non Electronic/E. Stool Chair.jpg"
import Non_Electronic_F from "../images/Non Electronic/F. Cabinet.jpg";
import Non_Electronic_G from "../images/Non Electronic/G. Card Catalog.jpg";
import Non_Electronic_H from "../images/Non Electronic/H. Others Nonelectronic.jpg";


const articleImages = {
  "Computer - Windows": Electronic_A,
  "Computer - Mac": Electronic_B,
  "Laptop": Electronic_C,
  "Tablet": Electronic_D,
  "Projector": Electronic_E,
  "Printer": Electronic_F,
  "Barcode Scanner": Electronic_G,
  "Book Scanner": Electronic_H,
  "UPS": Electronic_I,
  "Aircon": Electronic_J,
  "TV": Electronic_K,
  "Flashdrive": Electronic_L,
  "Camera": Electronic_M,
  "Others - Electronic": Electronic_N,
  "Conference Table": Non_Electronic_A,
  "Center Table": Non_Electronic_B,
  "Computer Table": Non_Electronic_C,
  "Chair": Non_Electronic_D,
  "Stool Chair": Non_Electronic_E,
  "Cabinet": Non_Electronic_F,
  "Card Catalog": Non_Electronic_G,
  "Others - Non Electronic": Non_Electronic_H,
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
