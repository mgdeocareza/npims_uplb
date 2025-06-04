import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import "datatables.net";

// Define readable column labels
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
  status: "Status"
};

const COLUMN_SETS = {
  default: ["propertyNumber", "propertyType", "article", "description", "acquisitionType", "dateAcquired", "unitPrice", "staffInCharge", "location", "status"],
  viewAllFiltered: ["propertyNumber", "article", "dateAcquired", "unitPrice","staffInCharge", "location", "status"],
  filterByArticle: ["propertyNumber", "article", "description", "acquisitionType", "dateAcquired", "staffInCharge", "location", "status"],
  filterByAcquisition: ["propertyNumber", "article", "acquisitionType", "dateAcquired", "unitPrice", "staffInCharge", "location", "status"]
};

const NPIMSProperty = ({ property, deleteProperty, role, columns, userMap }) => (
  <tr>
    {columns.map((col) => {
      let value = property[col];

      if (col === "dateAcquired") {
        value = value?.substring(0, 10);
        console.log(`Type of ${col}:`, typeof value);
      }

      if (col === "staffInCharge") {
        if (Array.isArray(property[col])) {
          value = property[col].map(id => userMap[id] || id).join(", ");
        } else {
          value = userMap[property[col]] || property[col];
        }
      }

      return (
        <td key={col} style={{textAlign: col === 'unitPrice' ? 'right' : 'left' }}>
          {value}
        </td>
      );
    })}
    {role === 'admin' && (
      <td style={{ textAlign: 'left' }}>
        <Link to={`/app/view/${property._id}`}>view</Link> |{" "}
        <Link to={`/app/edit/${property._id}`}>edit</Link> |{" "}
        <a href="#" onClick={(e) => {
          e.preventDefault();
          if (window.confirm("Are you sure you want to delete?")) {
            deleteProperty(property._id);
          }
        }}>delete</a>
      </td>
    )}
  </tr>
);

export default class PropertiesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      properties: [],
      users: [],
      role: localStorage.getItem("userRole") || "user",
    };
    this.deleteProperty = this.deleteProperty.bind(this);
  }

  componentDidMount() {
    axios.get("/properties/")
      .then((response) => {
        this.setState({ properties: response.data }, () => {
          this.initializeDataTable();
        });
      }).catch(console.error);

    axios.get("/users/")
      .then((res) => this.setState({ users: res.data }))
      .catch(console.error);

    const style = document.createElement('style');
    style.innerHTML = `
      #propertiesTable th.sorting,
      #propertiesTable th.sorting_asc,
      #propertiesTable th.sorting_desc {
        text-align: left !important;
        padding-right: 20px !important;
      }

      #propertiesTable th.sorting::after,
      #propertiesTable th.sorting_asc::after,
      #propertiesTable th.sorting_desc::after {
        float: right !important;
        margin-left: 5px;
      }
    `;
    document.head.appendChild(style); 
  }

  componentWillUnmount() {
    if ($.fn.DataTable.isDataTable("#propertiesTable")) {
      $("#propertiesTable").DataTable().destroy(true);
    }
  }

  deleteProperty(id) {
    if ($.fn.DataTable.isDataTable("#propertiesTable")) {
      $("#propertiesTable").DataTable().destroy();
    }

    axios.delete("/properties/" + id).then((response) => {
      console.log(response.data);
    });

    this.setState({
      properties: this.state.properties.filter((el) => el._id !== id),
    }, this.initializeDataTable);
  }

  initializeDataTable() {
    $("#propertiesTable").DataTable({
      language: {
        lengthMenu: "Show _MENU_ entries"
      },
      responsive: true,
      destroy: true,
      columnDefs: [
        {
          targets: [2,3,4,5],
          type: 'string',  
          className: 'dt-body-left'  
        },
        { width: '150px', targets: 0 },
        { width: '170px', targets: 1 },
        { width: '120px', targets: 2 },
        { width: '120px', targets: 3 },
        { width: '170px', targets: 4 },
        { width: '210px', targets: 5 },
        { width: '100px', targets: 6 },
      ]
    });
  }

  getActiveColumns() {
    if (this.props.article) return COLUMN_SETS.filterByArticle;
    if (this.props.acquisitionType) return COLUMN_SETS.filterByAcquisition;
    return COLUMN_SETS.viewAllFiltered;
  }

  propertyList(columns, userMap) {
    let filtered = this.state.properties;

    if (this.props.article) {
      filtered = filtered.filter(p => p.article === this.props.article);
    }
    if (this.props.materialType) {
      filtered = filtered.filter(p => p.propertyType === this.props.materialType);
    }
    if (this.props.acquisitionType) {
      filtered = filtered.filter(p => p.acquisitionType === this.props.acquisitionType);
    }
    if (this.props.staffInCharge) {
      filtered = filtered.filter(p => p.staffInCharge === this.props.staffInCharge);
    }
    if (this.props.location) {
      filtered = filtered.filter(p => p.location === this.props.location);
    }

    return filtered.map((property) => (
      <NPIMSProperty
        key={property._id}
        property={property}
        deleteProperty={this.deleteProperty}
        role={this.state.role}
        columns={columns}
        userMap={userMap}
      />
    ));
  }

  render() {
    const { showAll } = this.props;
    const { role, users } = this.state;
    const activeColumns = this.getActiveColumns();
    const userMap = Object.fromEntries(users.map(user => [user._id, user.username]));

    return (
      <div>
        {showAll && <h3>All Properties</h3>}

        <table id="propertiesTable" className="display">
          <thead className="thead-light">
            <tr>
              {activeColumns.map(col => (
                <th key={col} style={{ textAlign: 'left' }}>
                  {COLUMN_LABELS[col] || col}
                </th>
              ))}
              {role === 'admin' && <th style={{ textAlign: 'left' }}>Action</th>}
            </tr>
          </thead>
          <tbody>{this.propertyList(activeColumns, userMap)}</tbody>
        </table>
      </div>
    );
  }
}
