import React, { Component } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import withRouter from "./withRouter";

class EditProperty extends Component {
  constructor(props) {
    super(props);

    this.state = {
      propertyNumber: "",
      propertyType: "",
      description: "",
      acquisitionType: "",
      dateAcquired: new Date(),
      unitPrice: 0,
      users: [],
      endUser: "",
      location: "",
      status: "",
      historyLog: [],
      newHistory: {
        dateAssigned: new Date(),
        location: "",
        staffInCharge: "",
      },
    };
  }

  componentDidMount() {
    axios
      .get("/properties/" + this.props.params.id)
      .then((response) => {
        this.setState({
          propertyNumber: response.data.propertyNumber,
          propertyType: response.data.propertyType,
          description: response.data.description,
          acquisitionType: response.data.acquisitionType || "",
          dateAcquired: new Date(response.data.dateAcquired),
          unitPrice: response.data.unitPrice,
          endUser: response.data.endUser,
          location: response.data.location || "",
          status: response.data.status,
          historyLog: response.data.historyLog || [],
        });
      })
      .catch((error) => console.log(error));

    axios
      .get("/users/")
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            users: response.data.map((user) => user.username),
          });
        }
      })
      .catch((error) => console.log(error));
  }

  handleInputChange = (field) => (e) => {
    this.setState({ [field]: e.target.value });
  };

  handleHistoryInputChange = (field) => (e) => {
    this.setState({
      newHistory: {
        ...this.state.newHistory,
        [field]: e.target.value,
      },
    });
  };

  handleDateChange = (date) => {
    this.setState({ dateAcquired: date });
  };

  handleHistoryDateChange = (date) => {
    this.setState({
      newHistory: {
        ...this.state.newHistory,
        dateAssigned: date,
      },
    });
  };

  addHistoryEntry = () => {
    const { location, staffInCharge } = this.state.newHistory;
    if (!location.trim() || !staffInCharge.trim()) {
      alert("Please fill in both Location and Staff in Charge before adding.");
      return;
    }

    this.setState((prevState) => ({
      historyLog: [...prevState.historyLog, prevState.newHistory],
      newHistory: {
        dateAssigned: new Date(),
        location: "",
        staffInCharge: "",
      },
    }));
  };


  onSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting history log:", this.state.historyLog);  // check this

    const property = {
      propertyNumber: this.state.propertyNumber,
      propertyType: this.state.propertyType,
      description: this.state.description,
      acquisitionType: this.state.acquisitionType,
      dateAcquired: this.state.dateAcquired,
      unitPrice: this.state.unitPrice,
      endUser: this.state.endUser,
      location: this.state.location,
      status: this.state.status,
      historyLog: this.state.historyLog,
    };

    axios
      .post("/properties/update/" + this.props.params.id, property)
      .then((res) => {
        console.log(res.data);
        window.location.href = "/app";
      })
      .catch(err => console.error("Submit error:", err));
  };

  render() {
    return (
      <div>
        <h3>Edit Property</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Property Number:</label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.propertyNumber}
              onChange={this.handleInputChange("propertyNumber")}
            />
          </div>

          <div className="form-group">
            <label>Property Type:</label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.propertyType}
              onChange={this.handleInputChange("propertyType")}
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.description}
              onChange={this.handleInputChange("description")}
            />
          </div>

          <div className="form-group">
            <label>Acquisition Type:</label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.acquisitionType}
              onChange={this.handleInputChange("acquisitionType")}
            />
          </div>

          <div className="form-group">
            <label>Date Acquired:</label>
            <DatePicker
              dateFormat="yyyy/MM/dd"
              selected={this.state.dateAcquired}
              onChange={this.handleDateChange}
            />
          </div>

          <div className="form-group">
            <label>Unit Price:</label>
            <input
              type="number"
              required
              className="form-control"
              value={this.state.unitPrice}
              onChange={this.handleInputChange("unitPrice")}
            />
          </div>

          <div className="form-group">
            <label>End User:</label>
            <select
              required
              className="form-control"
              value={this.state.endUser}
              onChange={this.handleInputChange("endUser")}
            >
              {this.state.users.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.location}
              onChange={this.handleInputChange("location")}
            />
          </div>

          <div className="form-group">
            <label>Status:</label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.status}
              onChange={this.handleInputChange("status")}
            />
          </div>

          <hr />

          <h4>History Log</h4>
          <ul className="list-group mb-3">
            {this.state.historyLog.map((entry, index) => (
              <li key={index}>
                {new Date(entry.dateAssigned).toLocaleDateString()} – {entry.location} – {entry.staffInCharge}
              </li>
            ))}
          </ul>

          <h5>Add History Entry</h5>
          <div className="form-group">
            <label>Date Assigned:</label>
            <DatePicker
              dateFormat="yyyy/MM/dd"
              selected={this.state.newHistory.dateAssigned}
              onChange={this.handleHistoryDateChange}
            />
          </div>

          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              className="form-control"
              value={this.state.newHistory.location}
              onChange={this.handleHistoryInputChange("location")}
            />
          </div>

          <div className="form-group">
            <label>Staff in Charge:</label>
            <input
              type="text"
              className="form-control"
              value={this.state.newHistory.staffInCharge}
              onChange={this.handleHistoryInputChange("staffInCharge")}
            />
          </div>

          <div className="form-group">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={this.addHistoryEntry}
            >
              Add History Entry
            </button>
          </div>

          <div className="form-group">
            <input
              type="submit"
              value="Edit Property"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(EditProperty);
