import React from "react";
import { Link } from "react-router-dom";
import npims_logo from '../images/npims-logo.png'; 

export default function Sidebar({ collapsed }) {
  const role = localStorage.getItem("userRole");

  const allMenuItems = [
    { to: "/app/dashboard", label: "Dashboard" },
    { to: "/app", label: "View All Properties" },    
    { to: "/app/filter-by-material", label: "View by Material Type" },
    { to: "/app/filter-by-acquisition", label: "View by Acquisition Type" },
    { to: "/app/filter-by-staff", label: "View by Staff In Charge" },
    { to: "/app/filter-by-location", label: "View by Assigned Location" },
    { to: "/app/create", label: "Add New Property" },
    { to: "/app/user", label: "Add New Staff" },
  ];

  const menuItems = role === "admin" ? allMenuItems : allMenuItems.slice(0, 4);

  const lineColor = "#444c52";

  return (
    <div
      style={{
        width: collapsed ? "80px" : "250px",
        backgroundColor: "#222d35",
        color: "white",
        height: "100vh",
        transition: "width 0.3s",
        overflowX: "hidden",
        paddingTop: "20px",
        boxSizing: "border-box",    // <-- ADD THIS
      }}
    >
    <div style={{ textAlign: "center", marginBottom: "15px", height: "20px" }}>
      <img
        src={npims_logo}
        alt="NPIMS Logo"
        style={{
          height: "30px",
          width: "auto",
          margin: "0 auto",
          display: "block",
          filter: collapsed ? "brightness(0) invert(1)" : "none",
        }}
      />
    </div>

    {/* Full width line with exact thickness and color */}
    <div
      style={{
        height: "1px",
        width: "100%",
        backgroundColor: lineColor,
        margin: 0,
      }}
    />


      <nav>
        <ul
          style={{
            listStyleType: "none",
            paddingLeft: 0,
            margin: 0,
            fontSize: collapsed ? "0" : "1rem",
            transition: "font-size 0.3s",
          }}
        >
          {menuItems.map((item) => (
            <li
              key={item.to}
              style={{
                padding: `10px 20px`,
                borderBottom: `1px solid ${lineColor}`, // line for all items including last
                boxSizing: "border-box",    // <-- ADD THIS here too (optional)
              }}
            >
              <Link
                to={item.to}
                style={{ color: "white", textDecoration: "none" }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
