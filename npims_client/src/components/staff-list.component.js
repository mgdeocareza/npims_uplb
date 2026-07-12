import React, { Component } from "react";
import axios from "axios";

const COLUMN_LABELS = {
  row_num: "#",
  username: "Name",
  department: "Department",
  property_count: "Property Count",
};

const COLUMNS = ["row_num", "username", "department", "property_count"];

const StaffRow = ({ user, index }) => (
  <tr
    style={{
      backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
    }}
  >
    <td style={{ padding: "10px 14px", borderBottom: "1px solid #eee" }}>
      {index + 1}
    </td>

    <td style={{ padding: "10px 14px", borderBottom: "1px solid #eee" }}>
      {user.username}
    </td>

    <td
      style={{
        padding: "10px 14px",
        borderBottom: "1px solid #eee",
        whiteSpace: "pre-line", // allows newline display
      }}
    >
      {Array.isArray(user.department)
        ? user.department.join("\n") // multiple departments on separate lines
        : user.department}
    </td>

    <td
      style={{
        padding: "10px 14px",
        borderBottom: "1px solid #eee",
        textAlign: "right",
      }}
    >
      {user.property_count ?? 0}
    </td>
  </tr>
);

export default class StaffList extends Component {
  state = {
    users: [],
    searchQuery: "",
    sortConfig: { key: "username", direction: "asc" },
  };

  componentDidMount() {
    axios
      .get("/users")
      .then((res) => this.setState({ users: res.data }))
      .catch(console.error);
  }

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value.toLowerCase() });
  };

  handleSort = (key) => {
    this.setState((prev) => ({
      sortConfig: {
        key,
        direction:
          prev.sortConfig.key === key && prev.sortConfig.direction === "asc"
            ? "desc"
            : "asc",
      },
    }));
  };

  getFilteredAndSortedUsers() {
    const { users, searchQuery, sortConfig } = this.state;

    let filtered = [...users];

    if (searchQuery) {
      filtered = filtered.filter((u) =>
        COLUMNS.some((col) => {
          const value =
            col === "row_num"
              ? (users.indexOf(u) + 1).toString()
              : u[col];
          return (value ?? "").toString().toLowerCase().includes(searchQuery);
        })
      );
    }

    const { key, direction } = sortConfig;
    filtered.sort((a, b) => {
      let valA = key === "row_num" ? users.indexOf(a) : a[key] ?? "";
      let valB = key === "row_num" ? users.indexOf(b) : b[key] ?? "";

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }

  render() {
    const { searchQuery, sortConfig } = this.state;
    const users = this.getFilteredAndSortedUsers();

    return (
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 10px" }}>
        {/* Header */}
        <div
          style={{
            backgroundColor: "#f2dede",
            color: "#7b1113",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "1.4rem",
            fontWeight: "bold",
            marginBottom: "12px",
          }}
        >
          Staff List
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search staff..."
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

        {/* Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "8px",
            tableLayout: "fixed",
          }}
        >
          {/* COLUMN WIDTH CONTROL */}
          <colgroup>
            <col style={{ width: "6%" }} />   {/* # */}
            <col style={{ width: "25%" }} />  {/* Name */}
            <col style={{ width: "55%" }} />  {/* Department */}
            <col style={{ width: "12%" }} />  {/* Property Count */}
          </colgroup>

          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  onClick={() => this.handleSort(col)}
                  style={{
                    cursor: "pointer",
                    // textAlign: col === "property_count" ? "right" : "left",
                    padding: "12px 14px",
                    borderBottom: "2px solid #ddd",
                    backgroundColor: "#fafafa",
                    whiteSpace: "nowrap",
                  }}
                >
                  {COLUMN_LABELS[col]}
                  {sortConfig.key === col &&
                    (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {users.map((user, idx) => (
              <StaffRow key={user._id} user={user} index={idx} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
