// src/pages/TestPage.jsx
import React, { useState, useEffect } from "react";
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
  ArrowLeft,
  ArrowRight,
  Volume2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import logo from "../assets/Oz Citizen - Trans.png";

export default function TestPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.quizQuestions) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "#dc2626", fontSize: "1.3rem" }}>
        <h2>No quiz data found</h2>
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
          Back to Practice Tests
        </button>
      </div>
    );
  }

  const { quizQuestions, chapterTitle, totalQuestions } = state;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("practice-test");
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [audioPlaying, setAudioPlaying] = useState(false);

  const q = quizQuestions[currentIdx];
  const progress = currentIdx + 1;

  // User data
  const userId = localStorage.getItem("userId");
  const rawProfilePic = localStorage.getItem("profilePic");
  const profilePic = rawProfilePic
    ? rawProfilePic.startsWith("http")
      ? rawProfilePic
      : `http://localhost:5000${rawProfilePic.startsWith("/") ? "" : "/"}${rawProfilePic}`
    : null;

  // Load flagged questions on mount
  useEffect(() => {
    if (userId) {
      loadFlaggedQuestions();
    }
  }, [userId]);

  const loadFlaggedQuestions = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/flagged/${userId}`);
      const data = await res.json();
      if (data.success) {
        const flaggedIds = new Set(data.data.map(f => f.question.id));
        setFlaggedQuestions(flaggedIds);
      }
    } catch (err) {
      console.error("Error loading flagged questions:", err);
    }
  };

  const handleToggleFlag = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/flagged/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parseInt(userId),
          questionId: q.id
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setFlaggedQuestions(prev => {
          const newSet = new Set(prev);
          if (data.flagged) {
            newSet.add(q.id);
          } else {
            newSet.delete(q.id);
          }
          return newSet;
        });
      }
    } catch (err) {
      console.error("Error toggling flag:", err);
    }
  };

  const handlePlayAudio = () => {
    if (q.audio) {
      setAudioPlaying(true);
      const audioUrl = q.audio.startsWith("http") 
        ? q.audio 
        : `http://localhost:5000${q.audio}`;
      
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => setAudioPlaying(false);
      audio.onerror = () => {
        setAudioPlaying(false);
        alert("Error playing audio");
      };
    }
  };

  const handleCheck = () => {
    if (!selected) return alert("Please select an answer");
    const correct = q.options.find((o) => o.isCorrect);
    const right = selected === correct.id;
    setIsCorrect(right);
    setShowResult(true);
    if (right) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      navigate("/practice/results", {
        state: { score, total: totalQuestions, chapterTitle },
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Home, path: `/profile/${userId}` },
    { id: "practice-test", label: "Practice Test", icon: BookOpen, path: "/practice" },
    { id: "simulation", label: "Simulation Test", icon: Trophy, path: "/practice/simulation" },
    { id: "flagged", label: "Flagged Questions", icon: Flag, path: "/practice/flagged" },
  ];

  const handleNavigation = (item) => {
    setActiveNav(item.id);
    setSidebarOpen(false);
    navigate(item.path);
  };

  const isFlagged = flaggedQuestions.has(q.id);

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
        
        .content-area { padding: 32px; max-width: 1000px; margin: 0 auto; width: 100%; }
        
        .quiz-header {
          background: white; border-radius: 20px; padding: 28px;
          border: 2px solid #bae6fd; box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center;
        }
        .quiz-header-left {
          flex: 1;
        }
        .quiz-title { font-size: 1.8rem; font-weight: 800; color: #0c4a6e; margin-bottom: 8px; }
        .quiz-progress { font-size: 1.1rem; color: #64748b; font-weight: 500; }
        
        .flag-btn {
          padding: 12px 20px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          background: white;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 600;
          color: #64748b;
        }
        .flag-btn:hover {
          border-color: #fbbf24;
          background: #fffbeb;
          color: #f59e0b;
        }
        .flag-btn.flagged {
          border-color: #fbbf24;
          background: #fef3c7;
          color: #f59e0b;
        }
        
        .quiz-card {
          background: white; border-radius: 20px; padding: 40px;
          border: 2px solid #bae6fd;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15), 0 25px 60px rgba(0,0,0,0.12);
        }
        .question {
          font-size: 1.4rem; line-height: 1.7; color: #0c4a6e;
          font-weight: 600; margin-bottom: 32px;
        }
        .audio-btn {
          display: inline-flex; align-items: center; gap: 10px;
          color: #0ea5e9; font-weight: 600; cursor: pointer;
          margin-bottom: 32px; padding: 12px 20px; font-size: 1.05rem;
          border: 2px solid #bae6fd;
          border-radius: 12px;
          background: #f0f9ff;
          transition: all 0.3s;
        }
        .audio-btn:hover {
          background: #e0f2fe;
          border-color: #7dd3fc;
        }
        .audio-btn.playing {
          background: #0ea5e9;
          color: white;
          border-color: #0ea5e9;
        }
        .options { display: flex; flex-direction: column; gap: 18px; margin-bottom: 40px; }
        .option {
          display: flex; align-items: center; gap: 18px; padding: 20px 24px;
          border: 2px solid #e2e8f0; border-radius: 16px; background: #f8fafc;
          cursor: pointer; transition: all 0.3s; font-size: 1.15rem;
        }
        .option:hover { border-color: #7dd3fc; background: #f0fdfa; }
        .option input { accent-color: #0ea5e9; width: 24px; height: 24px; }
        .option.selected { border-color: #0ea5e9; background: #eff6ff; }
        .option.correct { border-color: #22c55e; background: #f0fdf4; }
        .option.incorrect { border-color: #ef4444; background: #fef2f2; }
        .feedback {
          padding: 20px 24px; border-radius: 16px; font-weight: 600;
          display: flex; align-items: center; gap: 14px; font-size: 1.25rem;
          margin-bottom: 40px;
        }
        .feedback.correct { background: #f0fdf4; color: #166534; border: 2px solid #86efac; }
        .feedback.incorrect { background: #fef2f2; color: #991b1b; border: 2px solid #fca5a5; }
        .btn-group {
          display: flex; justify-content: space-between; gap: 20px;
        }
        .btn {
          padding: 16px 32px; border-radius: 14px; font-weight: 700;
          font-size: 1.1rem; cursor: pointer; display: flex;
          align-items: center; gap: 12px; flex: 1; justify-content: center;
          transition: all 0.35s; border: none;
        }
        .btn-back {
          background: #f1f5f9; color: #475569; border: 2px solid #cbd5e1;
        }
        .btn-back:hover { background: #e2e8f0; }
        .btn-check {
          background: #1e40af; color: white;
        }
        .btn-check:hover { background: #1d4ed8; transform: translateY(-3px); }
        .btn-next {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: white;
        }
        .btn-next:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(14,165,233,0.4);
        }
      `}</style>

      <div className="dashboard-container">
        {/* Mobile Menu */}
        <button aria-label="Open menu" className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={20} color="#0369a1" />
        </button>

        {/* Overlay */}
        <div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />

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

        {/* Main */}
        <main className="main-content">
          {/* Top Bar */}
          <div className="top-bar">
            <div className="top-bar-left">
              <div className="top-search">
                <Search className="top-search-icon" size={18} />
                <input placeholder="Search in test..." readOnly />
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
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                    display: profilePic ? "none" : "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User size={22} color="white" />
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Content */}
          <div className="content-area">
            <div className="quiz-header">
              <div className="quiz-header-left">
                <h1 className="quiz-title">Practice Test: {chapterTitle}</h1>
                <p className="quiz-progress">
                  Question <strong>{progress}</strong> of <strong>{totalQuestions}</strong>
                </p>
              </div>
              <button
                className={`flag-btn ${isFlagged ? "flagged" : ""}`}
                onClick={handleToggleFlag}
                title={isFlagged ? "Remove flag" : "Flag this question"}
              >
                <Flag size={20} fill={isFlagged ? "#f59e0b" : "none"} />
                {isFlagged ? "Flagged" : "Flag"}
              </button>
            </div>

            <div className="quiz-card">
              <div className="question">{q.question}</div>

              {/* Show audio button only if audio exists */}
              {q.audio && (
                <button
                  className={`audio-btn ${audioPlaying ? "playing" : ""}`}
                  onClick={handlePlayAudio}
                  disabled={audioPlaying}
                >
                  <Volume2 size={24} />
                  {audioPlaying ? "Playing Audio..." : "Play Audio Question"}
                </button>
              )}

              <div className="options">
                {q.options.map((opt) => (
                  <label
                    key={opt.id}
                    className={`option ${
                      selected === opt.id
                        ? "selected"
                        : showResult && opt.isCorrect
                        ? "correct"
                        : showResult && selected === opt.id && !opt.isCorrect
                        ? "incorrect"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      checked={selected === opt.id}
                      onChange={() => setSelected(opt.id)}
                      disabled={showResult}
                    />
                    {opt.text}
                  </label>
                ))}
              </div>

              {showResult && (
                <div className={`feedback ${isCorrect ? "correct" : "incorrect"}`}>
                  {isCorrect ? <CheckCircle size={30} /> : <XCircle size={30} />}
                  {q.feedback || (isCorrect ? "Correct! Excellent work." : "Incorrect. Keep practicing!")}
                </div>
              )}

              <div className="btn-group">
                <button className="btn btn-back" onClick={() => navigate(-1)}>
                  <ArrowLeft size={22} /> Back
                </button>
                {!showResult ? (
                  <button className="btn btn-check" onClick={handleCheck}>
                    Check Answer
                  </button>
                ) : (
                  <button className="btn btn-next" onClick={handleNext}>
                    {currentIdx < totalQuestions - 1 ? "Next Question" : "Finish Test"} <ArrowRight size={22} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}