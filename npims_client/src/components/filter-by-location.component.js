import React, { useState, useEffect } from 'react';
import PropertiesList from "./properties-list.component";
import axios from 'axios';

export default function FilterByLocation() {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationList, setLocationList] = useState([]);

  useEffect(() => {
    axios.get('/properties/')
      .then((response) => {
        const allLocations = response.data.map(p => p.location);
        const uniqueLocations = [...new Set(allLocations.filter(Boolean))]; // Remove duplicates and empty
        console.log("Unique Location List:", uniqueLocations);
        setLocationList(uniqueLocations);

        // Set the first location as selected if exists
        if (uniqueLocations.length > 0) {
          setSelectedLocation(uniqueLocations[0]);
        }

      })
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  return (
    <div>
      <h3>Filter Properties by Location</h3>

      <div style={{ marginBottom: '20px' }}>
        <select value={selectedLocation} onChange={handleChange}>
          {locationList.map((location, index) => (
            <option key={index} value={location}>{location}</option>
          ))}
        </select>
      </div>

      <PropertiesList location={selectedLocation} />
    </div>
  );
}
