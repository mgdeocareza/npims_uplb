import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import PropertiesList from "./properties-list.component";

export default function FilteredByArticle() {
  const { article } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 1180, margin: "20px auto" }}>
      {/* Back button aligned flush left */}
      <button
        onClick={() => navigate('/app/dashboard')}
        style={{
          marginBottom: "20px",
          padding: "6px 12px",
          fontSize: ".8rem",
          cursor: "pointer",
          borderRadius: "6px",
          border: "1px solid #7b1113",
          color: "#7b1113",
        }}
      >
        &larr; Back to Dashboard
      </button>

      <div
        style={{
          backgroundColor: "#f2dede",
          color: "#7b1113",
          padding: "10px 20px",
          borderRadius: "8px",
          fontSize: "1.4rem",
          fontWeight: "bold",
          letterSpacing: "0.5px",
          textAlign: "left",
        }}
      >
        {article}
      </div>

      <PropertiesList article={article} />
    </div>
  );
}
