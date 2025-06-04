  import React, { Component } from "react";
  import axios from "axios";
  import DatePicker from "react-datepicker";
  import "react-datepicker/dist/react-datepicker.css";

  export default class CreateProperty extends Component {
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
        staffInCharge: [""], 
        location: "",
        status: "",
        images: [], // new
      };
    }

    componentDidMount() {
      axios.get("/users/")
        .then((response) => {
          if (response.data.length > 0) {
            this.setState({
              users: response.data,
            });
          }
        })
        .catch((error) => console.log(error));
    }

    handleChange = (e) => {
      this.setState({ [e.target.name]: e.target.value });
    };

    handleDateChange = (date) => {
      this.setState({ dateAcquired: date });
    };

    handleFileChange = (e) => {
      this.setState({ images: Array.from(e.target.files) });
    };

    handleStaffChange = (index) => (e) => {
      const value = e.target.value;
      const staffInCharge = [...this.state.staffInCharge];
      if (staffInCharge.includes(value)) return; // prevent duplicate
      staffInCharge[index] = value;
      this.setState({ staffInCharge });
    };

    addStaffField = () => {
      this.setState((prev) => ({
        staffInCharge: [...prev.staffInCharge, ""],
      }));
    };

    removeStaffField = (index) => {
      const staffInCharge = [...this.state.staffInCharge];
      staffInCharge.splice(index, 1);
      this.setState({ staffInCharge });
    };



    handleSubmit = (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("propertyNumber", this.state.propertyNumber);
      formData.append("propertyType", this.state.propertyType);
      formData.append("article", this.state.article);
      formData.append("description", this.state.description);
      formData.append("acquisitionType", this.state.acquisitionType);
      formData.append("dateAcquired", this.state.dateAcquired.toISOString());
      formData.append("unitPrice", this.state.unitPrice);
      this.state.staffInCharge.forEach((staffId) => {
        formData.append("staffInCharge", staffId);
      });
      formData.append("location", this.state.location);
      formData.append("status", this.state.status);

      this.state.images.forEach((file) => {
        formData.append("images", file);
      });

      axios.post("/properties/add", formData)
        .then((res) => {
          console.log(res.data);
          window.location.href = "/app";
        })
        .catch((error) => console.error(error));
    };

    render() {
      const { propertyType, article, acquisitionType, location, users, staffInCharge } = this.state;

      const electronicArticles = ["Computer - Windows", "Computer - Mac", "Laptop", "Tablet", "Projector", "Printer", "Barcode Scanner", "Book Scanner", "UPS", "Aircon", "TV", "Flashdrive", "Camera", "Others"];
      const nonElectronicArticles = ["Conference Table", "Center Table", "Computer Table", "Chair", "Stool Chair", "Cabinet", "Card Catalog", "Others"];
      const articleOptions =
        propertyType === "Electronic" ? electronicArticles :
        propertyType === "Non-electronic" ? nonElectronicArticles : [];
      const acquisitionTypes = ["PAR", "ICS"];
      const statusTypes = ["Active", "For Repair", "Unserviceable", "Condemned"];
      const locations = [
        "Main Library - Acquisitions Section", 
        "Main Library - Cataloging and Classification Section",
        "Main Library - Financial and Administrative Section",
        "Main Library - General References and Information Services Section",
        "Main Library - E-Resources and Multimedia Services Section",
        "Main Library - Filipiniana and Serials Section",
        "Main Library - University Archives and Knowledge Repository Section",
        "Main Library - Office of the University Librarian",
        "Others"];

      return (
        <div className="container mt-3">
          <h3>Add New Property</h3>
          <form onSubmit={this.handleSubmit} encType="multipart/form-data">

            <div className="form-group">
              <label>Staff In Charge:</label>
              {this.state.staffInCharge.map((staff, index) => (
                <div key={index} className="d-flex mb-2">
                  <select
                    required
                    className="form-control"
                    value={staff}
                    onChange={this.handleStaffChange(index)}
                  >
                    <option value="">Select Staff</option>
                    {users.map((user) => (
                      <option
                        key={user._id}
                        value={user._id}
                        disabled={this.state.staffInCharge.includes(user._id) && user._id !== staff}
                      >
                        {user.username}
                      </option>
                    ))}
                  </select>
                  {this.state.staffInCharge.length > 1 && (
                    <button type="button" onClick={() => this.removeStaffField(index)} className="btn btn-danger btn-sm ml-2">X</button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-secondary btn-sm mt-1" onClick={this.addStaffField}>Add Staff</button>
            </div>

            <div className="form-group">
              <label>Location:</label>
              <select required className="form-control" name="location" value={this.state.location} onChange={this.handleChange}>
                <option value="">Select Location</option>
                {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Property Number:</label>
                  <input type="text" required className="form-control" name="propertyNumber" value={this.state.propertyNumber} onChange={this.handleChange} />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Property Type:</label>
                  <select required className="form-control" name="propertyType" value={propertyType} onChange={this.handleChange}>
                    <option value="">Select Property Type</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Non-electronic">Non-electronic</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Article:</label>
                  <select required className="form-control" name="article" value={article} onChange={this.handleChange}>
                    <option value="">Select Article</option>
                    {articleOptions.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Acquisition Type:</label>
                  <select required className="form-control" name="acquisitionType" value={this.state.acquisitionType} onChange={this.handleChange}>
                    <option value="">Select Type</option>
                    {acquisitionTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Date Acquired:</label>
                  <DatePicker
                    className="form-control"
                    dateFormat="yyyy/MM/dd"
                    selected={this.state.dateAcquired}
                    onChange={this.handleDateChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Unit Price:</label>
                  <input type="number" required className="form-control" name="unitPrice" value={this.state.unitPrice} onChange={this.handleChange} />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Status:</label>
                  <select required className="form-control" name="status" value={this.state.status} onChange={this.handleChange}>
                    <option value="">Select Status</option>
                    {statusTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                required
                className="form-control"
                rows={4}
                name="description"
                value={this.state.description}
                onChange={this.handleChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label>Images:</label>
              <input type="file" className="form-control" multiple onChange={this.handleFileChange} />
            </div>

            <div className="form-group text-right">
              <input type="submit" value="Add New Property" className="btn btn-primary" />
            </div>
          </form>
        </div>

      );
    }
  }
