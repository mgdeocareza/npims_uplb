import React, { Component } from "react";
import axios from "axios";

export default class CreateUser extends Component {
  constructor(props) {
    super(props);

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeDepartment = this.onChangeDepartment.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      username: "",
      department: ""
    };
  }

  onChangeUsername(e) {
    this.setState({ username: e.target.value });
  }

  onChangeDepartment(e) {
    this.setState({ department: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      username: this.state.username,
      department: this.state.department,
      propertyCount: 0,
    };

    console.log(user);

    axios
      .post("/users/add", user)
      .then((res) => console.log(res.data));

    // so it resets the value and can add new
    this.setState({
      username: "",
      department: ""
    });
  }

  render() {
    return (
      <div>
        <h3>Add New User</h3>

        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Name: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.username}
              onChange={this.onChangeUsername}
            />
          </div>

          <div className="form-group">
            <label>Department: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.department}
              onChange={this.onChangeDepartment}
            />
          </div>

          <div className="form-group">
            <input
              type="submit"
              value="Add New User"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}
