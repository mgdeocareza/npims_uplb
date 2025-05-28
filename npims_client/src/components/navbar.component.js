import { useNavigate } from "react-router-dom";

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");
  const username = localStorage.getItem("username");  

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };


  return (
  <nav
    className="navbar navbar-dark"
    style={{
      backgroundColor: "#191f22",
      height: "56px",
      display: "flex",
      alignItems: "center",
      padding: "0 15px",
      color: "#ffffff",
    }}
  >
    {/* Hamburger icon */}
    <button
      className="btn btn-link text-white"
      onClick={toggleSidebar}
      style={{ fontSize: "1.5rem", border: "none", background: "none" }}
      aria-label="Toggle sidebar"
    >
      <i className="fas fa-bars"></i>
    </button>

    {/* Spacer to push right side content to the right */}
    <div style={{ flexGrow: 1 }}></div>

    {/* Group the text and logout button together */}
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      {role === "admin" ? (
        <span>You are logged in as <strong>Admin</strong></span>
      ) : (
        <span>Welcome, <strong>{username}</strong></span>
      )}

      <button className="btn btn-outline-light" onClick={handleLogout}>
        Logout <i className="fas fa-sign-out-alt"></i>
      </button>
    </div>
  </nav>
  );
}
