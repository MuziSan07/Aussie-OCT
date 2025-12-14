// src/pages/ChapterPractice.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  ArrowRight,
} from "lucide-react";
import logo from "../assets/Oz Citizen - Trans.png";

export default function ChapterPractice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("practice-test"); // This page = Practice Test

  // User data – exactly like PracticeTest.jsx
  const userId = localStorage.getItem("userId");
  const rawProfilePic = localStorage.getItem("profilePic");
  const profilePic = rawProfilePic
    ? rawProfilePic.startsWith("http")
      ? rawProfilePic
      : `http://localhost:5000${rawProfilePic.startsWith("/") ? "" : "/"}${rawProfilePic}`
    : null;

  const API_CHAPTER = `http://localhost:5000/api/chapters/${id}`;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchChapter = async () => {
      try {
        setError("");
        setLoading(true);
        const res = await fetch(API_CHAPTER);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Chapter not found");
          throw new Error("Failed to load chapter");
        }
        const data = await res.json();
        setChapter(data);
        setTotalQuestions(data.questions?.length || 0);
        setTo(Math.min(10, data.questions?.length || 10));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [id, userId, navigate]);

  const handleStart = async () => {
    if (from < 1 || to > totalQuestions || from > to) {
      alert("Please select a valid question range");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/chapters/${id}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: from, end: to }),
      });

      if (!res.ok) throw new Error("Failed to generate quiz");
      const quizData = await res.json();

      navigate(`/practice/test/${id}`, {
        state: {
          quizQuestions: quizData.quizQuestions,
          chapterTitle: quizData.title,
          totalQuestions: quizData.totalQuestions,
        },
      });
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Updated Navigation — Exactly matches PracticeTest.jsx
  const navItems = [
    { id: "overview",        label: "Overview",          icon: Home,     path: `/profile/${userId}` },
    { id: "practice-test",   label: "Practice Test",     icon: BookOpen, path: "/practice" },
    { id: "simulation",      label: "Simulation Test",   icon: Trophy,   path: "/practice/simulation" },
    { id: "flagged",         label: "Flagged Questions", icon: Flag,     path: "/practice/flagged" },
  ];

  const handleNavigation = (item) => {
    setActiveNav(item.id);
    setSidebarOpen(false);
    navigate(item.path);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b", fontSize: "1.2rem" }}>
        Loading chapter details...
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "#dc2626" }}>
        <h2>{error || "Chapter not found"}</h2>
        <button
          onClick={() => navigate("/practice")}
          style={{
            marginTop: "1rem",
            padding: "12px 28px",
            background: "#0ea5e9",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Back to Practice Tests
        </button>
      </div>
    );
  }

  const imageUrl = chapter.image
    ? chapter.image.startsWith("http")
      ? chapter.image
      : `http://localhost:5000${chapter.image.startsWith("/") ? "" : "/"}${chapter.image}`
    : "https://images.unsplash.com/photo-1497633765639-fdbc48c1a63b?w=800&q=80";

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
          background: #f0f9ff !important;
          color: #0b2447;
        }
        .dashboard-container { display: flex; min-height: 100vh; }

        /* SIDEBAR */
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
        .main-content { flex: 1; margin-left: 0; }
        @media(min-width:1024px) { .main-content { margin-left: 240px; } }

        /* TOP BAR */
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
        .user-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .mobile-menu-btn {
          display: flex; align-items: center; justify-content: center;
          position: fixed; top: 16px; left: 16px; z-index: 50;
          width: 44px; height: 44px; border-radius: 10px; background: white; border: none;
          box-shadow: 0 6px 18px rgba(2,6,23,0.08); cursor: pointer;
        }
        @media(min-width:1024px) { .mobile-menu-btn { display: none; } }

        .content-area { padding: 28px; max-width: 1280px; margin: 0 auto; width: 100%; }
        .page-header { margin-bottom: 32px; }
        .title { font-size: 1.75rem; font-weight: 800; color: #0c4a6e; }
        .chapter-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; align-items: start; }
        @media(max-width:1024px) { .chapter-layout { grid-template-columns: 1fr; } }

        .chapter-info-card {
          background: white; border-radius: 20px; overflow: hidden;
          border: 2px solid #bae6fd;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15), 0 25px 60px rgba(0,0,0,0.12);
        }
        .chapter-img { width: 100%; height: 260px; object-fit: cover; }
        .info-content { padding: 32px; }
        .chapter-title { font-size: 1.75rem; font-weight: 800; color: #0c4a6e; margin-bottom: 12px; }
        .chapter-desc { font-size: 1.05rem; line-height: 1.7; color: #475569; margin-bottom: 20px; }
        .question-count { font-size: 1.1rem; font-weight: 600; color: #1e40af; }

        .range-card {
          background: white; border-radius: 20px; padding: 32px;
          border: 2px solid #bae6fd;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15), 0 25px 60px rgba(0,0,0,0.12);
          height: fit-content;
        }
        .range-title { font-size: 1.5rem; font-weight: 800; color: #0c4a6e; margin-bottom: 24px; }
        .range-inputs { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
        .range-inputs label { font-weight: 600; color: #374151; width: 60px; }
        .range-inputs input {
          width: 110px; padding: 12px; border: 1px solid #cbd5e1; border-radius: 12px;
          text-align: center; font-size: 1.1rem; font-weight: 600;
        }
        .range-info { color: #64748b; font-size: 1rem; margin-bottom: 32px; }
        .start-btn {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: white; padding: 18px; border: none; border-radius: 16px;
          font-size: 1.2rem; font-weight: 700; cursor: pointer; width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 12px;
          transition: all 0.35s;
        }
        .start-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(14,165,233,0.4);
        }
      `}</style>

      <div className="dashboard-container">
        {/* Mobile Menu Button */}
        <button aria-label="Open menu" className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={20} color="#0369a1" />
        </button>

        {/* Overlay */}
        <div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />

        {/* Sidebar — Now identical to PracticeTest.jsx */}
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

        {/* Main Content */}
        <main className="main-content">
          {/* Top Bar */}
          <div className="top-bar">
            <div className="top-bar-left">
              <div className="top-search">
                <Search className="top-search-icon" size={18} />
                <input placeholder="Search chapters..." readOnly />
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

          {/* Page Content */}
          <div className="content-area">
            <div className="page-header">
              <h2 className="title">Practice Test: {chapter.title}</h2>
            </div>

            <div className="chapter-layout">
              {/* Left – Chapter Info */}
              <div className="chapter-info-card">
                <img src={imageUrl} alt={chapter.title} className="chapter-img" />
                <div className="info-content">
                  <h1 className="chapter-title">{chapter.title}</h1>
                  <p className="chapter-desc">
                    {chapter.subtitle || "Prepare yourself with real practice questions from this chapter."}
                  </p>
                  <p className="question-count">
                    Total Questions: <strong>{totalQuestions}</strong>
                  </p>
                </div>
              </div>

              {/* Right – Range Selector */}
              <div className="range-card">
                <h3 className="range-title">Select Question Range</h3>

                <div className="range-inputs">
                  <label>From:</label>
                  <input
                    type="number"
                    min="1"
                    max={totalQuestions}
                    value={from}
                    onChange={(e) => setFrom(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <label>To:</label>
                  <input
                    type="number"
                    min={from}
                    max={totalQuestions}
                    value={to}
                    onChange={(e) => setTo(Math.min(totalQuestions, parseInt(e.target.value) || from))}
                  />
                </div>

                <p className="range-info">
                  You will answer <strong>{to - from + 1}</strong> questions out of{" "}
                  <strong>{totalQuestions}</strong> available.
                </p>

                <button className="start-btn" onClick={handleStart}>
                  Start Practice Test <ArrowRight size={22} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}