import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Search,
  Home,
  Users,
  BookOpen,
  HelpCircle,
  Beaker,
  Settings,
  LogOut,
  Upload,
  User,
  Bell,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Oz Citizen - Trans.png";

export default function AddChapter() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    image: null,
    imagePreview: "",
    title: "",
    subtitle: "",
    description: "",
    status: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("tests-chapters");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API_URL = "http://localhost:5000/api/chapters";

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.image || !formData.title) {
      setError("Image and Title are required");
      return;
    }

    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("image", formData.image);
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("description", formData.description);
    data.append("status", formData.status);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const newChapter = await res.json();
      console.log("Chapter created:", newChapter);

      navigate("/admin/chapter");
    } catch (err) {
      setError(err.message || "Failed to create chapter");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (id) => {
    const routes = {
      overview: "/admin",
      users: "/admin/users",
      "tests-chapters": "/admin/chapter",
      questions: "/admin/questions",
      simulation: "/admin/simulation",
    };
    
    setActiveNav(id);
    setSidebarOpen(false);
    
    if (routes[id]) {
      navigate(routes[id]);
    }
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "users", label: "Users", icon: Users },
    { id: "tests-chapters", label: "Tests & Chapters", icon: BookOpen },
    { id: "questions", label: "Questions", icon: HelpCircle },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; 
          background: #f0f9ff !important; 
          color: #0b2447; 
          zoom: 0.8;
        }

        .dashboard-container { 
          display: flex; 
          min-height: 100vh; 
        }

        /* Sidebar */
        .sidebar {
          width: 240px !important;
          background: #dbeafe;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 40;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transform: translateX(-110%);
          transition: transform .28s cubic-bezier(.2,.9,.3,1);
          border-right: 1px solid #bae6fd;
        }

        .sidebar.open { transform: translateX(0); }

        @media (min-width: 1024px) {
          .sidebar { 
            transform: translateX(0); 
            width: 240px !important; 
          }
          .main-content {
            margin-left: 240px !important;
          }
        }

        .logo-container {
          text-align: left;
          padding: 8px 0;
          margin-bottom: 12px;
        }

        .logo-img {
          height: 50px;
          object-fit: contain;
          filter: drop-shadow(0 6px 12px rgba(3,105,161,0.08));
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 10px;
          color: #1e40af;
          font-weight: 600;
          font-size: 15px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
        }

        .nav-item svg {
          stroke: #1e40af;
        }

        .nav-item:hover {
          background: #bae6fd;
        }

        .nav-item.active {
          background: #0ea5e9;
          color: white;
        }

        .nav-item.active svg {
          stroke: white;
        }

        .logout-section {
          margin-top: auto;
          padding-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .settings-btn,
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 10px;
          border: none;
          background: transparent;
          font-weight: 700;
          cursor: pointer;
        }

        .settings-btn {
          color: #1e40af;
        }

        .settings-btn:hover {
          background: #bae6fd;
        }

        .logout-btn {
          color: #ef4444;
        }

        .logout-btn:hover {
          background: #fff0f1;
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 35;
        }

        .sidebar-overlay.show { display: block; }

        @media(min-width:1024px) { 
          .sidebar-overlay { display: none !important; } 
        }

        .main-content {
          flex: 1;
          margin-left: 0;
          padding: 0;
        }

        @media(min-width:1024px) {
          .main-content {
            margin-left: 240px;
          }
        }

        /* Top Bar */
        .top-bar {
          background: #dbeafe !important;
          padding: 18px 24px !important;
          min-height: 78px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 30;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .top-bar-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .top-search {
          position: relative;
          flex: 1;
          max-width: 420px;
        }

        .top-search input {
          width: 100%;
          padding: 10px 14px 10px 40px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: white;
          font-size: 15px;
        }

        .top-search input:focus {
          outline: none;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
        }

        .top-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }

        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .icon-button {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .icon-button:hover {
          background: #bae6fd;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .mobile-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          top: 16px;
          left: 16px;
          z-index: 50;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: white;
          border: none;
          box-shadow: 0 6px 18px rgba(2,6,23,0.08);
          cursor: pointer;
        }

        @media(min-width:1024px) { 
          .mobile-menu-btn { display: none; } 
        }

        .content-area {
          padding: 20px;
        }

        @media(min-width:1024px) {
          .content-area {
            padding: 28px;
          }
        }

        .page-header {
          margin-bottom: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0c4a6e;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .form-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          gap: 48px;
          align-items: flex-start;
        }

        @media(max-width: 768px) {
          .form-container {
            flex-direction: column;
          }
        }

        /* Left: Image Upload - Larger */
        .upload-section {
          flex: 0 0 480px;
        }

        @media(max-width: 768px) {
          .upload-section {
            flex: 1;
            width: 100%;
          }
        }

        .upload-section label.section-label {
          font-weight: 600;
          color: #374151;
          font-size: 16px;
          margin-bottom: 16px;
          display: block;
        }

        .upload-area {
          border: 3px dashed #cbd5e1;
          border-radius: 20px;
          padding: 60px 40px;
          text-align: center;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .upload-area:hover {
          border-color: #0ea5e9;
          background: #f0f9ff;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(14,165,233,0.15);
        }

        .upload-icon {
          width: 80px;
          height: 80px;
          color: #94a3b8;
          margin-bottom: 20px;
        }

        .image-preview {
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid #e2e8f0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }

        .image-preview img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          display: block;
        }

        /* Right: Form Fields */
        .form-fields {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 16px;
        }

        .required {
          color: #ef4444;
        }

        .form-input,
        .form-textarea {
          padding: 16px 18px;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          background: white;
          font-size: 15px;
          transition: all 0.2s;
          font-family: inherit;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #0ea5e9;
          background: white;
          box-shadow: 0 0 0 4px rgba(14,165,233,0.12);
        }

        .form-textarea {
          min-height: 180px;
          resize: vertical;
        }

        .error-msg {
          background: #fee2e2;
          color: #dc2626;
          padding: 16px 20px;
          border-radius: 12px;
          border: 2px solid #fca5a5;
          font-weight: 500;
          margin-bottom: 20px;
        }

        .submit-section {
          margin-top: 40px;
          display: flex;
          justify-content: flex-end;
          gap: 16px;
        }

        .btn-cancel {
          padding: 16px 32px;
          border-radius: 14px;
          background: #f1f5f9;
          color: #475569;
          font-weight: 700;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover {
          background: #e2e8f0;
          transform: translateY(-2px);
        }

        .btn-submit {
          padding: 16px 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: white;
          font-weight: 700;
          font-size: 16px;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(3,105,161,0.3);
          transition: all 0.2s;
        }

        .btn-submit:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(3,105,161,0.4);
        }

        .btn-submit:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-cancel:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>

      <div className="dashboard-container">
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} color="#0369a1" />
        </button>

        <div
          className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="logo-container">
            <img src={logo} alt="Oz Citizen" className="logo-img" />
          </div>

          <nav className="nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${activeNav === item.id ? "active" : ""}`}
                  onClick={() => handleNavigation(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="logout-section">
            <button className="settings-btn">
              <Settings size={18} /> Settings
            </button>
            <button className="logout-btn">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="top-bar">
            <div className="top-bar-left">
              <div className="top-search">
                <Search className="top-search-icon" size={18} />
                <input placeholder="Search chapters..." />
              </div>
            </div>
            <div className="top-bar-right">
              <button className="icon-button">
                <Bell size={22} color="#475569" />
              </button>
              <div className="user-avatar">
                <User size={22} color="white" />
              </div>
            </div>
          </div>

          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">
                <Plus size={32} /> Add New Chapter
              </h1>
            </div>

            {error && <div className="error-msg">Error: {error}</div>}

            <div className="form-container">
              {/* Left: Image Upload */}
              <div className="upload-section">
                <label className="section-label">
                  Upload Image <span className="required">*</span>
                </label>
                <label htmlFor="image-upload" className="upload-area">
                  {formData.imagePreview ? (
                    <div className="image-preview">
                      <img src={formData.imagePreview} alt="Preview" />
                    </div>
                  ) : (
                    <>
                      <Upload className="upload-icon" />
                      <p style={{ margin: "16px 0", color: "#475569", fontWeight: 600, fontSize: '16px' }}>
                        Click to upload or drag and drop
                      </p>
                      <p style={{ fontSize: "14px", color: "#94a3b8" }}>
                        PNG, JPG up to 10MB
                      </p>
                    </>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              {/* Right: Form Fields */}
              <div className="form-fields">
                <div className="form-group">
                  <label className="form-label">
                    Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    placeholder="Practice test for: Chapter 1"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    className="form-input"
                    placeholder="e.g. Australian Values"
                    value={formData.subtitle}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">About this Test</label>
                  <textarea
                    name="description"
                    className="form-textarea"
                    placeholder="Write a short description..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="submit-section">
                  <button
                    className="btn-cancel"
                    onClick={() => navigate("/admin/chapter")}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-submit"
                    onClick={handleSubmit}
                    disabled={loading || !formData.image || !formData.title}
                  >
                    {loading ? "Creating..." : "Save Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}