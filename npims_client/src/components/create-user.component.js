import React, { Component } from "react";
import axios from "axios";

export default class CreateUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      departments: [""], 
    };
  }

  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value });
  };

  handleDepartmentChange = (index, value) => {
    const updatedDepartments = [...this.state.departments];
    updatedDepartments[index] = value;
    this.setState({ departments: updatedDepartments });
  };

  handleAddDepartment = () => {
    this.setState((prevState) => ({
      departments: [...prevState.departments, ""],
    }));
  };

  handleRemoveDepartment = (index) => {
    if (this.state.departments.length === 1) return; // prevent removing the last one
    const newDepartments = this.state.departments.filter((_, i) => i !== index);
    this.setState({ departments: newDepartments });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      username: this.state.username,
      department: this.state.departments.filter((d) => d !== ""), // clean empty strings
      propertyCount: 0,
    };

    axios
      .post("/users/add", user)
      .then((res) => {
        console.log(res.data);
        // Reset form
        this.setState({ username: "", departments: [""] });
      })
      .catch((err) => console.error(err));
  };

  render() {
    const departmentOptions = [
      "Office of the University Librarian",
      "Acquisitions Section",
      "Cataloging and Classification Section",
      "Financial and Administrative Section",
      "General References and Information Services Section",
      "E-Resources and Multimedia Services Section",
      "Filipiniana and Serials Section",
      "University Archives and Knowledge Repository Section",
      "Others",
    ];

    return (
      <div>
        <h3>Add New Staff</h3>
        <form onSubmit={this.handleSubmit}>
          {/* Username Input */}
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.username}
              onChange={this.handleUsernameChange}
            />
          </div>

          {/* Departments Dropdowns */}
          <div className="form-group">
            <label>Department(s):</label>
            {this.state.departments.map((dept, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <select
                  className="form-control"
                  value={dept}
                  onChange={(e) =>
                    this.handleDepartmentChange(index, e.target.value)
                  }
                  required
                >
                  <option value="">-- Select Department --</option>
                  {departmentOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-danger ms-2"
                  onClick={() => this.handleRemoveDepartment(index)}
                  disabled={this.state.departments.length === 1}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary btn-sm mt-2"
              onClick={this.handleAddDepartment}
            >
              + Add another department
            </button>
          </div>

          {/* Submit */}
          <div className="form-group mt-3">
            <input
              type="submit"
              value="Add User"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}
