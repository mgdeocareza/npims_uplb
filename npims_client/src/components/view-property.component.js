import React, { Component } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
      endUser: "",
      location: "",
      status: "",
      historyLog: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    axios
      .get("/properties/" + this.props.params.id)
      .then((response) => {
        this.setState({
          ...response.data,
          dateAcquired: new Date(response.data.dateAcquired),
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ error: "Failed to load property", loading: false });
        console.error(error);
      });
  }

  render() {
    if (this.state.loading) {
      return <div>Loading property data...</div>;
    }
    if (this.state.error) {
      return <div>{this.state.error}</div>;
    }

    const {
      propertyNumber,
      propertyType,
      description,
      acquisitionType,
      dateAcquired,
      unitPrice,
      endUser,
      location,
      status,
      historyLog,
    } = this.state;

    return (
      <div>
        <h3>View Property</h3>

        <div><strong>Property Number:</strong> {propertyNumber}</div>
        <div><strong>Property Type:</strong> {propertyType}</div>
        <div><strong>Description:</strong> {description}</div>
        <div><strong>Acquisition Type:</strong> {acquisitionType}</div>
        <div><strong>Date Acquired:</strong> {dateAcquired.toLocaleDateString()}</div>
        <div><strong>Unit Price:</strong> {unitPrice}</div>
        <div><strong>End User:</strong> {endUser}</div>
        <div><strong>Location:</strong> {location}</div>
        <div><strong>Status:</strong> {status}</div>

        <hr />

        <h4>History Log</h4>
        <ul>
          {historyLog.length === 0 ? (
            <li>No history entries available.</li>
          ) : (
            historyLog.map((entry, index) => (
              <li key={index}>
                <strong>Date Assigned:</strong> {new Date(entry.dateAssigned).toLocaleDateString()}<br />
                <strong>Location:</strong> {entry.location}<br />
                <strong>Staff In Charge:</strong> {entry.staffInCharge}
              </li>
            ))
          )}
        </ul>
      </div>
    );
  }
}

export default withRouter(ViewProperty);
