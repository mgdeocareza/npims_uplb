import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import "datatables.net";

const NPIMSProperty = (props) => {
  const { property, deleteProperty, role } = props;

  return (
    <tr>
      <td>{property.propertyNumber}</td>
      <td>{property.propertyType}</td>
      <td>{property.description}</td>
      <td>{property.acquisitionType}</td>
      <td>{property.dateAcquired.substring(0, 10)}</td>
      <td>{property.unitPrice}</td>
      <td>{property.endUser}</td>
      <td>{property.location}</td>
      <td>{property.status}</td>
      {role === 'admin' && (
        <td>
          <Link to={"/app/view/" + property._id}>view</Link> |{" "}
          <Link to={"/app/edit/" + property._id}>edit</Link> |{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault(); // Prevent URL change and jump
              if (window.confirm("Are you sure you want to delete?")) {
                deleteProperty(property._id);
              }
            }}
          >
            delete
          </a>
        </td>
      )}
    </tr>
  );
};

export default class PropertiesList extends Component {
  constructor(props) {
    super(props);

    this.deleteProperty = this.deleteProperty.bind(this);

    this.state = { 
      properties: [],
      role: localStorage.getItem("userRole") || "user",  // get role from localStorage
    };  
  }

  componentDidMount() {
    axios
      .get("/properties/")
      .then((response) => {
        this.setState({ properties: response.data }, () => {
          // Initialize DataTables after setting the state
          this.initializeDataTable();
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentWillUnmount() {
    // Cleanup DataTable on unmount
    if ($.fn.DataTable.isDataTable("#propertiesTable")) {
      $("#propertiesTable").DataTable().destroy(true);
    }
  }

  deleteProperty(id) {
    // Destroy existing DataTable instance before changing state
    if ($.fn.DataTable.isDataTable("#propertiesTable")) {
      $("#propertiesTable").DataTable().destroy();
    }

    axios.delete("/properties/" + id).then((response) => {
      console.log(response.data);
    });

    this.setState({
      properties: this.state.properties.filter((el) => el._id !== id),
    }, () => {
      this.initializeDataTable(); // Reinitialize DataTable after deletion
    });
  }

  initializeDataTable() {
    // Initialize DataTable
    $("#propertiesTable").DataTable({
      // dom: '<"top"f>rt<"bottom"l><"clear">',
      language: {
        lengthMenu: "Show _MENU_ entries"
      },
      responsive: true,
      destroy: true, // Ensure that we can reinitialize it
    });
  }

  propertyList() {
    let filtered = this.state.properties;
    
    if (this.props.materialType) {
      filtered = filtered.filter(p => p.propertyType === this.props.materialType);
    }

    if (this.props.acquisitionType) {
      filtered = filtered.filter(p => p.acquisitionType === this.props.acquisitionType);
    }

    if (this.props.endUser) {
      filtered = filtered.filter(p => p.endUser === this.props.endUser);
    }

    if (this.props.location) {
      filtered = filtered.filter(p => p.location === this.props.location);
    }
    
    return filtered.map((currentproperty) => (
      <NPIMSProperty
        property={currentproperty}
        deleteProperty={this.deleteProperty}
        key={currentproperty._id}
        role={this.state.role} 
      />
    ));
  }

  render() {
    const { showAll } = this.props;
    const { role } = this.state; // <-- get role from state here

    return (
      <div>
        {showAll && <h3>All Properties</h3>}

        <table id="propertiesTable" className="display">
          <thead className="thead-light">
            <tr>
              <th>Property Number</th>
              <th>Property Type</th>
              <th>Description</th>
              <th>Acquisition Type</th>
              <th>Date Acquired</th>
              <th>Unit Price</th>
              <th>Staff In Charge</th>
              <th>Location</th>
              <th>Status</th>
              {/* Render Action header only if admin */}
              {role === "admin" && <th>Action</th>}            
            </tr>
          </thead>
          <tbody>{this.propertyList()}</tbody>
        </table>
      </div>
    );
  }
}