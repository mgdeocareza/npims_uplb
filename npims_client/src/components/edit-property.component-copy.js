import React, { Component } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import withRouter from "./withRouter";

class EditProperty extends Component {
  constructor(props) {
    super(props);

    this.onChangePropertyNumber = this.onChangePropertyNumber.bind(this);
    this.onChangePropertyType = this.onChangePropertyType.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeAcquisitionType = this.onChangeAcquisitionType.bind(this);
    this.onChangeDateAcquired = this.onChangeDateAcquired.bind(this);
    this.onChangeUnitPrice = this.onChangeUnitPrice.bind(this);
    this.onChangeEndUser = this.onChangeEndUser.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

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
    };
  }

  onChangePropertyNumber(e) {
    this.setState({ propertyNumber: e.target.value });
  }
  onChangePropertyType(e) {
    this.setState({ propertyType: e.target.value });
  }
  onChangeDescription(e) {
    this.setState({ description: e.target.value });
  }
  onChangeAcquisitionType(e) {
    this.setState({ acquisitionType: e.target.value });
  }
  onChangeDateAcquired(date) {
    this.setState({ dateAcquired: date });
  }
  onChangeUnitPrice(e) {
    this.setState({ unitPrice: Number(e.target.value) });
  }
  onChangeEndUser(e) {
    this.setState({ endUser: e.target.value });
  }
  onChangeLocation(e) {
    this.setState({ location: e.target.value });
  }
  onChangeStatus(e) {
    this.setState({ status: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

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
    };

    console.log("Updating property:", property);

    axios
      .post("/properties/update/" + this.props.params.id, property)
      .then((res) => {
        console.log(res.data);
        window.location.href = "/app"; // go back to properties list
      });
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
        });
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("/users/")
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            users: response.data.map((user) => user.username),
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <h3>Edit Property</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Property Number: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.propertyNumber}
              onChange={this.onChangePropertyNumber}
            />
          </div>

          <div className="form-group">
            <label>Property Type: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.propertyType}
              onChange={this.onChangePropertyType}
            />
          </div>

          <div className="form-group">
            <label>Description: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.description}
              onChange={this.onChangeDescription}
            />
          </div>

          <div className="form-group">
            <label>Acquisition Type: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.acquisitionType}
              onChange={this.onChangeAcquisitionType}
            />
          </div>

          <div className="form-group">
            <label>Date Acquired: </label>
            <DatePicker
              dateFormat="yyyy/MM/dd"
              selected={this.state.dateAcquired}
              onChange={this.onChangeDateAcquired}
            />
          </div>

          <div className="form-group">
            <label>Unit Price: </label>
            <input
              type="number"
              required
              className="form-control"
              value={this.state.unitPrice}
              onChange={this.onChangeUnitPrice}
            />
          </div>

          <div className="form-group">
            <label>End User: </label>
            <select
              required
              className="form-control"
              value={this.state.endUser}
              onChange={this.onChangeEndUser}
            >
              {this.state.users.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Location: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.location}
              onChange={this.onChangeLocation}
            />
          </div>

          <div className="form-group">
            <label>Status: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.status}
              onChange={this.onChangeStatus}
            />
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
