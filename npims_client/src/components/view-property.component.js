import React, { Component } from "react";
import axios from "axios";
import withRouter from "./withRouter";

class ViewProperty extends Component {
  constructor(props) {
    super(props);

    this.state = {
      propertyNumber: "",
      propertyType: "",
      description: "",
      acquisitionType: "",
      dateAcquired: new Date(),
      unitPrice: 0,
      location: "",
      status: "",
      historyLog: [],
      users: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    const propertyId = this.props.params.id;

    // Fetch property and users concurrently
    Promise.all([
      axios.get("/properties/" + propertyId),
      axios.get("/users/"),
    ])
      .then(([propertyRes, usersRes]) => {
        this.setState({
          ...propertyRes.data,
          dateAcquired: new Date(propertyRes.data.dateAcquired),
          users: usersRes.data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ error: "Failed to load data", loading: false });
        console.error(error);
      });
  }

  // Create a userMap { userId: username } from users array
  createUserMap() {
    const { users } = this.state;
    return Object.fromEntries(users.map((user) => [user._id, user.username || user.fullName || user.name]));
  }

  render() {
    const {
      loading,
      error,
      propertyNumber,
      propertyType,
      description,
      acquisitionType,
      dateAcquired,
      unitPrice,
      location,
      status,
      historyLog,
    } = this.state;

    if (loading) return <div>Loading property data...</div>;
    if (error) return <div>{error}</div>;

    const userMap = this.createUserMap();

    return (
      <div
        style={{
          maxWidth: 700,
          margin: "auto",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          padding: 20,
        }}
      >
        <h2 style={{ color: "#7b1113", borderBottom: "2px solid #7b1113", paddingBottom: 8 }}>
          Property Details
        </h2>

        <p><strong>Property Number:</strong> {propertyNumber}</p>
        <p><strong>Property Type:</strong> {propertyType}</p>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Acquisition Type:</strong> {acquisitionType}</p>
        <p><strong>Date Acquired:</strong> {dateAcquired.toLocaleDateString()}</p>
        <p><strong>Unit Price:</strong> Php {unitPrice.toFixed(2)}</p>
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Status:</strong> {status}</p>

        <hr style={{ margin: "30px 0" }} />

        <h3 style={{ color: "#7b1113", marginBottom: 16 }}>History Log</h3>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {historyLog.length === 0 ? (
            <li>No history entries available.</li>
          ) : (
            historyLog.map((entry, idx) => (
              <li
                key={idx}
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: 12,
                  borderRadius: 6,
                  marginBottom: 12,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <p><strong>Date Assigned:</strong> {new Date(entry.dateAssigned).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {entry.location}</p>
                <p>
                  <strong>Staff In Charge:</strong>{" "}
                  {Array.isArray(entry.staffInCharge)
                    ? entry.staffInCharge.map((id) => userMap[id] || id).join(", ")
                    : userMap[entry.staffInCharge] || entry.staffInCharge}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    );
  }
}

export default withRouter(ViewProperty);
