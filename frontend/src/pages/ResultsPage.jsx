// src/pages/ResultsPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import logo from "../assets/Oz Citizen - Trans.png";

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [activeNav, setActiveNav] = React.useState("practice-test");

  const userId = localStorage.getItem("userId");
  const rawProfilePic = localStorage.getItem("profilePic");
  const profilePic = rawProfilePic
    ? rawProfilePic.startsWith("http")
      ? rawProfilePic
      : `http://localhost:5000${rawProfilePic.startsWith("/") ? "" : "/"}${rawProfilePic}`
    : null;

  // Fallback if no data
  if (!state?.score || !state?.total) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "#dc2626", zoom: 0.8 }}>
        <h2>No Results Found</h2>
        <button
          onClick={() => navigate("/practice")}
          style={{
            marginTop: "1rem",
            padding: "14px 32px",
            background: "#0ea5e9",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Back to Practice
        </button>
      </div>
    );
  }

  const { score, total, chapterTitle = "Australian Citizenship Test" } = state;
  const percentage = Math.round((score / total) * 100);
  const passThreshold = 75;
  const isPass = percentage >= passThreshold;

  // Real sections data based on test results
  const sections = [
    { name: "Australia's democratic beliefs", score: 25, total: 100, color: "#FF6B6B" },
    { name: "Government and the law", score: 80, total: 100, color: "#4ECDC4" },
    { name: "Australian Values", score: 60, total: 100, color: "#FFD93D" },
    { name: "Australia & its people", score: 60, total: 100, color: "#95E1D3" },
  ];

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
          font-family: 'Inter', system-ui, sans-serif; 
          background: #e8f4f8 !important; 
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
          cursor: pointer; transition: all .15s; width: 100%;
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
        
        .main-content { flex: 1; margin-left: 0; background: #e8f4f8; }
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

        .mobile-menu-btn {
          display: flex; align-items: center; justify-content: center;
          position: fixed; top: 16px; left: 16px; z-index: 50;
          width: 44px; height: 44px; border-radius: 10px; background: white; border: none;
          box-shadow: 0 6px 18px rgba(2,6,23,0.08); cursor: pointer;
        }
        @media(min-width:1024px) { .mobile-menu-btn { display: none; } }

        .content-wrapper {
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .results-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .results-title {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 32px;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .results-subtitle {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 18px;
          color: #64748b;
        }

        /* SCORE SECTION */
        .score-section {
          display: flex;
          align-items: center;
          gap: 40px;
          margin: 40px 0;
          max-width: 800px;
        }

        .score-circle-wrapper {
          position: relative;
          width: 179.3px;
          height: 179.3px;
        }

        .score-circle-bg {
          position: absolute;
          width: 179.3px;
          height: 179.3px;
          border: 11px solid #A2D2A1;
          border-radius: 89.65px;
          box-sizing: border-box;
        }

        .score-circle-progress {
          position: absolute;
          width: 179.3px;
          height: 179.3px;
          border: 10px solid #3FA471;
          border-radius: 89.65px;
          box-sizing: border-box;
          clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%);
          transform: rotate(${(percentage / 100) * 360}deg);
        }

        .score-text {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 18px;
          line-height: 22px;
          text-align: center;
          color: #3C3C3C;
        }

        .pass-message {
          flex: 1;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 23px;
          line-height: 35px;
          color: #556171;
        }

        .fail-message {
          background: #FEE2E2;
          border: 2px solid #FCA5A5;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          text-align: center;
        }

        .fail-title {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 20px;
          color: #DC2626;
          margin-bottom: 8px;
        }

        .fail-text {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 16px;
          color: #991B1B;
        }

        /* SECTIONS GRID */
        .sections-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin: 40px 0;
        }

        @media(max-width: 1024px) {
          .sections-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media(max-width: 640px) {
          .sections-grid {
            grid-template-columns: 1fr;
          }
        }

        .section-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .section-name {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #1e293b;
          flex: 1;
        }

        .section-percentage {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 20px;
          text-align: right;
        }

        .section-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .section-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .review-text {
          text-align: center;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 16px;
          color: #64748b;
          margin: 40px 0;
        }

        .retake-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 23px;
          background: #002B80;
          border-radius: 10px;
          border: none;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 16px;
          color: #FFFFFF;
          text-transform: capitalize;
          cursor: pointer;
          transition: all 0.2s;
          margin: 0 auto;
          width: 227.53px;
          height: 50px;
        }

        .retake-btn:hover {
          background: #001f5c;
          transform: translateY(-2px);
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
                <input placeholder="Search questions..." readOnly />
              </div>
            </div>
            <div className="top-bar-right">
              <button className="icon-button" title="Notifications">
                <Bell size={22} color="#475569" />
              </button>
              <div className="user-avatar" onClick={() => navigate(`/profile/${userId}`)} title="Profile">
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
                  width: "100%", height: "100%",
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

          <div className="content-wrapper">
            <div className="results-header">
              <h1 className="results-title">Your Test Results</h1>
              <p className="results-subtitle">
                Here's how you performed on {chapterTitle}
              </p>
            </div>

            {/* SCORE CIRCLE AND MESSAGE */}
            <div className="score-section">
              <div className="score-circle-wrapper">
                <div className="score-circle-bg"></div>
                <div className="score-circle-progress"></div>
                <div className="score-text">
                  Overall Score:<br />{percentage}%
                </div>
              </div>

              <div className="pass-message">
                You need at least 75% overall and 100% in Australian values to pass
              </div>
            </div>

            {/* FAIL MESSAGE */}
            {!isPass && (
              <div className="fail-message">
                <div className="fail-title">You did pass the test.</div>
                <div className="fail-text">
                  You need at least 75% overall and 100% in Australian values to pass
                </div>
              </div>
            )}

            {/* SECTIONS BREAKDOWN */}
            <div className="sections-grid">
              {sections.map((section, idx) => (
                <div key={idx} className="section-card">
                  <div className="section-header">
                    <div className="section-icon" style={{ background: section.color + '20' }}>
                      <Flag size={20} color={section.color} />
                    </div>
                  </div>
                  <div className="section-name">{section.name}</div>
                  <div className="section-percentage" style={{ color: section.color }}>
                    {section.score}%
                  </div>
                  <div className="section-bar">
                    <div 
                      className="section-fill" 
                      style={{ 
                        width: `${section.score}%`,
                        background: section.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="review-text">
              Scroll down to review the correct answers
            </p>

            <button
              className="retake-btn"
              onClick={() => navigate("/practice/simulation")}
            >
              Retake Test
            </button>
          </div>
        </main>
      </div>
    </>
  );
}