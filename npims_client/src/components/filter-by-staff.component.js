import React, { useState, useEffect } from 'react';
import PropertiesList from "./properties-list.component";
import axios from 'axios';

export default function FilterByStaffInCharge() {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    axios.get('/properties/')
      .then((response) => {
        const allStaff = response.data.map(p => p.endUser);
        const uniqueStaff = [...new Set(allStaff.filter(Boolean))]; // Remove duplicates and empty
        console.log("Unique Staff List:", uniqueStaff);
        setStaffList(uniqueStaff);

        // Set the first staff as selected if exists
        if (uniqueStaff.length > 0) {
          setSelectedStaff(uniqueStaff[0]);
        }        

      })
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    setSelectedStaff(e.target.value);
  };

  return (
    <div>
      <h3>Filter Properties by Staff In Charge</h3>

      <div style={{ marginBottom: '20px' }}>
        <select value={selectedStaff} onChange={handleChange}>
          {staffList.map((staff, index) => (
            <option key={index} value={staff}>{staff}</option>
          ))}
        </select>
      </div>

      <PropertiesList endUser={selectedStaff} />
    </div>
  );
}
