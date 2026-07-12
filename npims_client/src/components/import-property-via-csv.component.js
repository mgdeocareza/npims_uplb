import React, { Component } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

export default class ImportPropertyViaCSV extends Component {
  constructor(props) {
    super(props);

    this.state = {
      csvFile: null,
      importing: false,
    };
  }

  handleCsvChange = (e) => {
    this.setState({ csvFile: e.target.files[0] });
  };

  handleCsvImport = async () => {
    if (!this.state.csvFile) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", this.state.csvFile);

    this.setState({ importing: true });

    try {
      const res = await axios.post("/properties/import-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(`Imported ${res.data.inserted} properties`);
      window.location.href = "/app";
    } catch (err) {
      console.error(err);
      alert("CSV import failed");
    } finally {
      this.setState({ importing: false });
    }
  };

  render() {
    return (
      <div className="container mt-3">
        <h3>Import Properties via CSV</h3>

        <div className="card mb-3 border-secondary">
          <div className="card-body">
            <h5 className="card-title">Import Properties via CSV</h5>

            <input
              type="file"
              accept=".csv"
              className="form-control mb-2"
              onChange={this.handleCsvChange}
            />

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={this.handleCsvImport}
              disabled={this.state.importing}
            >
              {this.state.importing ? "Importing..." : "Import CSV"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
