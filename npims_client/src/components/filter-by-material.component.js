import React, { useState } from 'react';
import PropertiesList from "./properties-list.component";

export default function FilterByMaterial() {
  const [selectedType, setSelectedType] = useState('Electronic');

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  return (
    <div>
      <h3>Filter Properties by Material Type</h3>

      {/* Radio filter UI */}
      <div style={{ marginBottom: '20px' }}>
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
