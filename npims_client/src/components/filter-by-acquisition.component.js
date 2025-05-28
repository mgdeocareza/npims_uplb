import React, { useState } from 'react';
import PropertiesList from "./properties-list.component";

export default function FilterByAcquisition() {
  const [selectedType, setSelectedType] = useState('PAR');

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  return (
    <div>
      <h3>Filter Properties by Acquisition Type</h3>

      {/* Radio filter UI */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="radio"
            name="acquisitionType"
            value="PAR"
            checked={selectedType === 'PAR'}
            onChange={handleTypeChange}
          />
          Acquired via PAR
        </label>{" "}
        <label>
          <input
            type="radio"
            name="acquisitionType"
            value="ICS"
            checked={selectedType === 'ICS'}
            onChange={handleTypeChange}
          />
          Acquired via ICS
        </label>
      </div>

      {/* Reuse PropertiesList with filter prop */}
      <PropertiesList acquisitionType={selectedType} />
    </div>
  );
}
