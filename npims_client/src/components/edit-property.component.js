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
      article: "",
      description: "",
      acquisitionType: "",
      dateAcquired: new Date(),
      unitPrice: 0,
      users: [],
      locations: [],
      images: [],       // existing images URLs 
      newImages: [],    // newly uploaded files 

      // For dropdowns that have fixed options, you can modify as needed
      acquisitionTypes: ["PAR", "ICS"],
      locationOptions: [
        "Main Library - Acquisitions Section", 
        "Main Library - Cataloging and Classification Section",
        "Main Library - Financial and Administrative Section",
        "Main Library - General References and Information Services Section",
        "Main Library - E-Resources and Multimedia Services Section",
        "Main Library - Filipiniana and Serials Section",
        "Main Library - University Archives and Knowledge Repository Section",
        "Main Library - Office of the University Librarian",
        "Others"],
      
      statusTypes:["Active", "For Repair", "Unserviceable", "Condemned"],

      // For multiple staff in charge (current)
      staffInCharge: [""], // array of usernames (initially one dropdown)

      // History log is an array of entries, each entry with multiple staff in charge
      historyLog: [],

      // New history entry form with multiple staffInCharge dropdowns
      newHistory: {
        dateAssigned: new Date(),
        location: "",
        staffInCharge: [""], // array of selected staff usernames for the new entry
      },
    };

    this.propertyTypes = ["Electronic", "Non-electronic"];
    this.electronicArticles = ["Computer - Windows", "Computer - Mac", "Laptop", "Tablet", "Projector", "Printer", "Barcode Scanner", "Book Scanner", "UPS", "Aircon", "TV", "Flashdrive", "Camera", "Others"];
    this.nonElectronicArticles = ["Conference Table", "Center Table", "Computer Table", "Chair", "Stool Chair", "Cabinet", "Card Catalog", "Others"];
  }

  componentDidMount() {
    axios
      .get("/properties/" + this.props.params.id)
      .then((response) => {
        const data = response.data;

        // Defensive: ensure staffInCharge arrays exist
        const staffInCharge = data.staffInCharge || [""];
        console.log("STAFF!")
        console.log(staffInCharge)
        const historyLog = (data.historyLog || []).map((entry) => ({
          ...entry,
          staffInCharge: Array.isArray(entry.staffInCharge)
            ? entry.staffInCharge
            : entry.staffInCharge
            ? [entry.staffInCharge]
            : [""],
        }));

        this.setState({
          propertyNumber: data.propertyNumber,
          propertyType: data.propertyType,
          article: data.article || "",
          description: data.description,
          acquisitionType: data.acquisitionType || "",
          dateAcquired: new Date(data.dateAcquired),
          unitPrice: data.unitPrice,
          location: data.location || "",
          status: data.status,
          staffInCharge: data.staffInCharge,
          historyLog,
          images: data.images || [],  // load existing images 
        });
      })
      .catch((error) => console.log(error));

    axios
      .get("/users/")
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            users: response.data,
          });
        }
      })
      .catch((error) => console.log(error));
  }

  handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "propertyType") {
      // Reset article if propertyType changes
      this.setState({ propertyType: value, article: "" });
    } else {
      this.setState({ [field]: value });
    }
  };

  handleCurrentStaffChange = (index) => (e) => {
    const newStaff = [...this.state.staffInCharge];
    newStaff[index] = e.target.value;
    this.setState({ staffInCharge: newStaff });
  };

  addCurrentStaff = () => {
    this.setState((prevState) => ({
      staffInCharge: [...prevState.staffInCharge, ""],
    }));
  };

  removeCurrentStaff = (index) => {
    if (this.state.staffInCharge.length === 1) return; // at least 1 dropdown
    this.setState((prevState) => {
      const newStaff = prevState.staffInCharge.filter(
        (_, i) => i !== index
      );
      return { staffInCharge: newStaff };
    });
  };

  handleImageChange = (e) => {
    this.setState({ newImages: Array.from(e.target.files) });
  };


  // History log handlers

  handleHistoryInputChange = (field) => (e) => {
    this.setState({
      newHistory: {
        ...this.state.newHistory,
        [field]: e.target.value,
      },
    });
  };

  handleHistoryDateChange = (date) => {
    this.setState({
      newHistory: {
        ...this.state.newHistory,
        dateAssigned: date,
      },
    });
  };

  handleNewHistoryStaffChange = (index) => (e) => {
    const staffArr = [...this.state.newHistory.staffInCharge];
    staffArr[index] = e.target.value;
    this.setState({
      newHistory: {
        ...this.state.newHistory,
        staffInCharge: staffArr,
      },
    });
  };

  addNewHistoryStaff = () => {
    this.setState((prevState) => ({
      newHistory: {
        ...prevState.newHistory,
        staffInCharge: [...prevState.newHistory.staffInCharge, ""],
      },
    }));
  };

  removeNewHistoryStaff = (index) => {
    const staffArr = this.state.newHistory.staffInCharge;
    if (staffArr.length === 1) return; // at least 1 dropdown
    const newStaffArr = staffArr.filter((_, i) => i !== index);
    this.setState({
      newHistory: {
        ...this.state.newHistory,
        staffInCharge: newStaffArr,
      },
    });
  };

  addHistoryEntry = () => {
    const { location, staffInCharge } = this.state.newHistory;
    if (!location.trim()) {
      alert("Please fill in the Location for history entry.");
      return;
    }
    if (staffInCharge.some((s) => !s.trim())) {
      alert("Please select all Staff in Charge for history entry.");
      return;
    }

    this.setState((prevState) => ({
      historyLog: [...prevState.historyLog, prevState.newHistory],
      newHistory: {
        dateAssigned: new Date(),
        location: "",
        staffInCharge: [""],
      },
    }));
  };

  onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("propertyNumber", this.state.propertyNumber);
    formData.append("propertyType", this.state.propertyType);
    formData.append("article", this.state.article);
    formData.append("description", this.state.description);
    formData.append("acquisitionType", this.state.acquisitionType);
    formData.append("dateAcquired", this.state.dateAcquired);
    formData.append("unitPrice", this.state.unitPrice);
    formData.append("location", this.state.location);
    formData.append("status", this.state.status);

    // Append multiple staff IDs
    this.state.staffInCharge.forEach((staffId) => {
      formData.append("staffInCharge", staffId);
    });

    // History log is a structured array, send as JSON string
    const cleanedHistoryLog = this.state.historyLog.map((entry) => ({
      ...entry,
      staffInCharge: entry.staffInCharge.filter((s) => s.trim()),
    }));
    formData.append("historyLog", JSON.stringify(cleanedHistoryLog));

    // Append new image files
    if (this.state.newImages && this.state.newImages.length > 0) {
      this.state.newImages.forEach((file) => {
        formData.append("images", file); // field name must match Multer config
      });
    }

    axios
      .post("/properties/update/" + this.props.params.id, formData)
      .then((res) => {
        console.log(res.data);
        window.location.href = "/app";
      })
      .catch((err) => console.error("Submit error:", err));
  };


  render() {
    const { propertyType, article } = this.state;

    const articleOptions =
      propertyType === "Electronic"
        ? this.electronicArticles
        : propertyType === "Non-electronic"
        ? this.nonElectronicArticles
        : [];

    return (
      <div>
        <h3>Edit Property</h3>
        <form onSubmit={this.onSubmit}>

          {/* Current Staff In Charge - multiple dropdowns */}
          <div className="form-group">
            <label>Staff In Charge:</label>
            {this.state.staffInCharge.map((staff, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <select
                  className="form-control"
                  value={staff}
                  onChange={this.handleCurrentStaffChange(index)}
                >
                  <option value="">Select Staff</option>
                  {this.state.users.map((user) => (
                    <option key={user._id} value={user._id} disabled={this.state.staffInCharge.includes(user._id)}>
                      {user.username}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-danger ms-2"
                  onClick={() => this.removeCurrentStaff(index)}
                  disabled={this.state.staffInCharge.length === 1}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={this.addCurrentStaff}
            >
              Add Staff
            </button>
          </div>

          {/* Location Dropdown */}
          <div className="form-group">
            <label>Location:</label>
            <select
              required
              className="form-control"
              value={this.state.location}
              onChange={this.handleInputChange("location")}
            >
              <option value="">Select Location</option>
              {this.state.locationOptions.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Property Number */}
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

          {/* Property Type */}
          <div className="form-group">
            <label>Property Type:</label>
            <select
              required
              className="form-control"
              value={propertyType}
              onChange={this.handleInputChange("propertyType")}
            >
              <option value="">Select Property Type</option>
              {this.propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Article */}
          <div className="form-group">
            <label>Article:</label>
            <select
              required
              className="form-control"
              value={article}
              onChange={this.handleInputChange("article")}
              disabled={!propertyType}
            >
              <option value="">Select Article</option>
              {articleOptions.map((art) => (
                <option key={art} value={art}>
                  {art}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
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

          {/* Acquisition Type Dropdown */}
          <div className="form-group">
            <label>Acquisition Type:</label>
            <select
              required
              className="form-control"
              value={this.state.acquisitionType}
              onChange={this.handleInputChange("acquisitionType")}
            >
              <option value="">Select Acquisition Type</option>
              {this.state.acquisitionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Date Acquired */}
          <div className="form-group">
            <label>Date Acquired:</label>
            <DatePicker
              dateFormat="yyyy/MM/dd"
              selected={this.state.dateAcquired}
              onChange={(date) => this.setState({ dateAcquired: date })}
            />
          </div>

          {/* Unit Price */}
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





          {/* Status */}
          <div className="form-group">
            <label>Status:</label>
            <select
              required
              className="form-control"
              value={this.state.status}
              onChange={this.handleInputChange("status")}
            >
              <option value="">Select Status</option>
              {this.state.statusTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <hr />

          {/* Existing Images Display */}
          {this.state.images.length > 0 && (
            <div className="form-group mb-3">
              <label>Existing Images:</label>
              <div className="d-flex flex-wrap">
                {this.state.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}  // or your URL construction if img is filename: e.g. `/uploads/${img}`
                    alt={`Property image ${idx + 1}`}
                    style={{ width: 120, height: 120, objectFit: "cover", marginRight: 8, marginBottom: 8 }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images (replace/edit existing) */}
          <div className="form-group mb-4">
            <label>Upload Images (to replace existing):</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={this.handleImageChange}
              className="form-control"
            />
          </div>


          {/* History Log */}
          <h4>History Log</h4>
          <ul className="list-group mb-3">
            {this.state.historyLog.map((entry, idx) => (
              <li key={idx} className="list-group-item">
                <div>
                  <strong>Date Assigned:</strong>{" "}
                  {new Date(entry.dateAssigned).toLocaleDateString()}
                </div>
                <div>
                  <strong>Location:</strong> {entry.location}
                </div>
                <div>
                  <strong>Staff In Charge:</strong>{" "}
                  {entry.staffInCharge
                    .map((userId) => {
                      const user = this.state.users.find((u) => u._id === userId);
                      return user ? user.username : userId; 
                    })
                    .join(", ")}
                </div>
              </li>
            ))}
          </ul>

          {/* Add New History Entry */}
          <h5>Add History Entry</h5>
          <div className="form-group mb-2">
            <label>Date Assigned:</label>
            <DatePicker
              dateFormat="yyyy/MM/dd"
              selected={this.state.newHistory.dateAssigned}
              onChange={this.handleHistoryDateChange}
            />
          </div>

          <div className="form-group mb-2">
            <label>Location:</label>
            <select
              className="form-control"
              value={this.state.newHistory.location}
              onChange={this.handleHistoryInputChange("location")}
            >
              <option value="">Select Location</option>
              {this.state.locationOptions.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Multiple Staff In Charge for new history */}
          <div className="form-group mb-3">
            <label>Staff In Charge:</label>
            {this.state.newHistory.staffInCharge.map((staff, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <select
                  className="form-control"
                  value={staff}
                  onChange={this.handleNewHistoryStaffChange(index)}
                >
                  <option value="">Select Staff</option>
                  {this.state.users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-danger ms-2"
                  onClick={() => this.removeNewHistoryStaff(index)}
                  disabled={this.state.newHistory.staffInCharge.length === 1}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={this.addNewHistoryStaff}
            >
              Add Staff
            </button>
          </div>

          <div className="form-group mb-4">
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
