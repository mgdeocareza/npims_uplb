import React from 'react';
import { useParams } from "react-router-dom";
import PropertiesList from "./properties-list.component";

export default function FilteredByArticle() {
  const { article } = useParams();

  return (
    <div>
      <h3>{article}</h3>
      
      {/* Reuse PropertiesList with filter prop */}
      <PropertiesList article={article} />
    </div>
  );
}
