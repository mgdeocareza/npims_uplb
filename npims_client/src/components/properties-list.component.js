import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const COLUMN_LABELS = {
  propertyNumber: "Property No.",
  propertyType: "Material",
  article: "Article",
  description: "Description",
  acquisitionType: "Acquired via",
  dateAcquired: "Date Acquired",
  unitPrice: "Unit Price",
  staffInCharge: "Staff In Charge",
  location: "Location",
  status: "Status",
};

const COLUMN_SETS = {
  viewAllFiltered: [
    "propertyNumber",
    "article",
    "dateAcquired",
    "unitPrice",
    "staffInCharge",
    "location",
    "status",
  ],
  filterByArticle: [
    "propertyNumber",
    "description",
    "dateAcquired",
    "unitPrice",
    "staffInCharge",
    "location",
    "status",
  ],
  filterByAcquisition: [
    "propertyNumber",
    "article",
    "acquisitionType",
    "dateAcquired",
    "unitPrice",
    "staffInCharge",
    "location",
    "status",
  ],
};

const NPIMSPropertyRow = ({ property, role, columns, userMap, deleteProperty, index }) => {
  return (
    <tr style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
      {columns.map((col) => {
        let value = property[col];
        if (col === "dateAcquired") value = value?.substring(0, 10);
        if (col === "staffInCharge") {
          value = Array.isArray(value)
            ? value.map((id) => userMap[id] || id).join(", ")
            : userMap[value] || value;
        }
        return (
          <td key={col} style={{ textAlign: col === "unitPrice" ? "right" : "left", padding: "8px" }}>
            {col === "unitPrice" && typeof value === "number" ? value.toFixed(2) : value}
          </td>
        );
      })}
      <td style={{ padding: "8px" }}>
        <Link to={`/app/view/${property._id}`}>view</Link>
        {role === "admin" && (
          <>
            {" | "}
            <Link to={`/app/edit/${property._id}`}>edit</Link>
            {" | "}
            <button
              style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
              onClick={() => {
                if (window.confirm("Are you sure you want to delete?")) deleteProperty(property._id);
              }}
            >
              delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default class PropertiesList extends Component {
  state = {
    properties: [],
    users: [],
    role: localStorage.getItem("userRole") || "user",
    searchQuery: "",
    sortConfig: { key: "propertyNumber", direction: "asc" },
  };

  loginUsername = localStorage.getItem("loginUsername");

  componentDidMount() {
    axios.get("/properties/").then((res) => this.setState({ properties: res.data })).catch(console.error);
    axios.get("/users/").then((res) => this.setState({ users: res.data })).catch(console.error);
  }

  deleteProperty = (id) => {
    axios.delete("/properties/" + id).then(() => {
      this.setState((prev) => ({
        properties: prev.properties.filter((p) => p._id !== id),
      }));
    });
  };

  handleSearch = (e) => this.setState({ searchQuery: e.target.value.toLowerCase() });

  handleSort = (col) => {
    this.setState((prev) => {
      const direction =
        prev.sortConfig.key === col && prev.sortConfig.direction === "asc" ? "desc" : "asc";
      return { sortConfig: { key: col, direction } };
    });
  };

  getActiveColumns = () => {
    if (this.props.article) return COLUMN_SETS.filterByArticle;
    if (this.props.acquisitionType) return COLUMN_SETS.filterByAcquisition;
    return COLUMN_SETS.viewAllFiltered;
  };

  getFilteredAndSortedProperties = () => {
    const { properties, searchQuery, sortConfig, users, role } = this.state;
    const activeColumns = this.getActiveColumns();
    const userMap = Object.fromEntries(users.map((u) => [u._id, u.username]));

    let filtered = [...properties];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        activeColumns.some((col) => {
          let val = p[col];
          if (col === "staffInCharge") {
            val = Array.isArray(val) ? val.map((id) => userMap[id] || id).join(", ") : userMap[val] || val;
          }
          return (val ?? "").toString().toLowerCase().includes(searchQuery);
        })
      );
    }

    // Apply external filters
    if (this.props.materialType)
      filtered = filtered.filter((p) => p.propertyType === this.props.materialType);
    if (this.props.article)
      filtered = filtered.filter((p) => p.article === this.props.article);
    if (this.props.acquisitionType)
      filtered = filtered.filter((p) => p.acquisitionType === this.props.acquisitionType);
    if (this.props.staffInCharge)
      filtered = filtered.filter((p) =>
        Array.isArray(p.staffInCharge)
          ? p.staffInCharge.includes(this.props.staffInCharge)
          : p.staffInCharge === this.props.staffInCharge
      );
    if (this.props.location)
      filtered = filtered.filter((p) => p.location === this.props.location);

    // Non-admin users only see their properties
    if (role !== "admin" && this.loginUsername) {
      const currentUser = users.find(
        (u) => u.username === this.loginUsername || u.fullName === this.loginUsername
      );
      const userId = currentUser?._id;
      if (userId) {
        filtered = filtered.filter((p) =>
          Array.isArray(p.staffInCharge)
            ? p.staffInCharge.includes(userId)
            : p.staffInCharge === userId
        );
      }
    }

    // Sorting
    const { key, direction } = sortConfig;
    filtered.sort((a, b) => {
      let valA = a[key] ?? "";
      let valB = b[key] ?? "";
      if (key === "staffInCharge") {
        valA = Array.isArray(valA) ? valA.map((id) => userMap[id] || id).join(", ") : userMap[valA] || valA;
        valB = Array.isArray(valB) ? valB.map((id) => userMap[id] || id).join(", ") : userMap[valB] || valB;
      }
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  render() {
    const { users, role, searchQuery, sortConfig } = this.state;
    const activeColumns = this.getActiveColumns();
    const filteredProperties = this.getFilteredAndSortedProperties();
    const userMap = Object.fromEntries(users.map((u) => [u._id, u.username]));

    return (
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 10px", overflowX: "auto" }}>
        {this.props.showAll && (
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
              marginBottom: "10px",
            }}
          >
            All Properties
          </div>
        )}

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={this.handleSearch}
          style={{
            marginBottom: "10px",
            padding: "6px 10px",
            width: "100%",
            maxWidth: "300px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {activeColumns.map((col) => (
                <th
                  key={col}
                  onClick={() => this.handleSort(col)}
                  style={{
                    textAlign: "left",
                    borderBottom: "2px solid #ddd",
                    padding: "8px",
                    cursor: "pointer",
                  }}
                >
                  {COLUMN_LABELS[col] || col}{" "}
                  {sortConfig.key === col ? (sortConfig.direction === "asc" ? " 🔼" : " 🔽") : ""}
                </th>
              ))}
              <th style={{ textAlign: "left", borderBottom: "2px solid #ddd", padding: "8px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((property, idx) => (
              <NPIMSPropertyRow
                key={property._id}
                property={property}
                role={role}
                columns={activeColumns}
                userMap={userMap}
                deleteProperty={this.deleteProperty}
                index={idx}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
