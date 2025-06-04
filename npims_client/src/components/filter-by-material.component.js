import React, { useState } from 'react';
import PropertiesList from "./properties-list.component";

export default function FilterByMaterial() {
  const [selectedType, setSelectedType] = useState('Electronic');

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  return (
    <div>
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
        Filter Properties by Material Type
      </div>

      {/* Radio filter UI */}
      <div style={{ margin:'20px' }}>
        <label>
          <input
            type="radio"
            name="materialType"
            value="Electronic"
            checked={selectedType === 'Electronic'}
            onChange={handleTypeChange}
          />
          Electronic
        </label>{" "}
        <label>
          <input
            type="radio"
            name="materialType"
            value="Non-electronic"
            checked={selectedType === 'Non-electronic'}
            onChange={handleTypeChange}
          />
          Non-electronic
        </label>
      </div>

      {/* Reuse PropertiesList with filter prop */}
      <PropertiesList materialType={selectedType} />
    </div>
  );
}
