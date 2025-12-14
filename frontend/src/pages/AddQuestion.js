import React, { useState, useEffect } from "react";
import {
  Search,
  Home,
  Users,
  BookOpen,
  HelpCircle,
  Beaker,
  Settings,
  LogOut,
  Upload,
  Plus,
  Trash2,
  X,
  Bell,
  User,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Oz Citizen - Trans.png";

export default function AddQuestion() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    question: "",
    feedback: "",
    audio: null,
    audioPreview: "",
    chapterId: "",
    testType: "FREE",
    status: true,
    options: [{ text: "", isCorrect: false }],
  });

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingChapters, setFetchingChapters] = useState(true);
  const [activeNav, setActiveNav] = useState("questions");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API_URL = "http://localhost:5000/api/questions";
  const CHAPTERS_URL = "http://localhost:5000/api/chapters";

  useEffect(() => {
    fetchChapters();
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const fetchChapters = async () => {
    try {
      const res = await fetch(CHAPTERS_URL);
      if (!res.ok) throw new Error("Failed to load chapters");
      const data = await res.json();
      setChapters(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not load chapters");
    } finally {
      setFetchingChapters(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        audio: file,
        audioPreview: URL.createObjectURL(file),
      }));
    }
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", isCorrect: false }],
    }));
  };

  const updateOption = (index, field, value) => {
    setFormData((prev) => {
      const newOptions = [...prev.options];
      newOptions[index][field] = field === "isCorrect" ? value : value;
      return { ...prev, options: newOptions };
    });
  };

  const removeOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.question.trim()) return setError("Question is required");
    if (!formData.chapterId) return setError("Chapter is required");
    if (formData.options.some((o) => !o.text.trim()))
      return setError("All options must have text");
    if (!formData.options.some((o) => o.isCorrect))
      return setError("At least one correct answer is required");

    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("question", formData.question);
    data.append("chapterId", formData.chapterId);
    data.append("feedback", formData.feedback);
    data.append("testType", formData.testType);
    data.append("status", formData.status);
    if (formData.audio) data.append("audio", formData.audio);
    data.append("options", JSON.stringify(formData.options));

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create");
      }

      navigate("/admin/questions");
    } catch (err) {
      setError(err.message);
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

        .dashboard-container { display: flex; min-height: 100vh; }

        /* SIDEBAR */
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
          border-right: 1px solid #bae6fd;
          transform: translateX(-110%);
          transition: transform .28s cubic-bezier(.2,.9,.3,1);
        }
        .sidebar.open { transform: translateX(0); }
        @media (min-width: 1024px) {
          .sidebar { transform: translateX(0); width: 240px !important; }
          .main-content { margin-left: 240px !important; }
        }

        .logo-container { text-align: left; padding: 8px 0; margin-bottom: 12px; }
        .logo-img { height: 50px; object-fit: contain; filter: drop-shadow(0 6px 12px rgba(3,105,161,0.08)); }

        .nav { display: flex; flex-direction: column; gap: 6px; }
        .nav-item {
          display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px;
          color: #1e40af; font-weight: 600; font-size: 15px; background: transparent; border: none;
          cursor: pointer; transition: all .15s; text-decoration: none;
        }
        .nav-item svg { stroke: #1e40af; }
        .nav-item:hover { background: #bae6fd; }
        .nav-item.active { background: #0ea5e9; color: white; }
        .nav-item.active svg { stroke: white; }

        .logout-section { margin-top: auto; padding-top: 12px; display: flex; flex-direction: column; gap: 8px; }
        .settings-btn, .logout-btn { 
          display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; 
          border: none; background: transparent; font-weight: 700; cursor: pointer; 
        }
        .settings-btn { color: #1e40af; }
        .settings-btn:hover { background: #bae6fd; }
        .logout-btn { color: #ef4444; }
        .logout-btn:hover { background: #fff0f1; }

        .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 35; }
        .sidebar-overlay.show { display: block; }
        @media(min-width:1024px) { .sidebar-overlay { display: none !important; } }

        .main-content { flex: 1; margin-left: 0; padding: 0; }
        @media(min-width:1024px) { .main-content { margin-left: 240px; } }

        /* TOP BAR */
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

        .top-bar-left { display: flex; align-items: center; gap: 16px; flex: 1; }
        .top-search { position: relative; flex: 1; max-width: 420px; }
        .top-search input {
          width: 100%; padding: 10px 14px 10px 40px; border-radius: 10px;
          border: 1px solid #e2e8f0; background: white; font-size: 15px;
        }
        .top-search input:focus { outline: none; border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
        .top-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #64748b; }

        .top-bar-right { display: flex; align-items: center; gap: 14px; }
        .icon-button { width: 40px; height: 40px; border-radius: 10px; background: transparent; border: none;
          display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s;
        }
        .icon-button:hover { background: #bae6fd; }
        .user-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }

        .mobile-menu-btn {
          display: flex; align-items: center; justify-content: center;
          position: fixed; top: 16px; left: 16px; z-index: 50;
          width: 44px; height: 44px; border-radius: 10px; background: white; border: none;
          box-shadow: 0 6px 18px rgba(2,6,23,0.08); cursor: pointer;
        }
        @media(min-width:1024px) { .mobile-menu-btn { display: none; } }

        .content-area { padding: 20px; background: #f0f9ff; min-height: calc(100vh - 78px); }
        @media(min-width:1024px) { .content-area { padding: 28px; } }

        .card {
          background: transparent;
          border-radius: 0;
          padding: 0;
          border: none;
          box-shadow: none;
          max-width: 1400px;
          margin: 0 auto;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 0;
          border-bottom: none;
        }

        .card-title { font-size: 1.75rem; font-weight: 800; color: #0c4a6e; }

        .close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .close-btn:hover { background: #f0f9ff; }

        .error-msg {
          background: #fee2e2;
          color: #dc2626;
          padding: 16px 20px;
          border-radius: 12px;
          border: 2px solid #fca5a5;
          font-weight: 500;
          margin-bottom: 24px;
        }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
        @media(max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }

        .form-group { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
        .form-label { font-weight: 600; color: #374151; font-size: 16px; }
        .required { color: #ef4444; }

        .form-input, .form-textarea {
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: #f9fafb;
          font-size: 14px;
          transition: all 0.2s;
          font-family: inherit;
          color: #374151;
        }
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .form-input::placeholder, .form-textarea::placeholder {
          color: #9ca3af;
        }
        .form-textarea { min-height: 180px; resize: vertical; }

        .upload-area {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 12px 16px;
          text-align: left;
          background: #f9fafb;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .upload-area:hover {
          border-color: #3b82f6;
          background: white;
        }

        .upload-icon {
          width: 20px;
          height: 20px;
          color: #6b7280;
          margin: 0;
          flex-shrink: 0;
        }

        .upload-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .upload-text p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .upload-text p:first-child {
          font-weight: 500;
          color: #374151;
        }

        .audio-preview {
          margin-top: 16px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #e2e8f0;
          padding: 12px;
          background: #f8fafc;
        }
        .audio-preview audio { width: 100%; }

        .option-row {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 12px;
        }
        .option-input { flex: 1; }

        .correct-toggle {
          position: relative;
          width: 52px;
          height: 28px;
          background: #cbd5e1;
          border-radius: 34px;
          cursor: pointer;
          transition: .3s;
          flex-shrink: 0;
        }
        .correct-toggle.active { background: #10b981; }
        .correct-toggle::after {
          content: "";
          position: absolute;
          width: 22px;
          height: 22px;
          background: white;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: .3s;
        }
        .correct-toggle.active::after { transform: translateX(24px); }

        .remove-btn {
          background: transparent;
          border: none;
          color: #ef4444;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .remove-btn:hover { background: #fee2e2; }

        .add-option-btn {
          background: white;
          border: 2px dashed #94a3b8;
          color: #0ea5e9;
          padding: 12px 20px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .add-option-btn:hover { background: #eff6ff; border-color: #0ea5e9; }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 40px;
          padding-top: 0;
          border-top: none;
        }

        .btn-cancel {
          background: #f1f5f9;
          color: #475569;
          padding: 16px 32px;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          font-size: 15px;
          transition: all 0.2s;
        }
        .btn-cancel:hover { background: #e2e8f0; transform: translateY(-2px); }

        .btn-submit {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: white;
          padding: 16px 48px;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          font-size: 16px;
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
        <button aria-label="Open menu" className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={20} color="#0369a1" />
        </button>

        <div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />

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
              <Settings size={18} />
              <span>Settings</span>
            </button>
            <button className="logout-btn">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="main-content">
          <div className="top-bar">
            <div className="top-bar-left">
              <div className="top-search">
                <Search className="top-search-icon" size={18} />
                <input placeholder="Search questions..." />
              </div>
            </div>
            <div className="top-bar-right">
              <button className="icon-button" title="Notifications">
                <Bell size={22} color="#475569" />
              </button>
              <div className="user-avatar" title="User profile">
                <User size={22} color="white" />
              </div>
            </div>
          </div>

          <div className="content-area">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Add New Question</h2>
                <button
                  className="close-btn"
                  onClick={() => navigate("/admin/questions")}
                >
                  <X size={24} color="#64748b" />
                </button>
              </div>

              {error && <div className="error-msg"><strong>Error:</strong> {error}</div>}

              <div className="form-grid">
                {/* Left Column */}
                <div>
                  <div className="form-group">
                    <label className="form-label">
                      Question Title <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="question"
                      className="form-input"
                      placeholder="Practice test for: Chapter 1"
                      value={formData.question}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Add Feedback</label>
                    <textarea
                      name="feedback"
                      className="form-textarea"
                      placeholder="Enter feedback for this question..."
                      value={formData.feedback}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Upload Audio (optional)</label>
                    <label htmlFor="audio-upload" className="upload-area">
                      <Upload className="upload-icon" />
                      <div className="upload-text">
                        <p>Click to upload or drag and drop</p>
                        <p>MP3, WAV up to 20MB</p>
                      </div>
                      <input
                        id="audio-upload"
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioChange}
                        style={{ display: "none" }}
                      />
                    </label>
                    {formData.audioPreview && (
                      <div className="audio-preview">
                        <audio controls src={formData.audioPreview} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div className="form-group">
                    <label className="form-label">
                      Select Chapter <span className="required">*</span>
                    </label>
                    <select
                      name="chapterId"
                      className="form-input"
                      value={formData.chapterId}
                      onChange={handleChange}
                      disabled={fetchingChapters}
                    >
                      <option value="">{fetchingChapters ? "Loading..." : "Choose a chapter"}</option>
                      {chapters.map((ch) => (
                        <option key={ch.id} value={ch.id}>
                          {ch.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Test Type</label>
                    <select
                      name="testType"
                      className="form-input"
                      value={formData.testType}
                      onChange={handleChange}
                    >
                      <option value="FREE">Free</option>
                      <option value="PAID">Paid</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Answers <span className="required">*</span>
                    </label>
                    {formData.options.map((opt, i) => (
                      <div key={i} className="option-row">
                        <input
                          type="text"
                          className="form-input option-input"
                          placeholder="Enter answer option"
                          value={opt.text}
                          onChange={(e) => updateOption(i, "text", e.target.value)}
                        />
                        <div
                          className={`correct-toggle ${opt.isCorrect ? "active" : ""}`}
                          onClick={() => updateOption(i, "isCorrect", !opt.isCorrect)}
                          title={opt.isCorrect ? "Correct answer" : "Mark as correct"}
                        />
                        {formData.options.length > 1 && (
                          <button
                            className="remove-btn"
                            onClick={() => removeOption(i)}
                            title="Remove option"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button className="add-option-btn" onClick={addOption}>
                      <Plus size={18} /> Add Answer
                    </button>
                  </div>
                </div>
              </div>

              <div className="actions">
                <button
                  className="btn-cancel"
                  onClick={() => navigate("/admin/questions")}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="btn-submit"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Now"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}