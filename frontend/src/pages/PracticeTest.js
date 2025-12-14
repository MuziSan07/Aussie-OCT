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
  TrendingUp,
} from "lucide-react";
import logo from "../assets/Oz Citizen - Trans.png";

export default function PracticeTest() {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("practice-test");

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
    }
  }, [userId, navigate]);

  const API_URL = `http://localhost:5000/api/practice${userId ? `?userId=${userId}` : ""}`;

  useEffect(() => {
    if (userId) {
      fetchChapters();
    }
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [userId]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChapters(chapters);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = chapters.filter((ch) => {
        const title = (ch.title || "").toLowerCase();
        const subtitle = (ch.subtitle || "").toLowerCase();
        const description = (ch.description || "").toLowerCase();
        return title.includes(query) || subtitle.includes(query) || description.includes(query);
      });
      setFilteredChapters(filtered);
    }
  }, [searchQuery, chapters]);

  const fetchChapters = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setChapters(data);
      setFilteredChapters(data);
    } catch (err) {
      const msg = err.message || "Failed to load chapters";
      setError(
        msg.includes("Failed to fetch")
          ? "Cannot connect to server. Is your backend running on port 5000?"
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Home, path: "/user-overview" },
    { id: "practice-test", label: "Practice Test", icon: BookOpen, path: "/practice" },
    { id: "simulation", label: "Simulation Test", icon: Trophy, path: "/practice/simulation" },
    { id: "flagged", label: "Flagged Questions", icon: Flag, path: "/practice/flagged" },
  ];

  const handleNavigation = (item) => {
    setActiveNav(item.id);
    setSidebarOpen(false);
    navigate(item.path);
  };

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

        .sidebar {
          width: 240px !important;
          background: #dbeafe;
          position: fixed; top: 0; left: 0; bottom: 0; z-index: 40;
          padding: 20px 16px; display: flex; flex-direction: column; gap: 12px;
          transform: translateX(-110%); transition: transform .28s cubic-bezier(.2,.9,.3,1);
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
          display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px;
          color: #1e40af; font-weight: 600; font-size: 15px; background: transparent; border: none;
          cursor: pointer; transition: all .15s; width: 100%; text-decoration: none;
        }
        .nav-item svg { stroke: #1e40af; }
        .nav-item:hover { background: #bae6fd; }
        .nav-item.active { background: #0ea5e9; color: white; }
        .nav-item.active svg { stroke: white; }

        .logout-section { margin-top: auto; padding-top: 12px; display: flex; flex-direction: column; gap: 8px; }
        .settings-btn, .logout-btn { 
          display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; 
          border: none; background: transparent; font-weight: 700; cursor: pointer; width: 100%;
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

        .top-bar {
          background: #dbeafe !important;
          padding: 18px 24px !important;
          min-height: 78px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 30;
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
          display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
        .icon-button:hover { background: #bae6fd; }
        .user-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; overflow: hidden; position: relative;
        }

        .content-area { padding: 20px; }
        @media(min-width:1024px) { .content-area { padding: 28px; } }

        .mobile-menu-btn {
          display: flex; align-items: center; justify-content: center;
          position: fixed; top: 16px; left: 16px; z-index: 50;
          width: 44px; height: 44px; border-radius: 10px; background: white; border: none;
          box-shadow: 0 6px 18px rgba(2,6,23,0.08); cursor: pointer;
        }
        @media(min-width:1024px) { .mobile-menu-btn { display: none; } }

        .page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 32px; }
        .title { font-size: 1.75rem; font-weight: 800; color: #0c4a6e; margin: 0; }

        .right-section { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .filter-tag { display: flex; align-items: center; gap: 7px; padding: 7px 14px; background: #f8fafc;
          border: 1px solid #e2e8f0; border-radius: 10px; color: #475569; font-size: 14px; font-weight: 500; white-space: nowrap; }
        .filter-tag svg { width: 16px; height: 16px; color: #64748b; }
        .badge { background: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }

        .test-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(300px,1fr)); gap: 24px; }

        .chapter-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          border: 2px solid #bae6fd;
          transition: all .35s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 
            0 10px 30px rgba(0,0,0,0.15),
            0 25px 60px rgba(0,0,0,0.12),
            0 4px 12px rgba(0,0,0,0.08);
          cursor: pointer;
        }
        .chapter-card:hover {
          transform: translateY(-14px);
          box-shadow: 
            0 25px 60px rgba(0,0,0,0.22),
            0 45px 90px rgba(0,0,0,0.18),
            0 12px 24px rgba(0,0,0,0.14);
          border-color: #7dd3fc;
        }

        .chapter-img { width: 100%; height: 180px; object-fit: cover; display: block; }
        .card-content { padding: 20px; }
        .chapter-title { font-size: 1.25rem; font-weight: 700; color: #0c4a6e; margin: 0 0 6px; }
        .sessions-label { font-size: .925rem; color: #64748b; margin: 0 0 16px; }
        .bottom-row { display: flex; align-items: center; justify-content: space-between; }
        .session-count { font-size: .95rem; color: #475569; font-weight: 600; }
        
        .progress-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }
        .progress-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: #ecfdf5;
          border: 1px solid #6ee7b7;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #059669;
        }
        .score-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: #eff6ff;
          border: 1px solid #93c5fd;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #1d4ed8;
        }

        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
          font-size: 1.1rem;
        }
        .no-results-icon {
          width: 80px;
          height: 80px;
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
                  onClick={() => handleNavigation(item)}
                  aria-pressed={activeNav === item.id}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="logout-section">
            <button className="settings-btn" onClick={() => navigate("/settings")}>
              <Settings size={18} />
              <span>Settings</span>
            </button>
            <button className="logout-btn" onClick={handleLogout}>
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
                <input
                  placeholder="Search practice tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="top-bar-right">
              <button className="icon-button" title="Notifications">
                <Bell size={22} color="#475569" />
              </button>
              <div 
                className="user-avatar" 
                title="User profile" 
                onClick={() => navigate(`/profile/${userId}`)}
                style={{ cursor: "pointer", overflow: "hidden", position: "relative" }}
              >
                {profilePic ? (
                  <img 
                    src={profilePic} 
                    alt="Profile Picture" 
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover", 
                      borderRadius: "50%" 
                    }}
                    onError={(e) => { 
                      e.target.style.display = "none"; 
                      e.target.nextSibling.style.display = "flex"; 
                    }}
                  />
                ) : null}
                <div style={{ 
                  width: "100%", 
                  height: "100%", 
                  display: profilePic ? "none" : "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                  borderRadius: "50%"
                }}>
                  <User size={22} color="white" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-area">
            <div className="page-header">
              <h2 className="title">Practice Tests</h2>
              <div className="right-section">
                <div className="filter-tag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                  All Category
                </div>
                <div className="filter-tag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 19.5z"/>
                    <path d="M8 7h8M8 12h8M8 17h4"/>
                  </svg>
                  Chapters
                  <span className="badge">{chapters.length}</span>
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b" }}>
                Loading practice tests...
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "2rem", background: "#fee2e2", color: "#dc2626", borderRadius: 12 }}>
                {error}
              </div>
            ) : filteredChapters.length === 0 ? (
              <div className="no-results">
                <Search className="no-results-icon" />
                <div>No tests found matching "{searchQuery}"</div>
                <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Try adjusting your search terms
                </div>
              </div>
            ) : (
              <div className="test-grid">
                {filteredChapters.map((ch) => {
                  const imageUrl = ch.image
                    ? ch.image.startsWith("http")
                      ? ch.image
                      : `http://localhost:5000${ch.image.startsWith("/") ? "" : "/"}${ch.image}`
                    : "https://images.unsplash.com/photo-1497633765639-fdbc48c1a63b?w=800&q=80";

                  return (
                    <article
                      key={ch.id}
                      className="chapter-card"
                      onClick={() => navigate(`/practice/chapter/${ch.id}`)}
                    >
                      <img src={imageUrl} alt={ch.title} className="chapter-img" />
                      <div className="card-content">
                        <h3 className="chapter-title">
                          Practice Test: {ch.title || `Chapter ${ch.id}`}
                        </h3>
                        <p className="sessions-label">{ch.subtitle || "Test your knowledge"}</p>
                        <div className="bottom-row">
                          <span className="session-count">
                            {ch.questionCount || 0} Questions
                          </span>
                        </div>
                        {ch.userProgress && (
                          <div className="progress-info">
                            <div className="progress-badge">
                              <TrendingUp size={14} />
                              {Math.round(ch.userProgress.progressPercentage)}% Complete
                            </div>
                          </div>
                        )}
                        {ch.lastScore !== null && (
                          <div className="progress-info">
                            <div className="score-badge">
                              <Trophy size={14} />
                              Last Score: {Math.round(ch.lastScore)}%
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}