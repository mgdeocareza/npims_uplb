import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import {
  FaTh,
  FaClipboardList,
  FaLayerGroup,
  FaFileContract,
  FaUserTie,
  FaLaptopHouse,
  FaPlus,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar({ collapsed, onLogout }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const role = localStorage.getItem("userRole");
  const username = localStorage.getItem("username");

  // Store icon components (not JSX elements)
  const allMenuItems = [
    { to: "/app/dashboard", label: "Dashboard", icon: FaTh },
    { to: "/app", label: "View All Properties", icon: FaClipboardList },
    { to: "/app/filter-by-material", label: "View By Material Type", icon: FaLayerGroup },
    { to: "/app/filter-by-acquisition", label: "View By Acquisition Type", icon: FaFileContract },
    { to: "/app/filter-by-staff", label: "View By Staff In Charge", icon: FaUserTie },
    { to: "/app/filter-by-location", label: "View By Location", icon: FaLaptopHouse },
    { to: "/app/create", label: "Add Property", icon: FaPlus },
    { to: "/app/user", label: "Add Staff", icon: FaUserPlus },
  ];

  const menuItems = role === "admin" ? allMenuItems : allMenuItems.slice(0, 4);

  const linkStyle = {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    color: "#222",
    textDecoration: "none",
    fontSize: "0.95rem",
    gap: "10px",
    borderRadius: "4px",
    transition: "background 0.2s",
  };

  const linkHoverStyle = {
    backgroundColor: "#f2dede",
    color: "#7b1113",
  };

  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  return (
    <div
      style={{
        width: collapsed ? "80px" : "250px",
        backgroundColor: "#f5f5f5",
        color: "#222",
        height: "100vh",
        position: "fixed",  // <-- make it fixed
        top: 0,
        left: 0,
        overflowY: "auto",  // allow scrolling inside sidebar if content overflows
        transition: "width 0.3s",
        zIndex: 999,
      }}
    >
      {/* Top spacing to align with navbar */}
      <div
        style={{
          height: "72px",
          padding: collapsed ? 0 : "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          fontSize: "0.9rem",
          borderBottom: "1px solid #ddd",
        }}
      >
        {!collapsed && (
          <span>
            {role === "admin"
              ? "Logged in as Admin"
              : `Logged in as ${username}`}
          </span>
        )}
      </div>

      <nav>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <li
                key={item.to}
                style={{
                  marginTop: index === 0 ? "12px" : "0px", // Only apply top margin to the first item
                }}
              >
                <Link
                  to={item.to}
                  style={{
                    ...linkStyle,
                    ...(hoveredIndex === index ? linkHoverStyle : {}),
                    ...(currentPath === item.to ? { backgroundColor: "#d4bebe", color: "#7b1113" } : {}),
                    justifyContent: collapsed ? "center" : "flex-start",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <IconComponent
                    size={collapsed ? 22 : 20}
                    style={{ margin: "5 0px" }}
                  />
                  {!collapsed && <span style={{ paddingLeft: "5px"}}>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout button */}
      <div style={{ position: "absolute", bottom: "20px", width: "100%" }}>
        <button
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: "10px 20px",
            width: "100%",
            background: "transparent",
            color: "#222",
            border: "none",
            cursor: "pointer",
            fontSize: "0.95rem",
            gap: "10px",
            borderRadius: "4px",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f2dede")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <FaSignOutAlt size={collapsed ? 24 : 20} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}
