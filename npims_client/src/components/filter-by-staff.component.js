import React, { useState, useEffect } from 'react';
import PropertiesList from "./properties-list.component";
import axios from 'axios';

export default function FilterByStaffInCharge() {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    axios.get('/users/')
      .then(res => {
        const map = {};
        res.data.forEach(u => {
          map[u._id] = u.username; 
        });
        setUserMap(map);
      })
      .catch(console.error);

    axios.get('/properties/')
      .then((response) => {
        console.log("response.data!!!")
        console.log(response.data);
        const allStaff = response.data.flatMap(p => p.staffInCharge || []);
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
          {staffList.map((staffId) => (
            <option key={staffId} value={staffId}>
              {userMap[staffId] || staffId} 
            </option>
          ))}
        </select>
      </div>

      <PropertiesList staffInCharge={selectedStaff} />
    </div>
  );
}
