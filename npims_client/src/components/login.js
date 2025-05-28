import React, { useState } from "react";
import "./login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaLock } from "react-icons/fa";
import logo from "../images/npims2025.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login attempt started");  

    setError("");

    try {
      const res = await axios.post("/login", {
        username,
        password,
      }, {
        withCredentials: true // if using cookies or sessions
      });

      console.log("Response from backend:", res.data);  

      if (res.data.message === "Login successful") {
        localStorage.setItem("userRole", res.data.role);
        localStorage.setItem("username", username); 
        navigate("/app");
      }
    } catch (err) {
      console.log("Login error:", err);  
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="card border-dark shadow">
          <div className="card-header text-center bg-white">
            <img src={logo} alt="NPIMS Logo" width="300" height="150" />
          </div>
          <div className="card-body">
            <h2 className="login-box-msg text-center">Sign in to NPIMS</h2>

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
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <FaUser />
                  </div>
                </div>
              </div>

              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <FaLock />
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-8 d-flex align-items-center">
                  <input type="checkbox" id="remember" className="mr-2" />
                  <label htmlFor="remember">Remember Me</label>
                </div>
                <div className="col-4">
                  <button type="submit" className="btn btn-dark btn-block w-100">
                    Sign In!
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger text-center mt-2">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
