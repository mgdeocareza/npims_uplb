import logoLeft from "../images/left-image.png";
import logoRight from "../images/right-image.png";

export default function Navbar({ toggleSidebar }) {
  return (
    <nav
      style={{
        backgroundColor: "#7b1113",
        height: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 15px",
        margin: 0,
      }}
    >
      {/* Left side: Hamburger + Left Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          className="btn btn-link text-white"
          onClick={toggleSidebar}
          style={{
            fontSize: "1.5rem",
            border: "none",
            background: "none",
            padding: 0,
          }}
          aria-label="Toggle sidebar"
        >
          <i className="fas fa-bars"></i>
        </button>

        <img
          src={logoLeft}
          alt="Left Logo"
          style={{ height: "55px", width: "auto", margin: 0, padding: 0 }}
        />
      </div>

      {/* Right side: Right-aligned image */}
      <img
        src={logoRight}
        alt="Right Logo"
        style={{ height: "60px", width: "auto", margin: 0, padding: 0 }}
      />
    </nav>
  );
}
