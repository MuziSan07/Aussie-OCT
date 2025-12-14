// src/pages/FlaggedQuestionsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  Home,
  BookOpen,
  Trophy,
  Flag,
  Settings,
  LogOut,
  Bell,
  User,
  Trash2,
  Edit3,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import logo from "../assets/Oz Citizen - Trans.png";

export default function FlaggedQuestionsPage() {
  const navigate = useNavigate();
  const [flagged, setFlagged] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("flagged");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [tempNote, setTempNote] = useState("");

  const userId = localStorage.getItem("userId");
  const rawProfilePic = localStorage.getItem("profilePic");
  const profilePic = rawProfilePic
    ? rawProfilePic.startsWith("http")
      ? rawProfilePic
      : `http://localhost:5000${rawProfilePic.startsWith("/") ? "" : "/"}${rawProfilePic}`
    : null;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchFlagged();
  }, [userId, navigate]);

  const fetchFlagged = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`http://localhost:5000/api/flagged/${userId}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load flagged questions");
      setFlagged(data.data || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const removeFlag = async (bookmarkId) => {
    if (!window.confirm("Are you sure you want to remove this flagged question?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/flagged/${bookmarkId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setFlagged(flagged.filter((f) => f.id !== bookmarkId));
      }
    } catch (err) {
      alert("Failed to remove flag");
    }
  };

  const startEditNote = (item) => {
    setEditingNoteId(item.id);
    setTempNote(item.note || "");
  };

  const saveNote = async (bookmarkId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/flagged/note/${bookmarkId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: tempNote }),
      });
      if (res.ok) {
        setFlagged(flagged.map((f) => (f.id === bookmarkId ? { ...f, note: tempNote } : f)));
        setEditingNoteId(null);
      }
    } catch (err) {
      alert("Failed to save note");
    }
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setTempNote("");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleNavigation = (id) => {
    const routes = {
      overview: '/user-overview',
      'practice-test': '/practice',
      simulation: '/practice/simulation',
      flagged: '/practice/flagged'
    };
    
    setActiveNav(id);
    setSidebarOpen(false);
    
    if (routes[id]) {
      navigate(routes[id]);
    }
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "practice-test", label: "Practice Test", icon: BookOpen },
    { id: "simulation", label: "Simulation Test", icon: Trophy },
    { id: "flagged", label: "Flagged Questions", icon: Flag },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif; 
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
          transform: translateX(-110%); 
          transition: transform .28s cubic-bezier(.2,.9,.3,1); 
          border-right: 1px solid #bae6fd; 
        }
        .sidebar.open { transform: translateX(0); }
        @media(min-width:1024px) { 
          .sidebar { transform: translateX(0); width: 240px !important; } 
          .main-content { margin-left: 240px !important; } 
        }

        .logo-container { text-align: left; padding: 8px 0; margin-bottom: 12px; }
        .logo-img { height: 50px; object-fit: contain; filter: drop-shadow(0 6px 12px rgba(3,105,161,0.08)); }

        .nav { display: flex; flex-direction: column; gap: 6px; }
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
          transition: all .15s; 
          width: 100%; 
        }
        .nav-item svg { stroke: #1e40af; }
        .nav-item:hover { background: #bae6fd; }
        .nav-item.active { background: #0ea5e9; color: white; }
        .nav-item.active svg { stroke: white; }

        .logout-section { 
          margin-top: auto; 
          padding-top: 12px; 
          display: flex; 
          flex-direction: column; 
          gap: 8px; 
        }
        .settings-btn, .logout-btn { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          padding: 10px; 
          border-radius: 10px;
          border: none; 
          background: transparent; 
          font-weight: 700; 
          cursor: pointer; 
          width: 100%; 
        }
        .settings-btn { color: #1e40af; } 
        .settings-btn:hover { background: #bae6fd; }
        .logout-btn { color: #ef4444; } 
        .logout-btn:hover { background: #fff0f1; }

        .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 35; }
        .sidebar-overlay.show { display: block; }
        @media(min-width:1024px) { .sidebar-overlay { display: none !important; } }

        .main-content { flex: 1; margin-left: 0; }
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

        .top-bar-right { display: flex; align-items: center; gap: 14px; }
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
        .icon-button:hover { background: #bae6fd; }
        .user-avatar { 
          width: 40px; 
          height: 40px; 
          border-radius: 50%; 
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          display: flex; 
          align-items: center; 
          justify-content: center; 
          cursor: pointer; 
          overflow: hidden; 
          position: relative; 
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
        @media(min-width:1024px) { .mobile-menu-btn { display: none; } }

        .content-area { padding: 32px; max-width: 1200px; margin: 0 auto; width: 100%; }
        .page-title { font-size: 2rem; font-weight: 800; color: #0c4a6e; margin-bottom: 32px; }

        .flagged-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 20px; 
        }

        @media(min-width: 1400px) {
          .flagged-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .flag-card {
          background: white; 
          border-radius: 20px; 
          overflow: hidden; 
          border: 2px solid #bae6fd;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15), 0 25px 60px rgba(0,0,0,0.12); 
          transition: all 0.35s;
        }
        .flag-card:hover { 
          transform: translateY(-10px); 
          box-shadow: 0 25px 60px rgba(0,0,0,0.22); 
        }

        .card-header { 
          padding: 20px; 
          background: #f0fdfa; 
          border-bottom: 2px solid #86efac; 
        }
        .chapter-title { 
          font-size: 1.1rem; 
          font-weight: 700; 
          color: #0c4a6e; 
        }

        .question-text { 
          padding: 24px; 
          font-size: 1.25rem; 
          line-height: 1.7; 
          color: #0c4a6e; 
          font-weight: 600; 
        }

        .note-section { padding: 0 24px 20px; }
        .note-display { 
          background: #f8fafc; 
          padding: 14px; 
          border-radius: 12px; 
          border: 1px dashed #94a3b8; 
          color: #475569; 
          min-height: 60px; 
        }
        .note-edit { display: flex; gap: 8px; }
        .note-input { 
          flex: 1; 
          padding: 12px; 
          border: 1px solid #cbd5e1; 
          border-radius: 10px; 
          font-size: 1rem; 
        }
        .note-actions { 
          display: flex; 
          justify-content: flex-end; 
          gap: 8px; 
          margin-top: 12px; 
        }
        .btn-small { 
          padding: 8px 16px; 
          border-radius: 10px; 
          font-weight: 600; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          gap: 6px; 
          border: none;
          transition: all 0.2s;
        }
        .btn-small:hover {
          transform: translateY(-2px);
        }
        .btn-edit { background: #dbeafe; color: #1e40af; }
        .btn-delete { background: #fee2e2; color: #dc2626; }
        .btn-save { background: #22c55e; color: white; }
        .btn-cancel { background: #e2e8f0; color: #475569; }

        .empty-state { 
          text-align: center; 
          padding: 4rem 2rem; 
          color: #64748b; 
        }
        .empty-icon { 
          width: 90px; 
          height: 90px; 
          margin: 0 auto 1rem; 
          color: #cbd5e1; 
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
            <button className="settings-btn" onClick={() => navigate("/settings")}>
              <Settings size={18} /> <span>Settings</span>
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} /> <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="main-content">
          <div className="top-bar">
            <div className="top-bar-left">
              <div className="top-search">
                <Search className="top-search-icon" size={18} />
                <input placeholder="Search flagged questions..." readOnly />
              </div>
            </div>
            <div className="top-bar-right">
              <button className="icon-button">
                <Bell size={22} color="#475569" />
              </button>
              <div className="user-avatar" onClick={() => navigate(`/profile/${userId}`)}>
                {profilePic ? (
                  <img 
                    src={profilePic} 
                    alt="Profile" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { 
                      e.target.style.display = "none"; 
                      e.target.nextElementSibling.style.display = "flex"; 
                    }} 
                  />
                ) : null}
                <div style={{ 
                  width: "100%", 
                  height: "100%", 
                  background: "linear-gradient(135deg, #0ea5e9, #0284c7)", 
                  display: profilePic ? "none" : "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}>
                  <User size={22} color="white" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-area">
            <h1 className="page-title">Flagged Questions ({flagged.length})</h1>

            {loading ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "#64748b" }}>
                Loading your flagged questions...
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "3rem", background: "#fee2e2", color: "#dc2626", borderRadius: 16 }}>
                {error}
              </div>
            ) : flagged.length === 0 ? (
              <div className="empty-state">
                <AlertCircle className="empty-icon" />
                <h3>No flagged questions yet</h3>
                <p style={{ marginTop: "0.5rem" }}>Questions you flag during practice will appear here.</p>
              </div>
            ) : (
              <div className="flagged-grid">
                {flagged.map((item) => (
                  <div key={item.id} className="flag-card">
                    <div className="card-header">
                      <div className="chapter-title">
                        {item.chapter?.title || "Unknown Chapter"}
                      </div>
                    </div>
                    <div className="question-text">{item.question.question}</div>
                    <div className="note-section">
                      {editingNoteId === item.id ? (
                        <div>
                          <div className="note-edit">
                            <input
                              type="text"
                              className="note-input"
                              value={tempNote}
                              onChange={(e) => setTempNote(e.target.value)}
                              placeholder="Add a note (optional)"
                            />
                          </div>
                          <div className="note-actions">
                            <button className="btn-small btn-save" onClick={() => saveNote(item.id)}>
                              <Check size={16} /> Save
                            </button>
                            <button className="btn-small btn-cancel" onClick={cancelEdit}>
                              <X size={16} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="note-display">
                            {item.note || <em style={{ color: "#94a3b8" }}>No note added</em>}
                          </div>
                          <div className="note-actions">
                            <button className="btn-small btn-edit" onClick={() => startEditNote(item)}>
                              <Edit3 size={16} /> Edit Note
                            </button>
                            <button className="btn-small btn-delete" onClick={() => removeFlag(item.id)}>
                              <Trash2 size={16} /> Remove Flag
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}