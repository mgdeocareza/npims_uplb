import React, { useState } from "react";
import "./login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaLock } from "react-icons/fa";
import logo from "../images/NPIMS LOGO 2025_a.png";
import logo2 from "../images/3.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Login attempt started");

    try {
      const res = await axios.post(
        "/login",
        { username, password },
        { withCredentials: true }
      );

      console.log("Response from backend:", res.data);

      if (res.data.message === "Login successful") {
        localStorage.setItem("userRole", res.data.role);
        localStorage.setItem("loginUsername", username); 
        console.log("Redirecting to /app");
        navigate("/app");
        console.log("navigate called");
      }
    } catch (err) {
      console.log("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="card border-dark shadow" style={{ width: "355px" }}>
          <div className="card-header text-center bg-white" style={{ height: "300px" }}>
            <img src={logo} alt="NPIMS Logo" width="320" height="280" />
          </div>
          <div className="card-body">
            <div className="text-center mb-4">
              <img
                src={logo2}
                alt="NPIMS Text Logo"
                style={{ height: "3em", marginBottom: "0.25em" }}
              />
              <h3 className="mb-0">Sign In</h3>
            </div>

            <form onSubmit={handleLogin}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                  style={{ height: 'calc(1.5em + .75rem + 2px)', borderRight: 'none' }}
                />
                <span
                className="input-group-text"
                style={{
                  backgroundColor: '#e9ecef', // Very light gray 
                  color: '#343a40',           // Dark gray (Bootstrap gray-800)
                  borderLeft: '1px solid #ced4da'
                }}>
                  <FaUser style={{ fontSize: '1.2em' }} />
                </span>
              </div>

              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ height: 'calc(1.5em + .75rem + 2px)', borderRight: 'none' }}
                />
                <span
                className="input-group-text"
                style={{
                  backgroundColor: '#e9ecef', // Very light gray 
                  color: '#343a40',           // Dark gray (Bootstrap gray-800)
                  borderLeft: '1px solid #ced4da'
                }}>                  
                  <FaLock style={{ fontSize: '1.2em' }} />
                </span>
              </div>

              <div className="text-center mb-3">
                <button type="submit" className="btn btn-dark px-5">
                  Sign In
                </button>
              </div>

              {error && (
                <div className="alert alert-danger text-center mt-2">{error}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
