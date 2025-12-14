import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={{ padding: "10px 20px", background: "#333", color: "#fff", display: "flex", justifyContent: "space-between" }}>
      <h1>Admin Panel</h1>
      <nav>
        <Link to="/admin/Chapter" style={{ color: "#fff", marginRight: "15px" }}>Chapters</Link>
        <Link to="/login" style={{ color: "#fff" }}>Login</Link>
      </nav>
    </header>
  );
};

export default Header;
