// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./setupAxios";

import Navbar from "./components/navbar.component";
import Sidebar from "./components/sidebar.component";
import Dashboard from "./components/dashboard.component";
import PropertiesFilteredByArticle from "./components/filter-by-article.component";
import PropertiesList from "./components/properties-list.component";
import PropertiesFilteredByMaterial from "./components/filter-by-material.component";
import PropertiesFilteredByAcquisition from "./components/filter-by-acquisition.component";
import PropertiesFilteredByStaff from "./components/filter-by-staff.component";
import PropertiesFilteredByLocation from "./components/filter-by-location.component";
import EditProperty from "./components/edit-property.component";
import ViewProperty from "./components/view-property.component";
import CreateProperty from "./components/create-property.component";
import CreateUser from "./components/create-user.component";
import Login from "./components/login";

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const role = localStorage.getItem("userRole");
  const isLoggedIn = !!role;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/app/*"
          element={
            isLoggedIn ? (
              <div style={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
                <Sidebar collapsed={sidebarCollapsed} onLogout={handleLogout} />

                <div
                  style={{
                    flexGrow: 1,
                    transition: "margin-left 0.3s",
                    marginLeft: sidebarCollapsed ? "80px" : "250px",
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                  }}
                >
                  {/* Fixed Navbar */}
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: sidebarCollapsed ? "80px" : "250px",
                      right: 0,
                      height: "72px",
                      zIndex: 1000,
                      backgroundColor: "white",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <Navbar toggleSidebar={handleToggleSidebar} />
                  </div>

                  {/* Scrollable main content below Navbar */}
                  <div
                    style={{
                      marginTop: "72px", // height of Navbar to avoid overlap
                      overflowY: "auto",
                      flexGrow: 1,
                      padding: "1rem",
                    }}
                  >
                    <div className="container-fluid mt-4">
                      <Routes>
                        <Route path="/" element={<PropertiesList showAll={true} />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/filter-by-article/:article" element={<PropertiesFilteredByArticle />} />
                        <Route path="/filter-by-material" element={<PropertiesFilteredByMaterial />} />
                        <Route path="/filter-by-acquisition" element={<PropertiesFilteredByAcquisition />} />
                        <Route path="/filter-by-staff" element={<PropertiesFilteredByStaff />} />
                        <Route path="/filter-by-location" element={<PropertiesFilteredByLocation />} />
                        <Route path="edit/:id" element={<EditProperty />} />
                        <Route path="view/:id" element={<ViewProperty />} />
                        <Route path="create" element={<CreateProperty />} />
                        <Route path="user" element={<CreateUser />} />
                      </Routes>
                    </div>
                  </div>
                </div>


              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
