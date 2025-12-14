// src/pages/SimulationTest.jsx
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
} from "lucide-react";
import logo from "../assets/Oz Citizen - Trans.png";

export default function SimulationTest() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(40 * 60);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("simulation");

  const userId = localStorage.getItem("userId");
  const rawProfilePic = localStorage.getItem("profilePic");
  const profilePic = rawProfilePic
    ? rawProfilePic.startsWith("http")
      ? rawProfilePic
      : `http://localhost:5000${rawProfilePic.startsWith("/") ? "" : "/"}${rawProfilePic}`
    : null;

  const API = "http://localhost:5000/api/stimulation-test?limit=30";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setError("");
        setLoading(true);
        const res = await fetch(API);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load questions");

        const qs = Array.isArray(data.questions) ? data.questions : [];
        if (qs.length === 0) throw new Error("No questions available");

        setQuestions(qs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (loading || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, questions]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (optionId) => {
    setAnswers({ ...answers, [currentIdx]: optionId });
  };

  const goToQuestion = (idx) => {
    setCurrentIdx(idx);
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      const selectedOptionId = answers[idx];
      if (selectedOptionId) {
        const correctOption = q.options.find((opt) => opt.isCorrect);
        if (correctOption && correctOption.id === selectedOptionId) {
          score++;
        }
      }
    });

    navigate("/practice/results", {
      state: { 
        score, 
        total: questions.length, 
        chapterTitle: "Simulation Test",
        timeSpent: 40 * 60 - timeRemaining 
      },
    });
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

  if (loading) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "4rem", 
        color: "#64748b", 
        fontSize: "1.3rem",
        zoom: 0.8 
      }}>
        Loading Simulation Test...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "4rem", 
        color: "#dc2626",
        zoom: 0.8 
      }}>
        <h2>{error}</h2>
        <button
          onClick={() => window.location.reload()}
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
          Retry
        </button>
      </div>
    );
  }

  const q = questions[currentIdx];
  const totalQuestions = questions.length;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif; 
          background: #e8f4f8 !important; 
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
          padding: 30px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .test-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .header-title {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 20px;
          color: #002B80;
          text-transform: capitalize;
        }

        .timer-container {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .timer-label {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 20px;
          color: #002B80;
          text-transform: capitalize;
        }

        .timer-box {
          background: rgba(224, 240, 255, 0.7);
          border: 0.6px solid #A8A8A8;
          box-shadow: 0px 3px 28px rgba(0, 0, 0, 0.11);
          border-radius: 6px;
          padding: 8px 16px;
        }

        .timer-value {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 18px;
          color: #1A1818;
          text-align: center;
        }

        .test-layout {
          display: grid;
          grid-template-columns: 313px 1fr;
          gap: 30px;
          align-items: start;
        }

        @media(max-width: 1024px) {
          .test-layout {
            grid-template-columns: 1fr;
          }
        }

        /* QUESTION NUMBERS BOX */
        .numbers-box {
          background: rgba(224, 240, 255, 0.7);
          border: 0.44px solid #A8A8A8;
          box-shadow: 0px 2.19px 20.48px rgba(0, 0, 0, 0.11);
          border-radius: 8.05px;
          padding: 0;
          height: 193px;
          position: relative;
        }

        .numbers-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-template-rows: repeat(4, 1fr);
          height: 100%;
        }

        .q-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 13px;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s;
          border-right: 0.5px solid #A8A8A8;
          border-bottom: 0.5px solid #A8A8A8;
          position: relative;
        }

        .q-cell:nth-child(6n) {
          border-right: none;
        }

        .q-cell:nth-child(n+19) {
          border-bottom: none;
        }

        .q-cell.answered {
          background: rgba(0, 255, 55, 0.7);
          color: #475569;
        }

        .q-cell.current {
          background: rgba(255, 15, 15, 0.7);
          color: #F5F5F5;
        }

        .q-cell:hover {
          opacity: 0.8;
        }

        /* MCQs SECTION */
        .mcq-container {
          min-height: 566px;
        }

        .question-header-text {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 20px;
          color: #002B80;
          text-transform: capitalize;
          margin-bottom: 30px;
        }

        .question-section {
          display: flex;
          gap: 10px;
          margin-bottom: 35px;
        }

        .q-number {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 18px;
          color: #000000;
          min-width: 30px;
        }

        .q-text {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 20px;
          color: #000000;
          line-height: 30px;
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: 11px;
          margin-bottom: 40px;
        }

        .option-item {
          background: rgba(224, 240, 255, 0.7);
          border: 0.6px solid #A8A8A8;
          box-shadow: 0px 3px 28px rgba(0, 0, 0, 0.11);
          border-radius: 11px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 26px;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 79px;
        }

        .option-item:hover {
          border-color: #002B80;
        }

        .option-item.selected {
          border-color: #002B80;
          border-width: 2px;
        }

        .option-radio {
          width: 28.81px;
          height: 28.81px;
          background: rgba(224, 240, 255, 0.7);
          border: 0.6px solid #A8A8A8;
          box-shadow: 0px 3px 28px rgba(0, 0, 0, 0.11);
          border-radius: 41px;
          flex-shrink: 0;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }

        .option-radio.selected {
          background: #002B80;
          border-color: #002B80;
        }

        .option-radio.selected::after {
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .option-text {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 18px;
          line-height: 23px;
          color: #000000;
          flex: 1;
        }

        .button-group {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .btn-back {
          padding: 16px 32px;
          background: #9ca3af;
          color: white;
          border: none;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: capitalize;
        }

        .btn-back:hover {
          background: #6b7280;
        }

        .btn-next {
          padding: 16px 50px;
          background: #002B80;
          color: #FFFFFF;
          border: none;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: capitalize;
        }

        .btn-next:hover {
          background: #001f5c;
        }

        @media(max-width: 768px) {
          .test-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .timer-container {
            width: 100%;
            justify-content: space-between;
          }

          .numbers-grid {
            grid-template-columns: repeat(5, 1fr);
          }
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
            <div className="test-header">
              <div className="header-title">
                Simulation of the Official Australian Citizenship Test
              </div>
              <div className="timer-container">
                <div className="timer-label">Time Remaining:</div>
                <div className="timer-box">
                  <div className="timer-value">{formatTime(timeRemaining)}</div>
                </div>
              </div>
            </div>

            <div className="test-layout">
              {/* QUESTION NUMBERS BOX */}
              <div className="numbers-box">
                <div className="numbers-grid">
                  {questions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`q-cell ${
                        answers[idx] !== undefined ? "answered" : ""
                      } ${currentIdx === idx ? "current" : ""}`}
                      onClick={() => goToQuestion(idx)}
                    >
                      {idx + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* MCQs SECTION */}
              <div className="mcq-container">
                <div className="question-header-text">
                  Question {String(currentIdx + 1).padStart(2, '0')} of {totalQuestions}
                </div>

                <div className="question-section">
                  <div className="q-number">Q.{currentIdx + 1}</div>
                  <div className="q-text">{q.question}</div>
                </div>

                <div className="options-list">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`option-item ${
                        answers[currentIdx] === opt.id ? "selected" : ""
                      }`}
                      onClick={() => handleAnswerSelect(opt.id)}
                    >
                      <div className={`option-radio ${
                        answers[currentIdx] === opt.id ? "selected" : ""
                      }`} />
                      <div className="option-text">{opt.text}</div>
                    </div>
                  ))}
                </div>

                <div className="button-group">
                  <button 
                    className="btn-back" 
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </button>
                  
                  {currentIdx < totalQuestions - 1 ? (
                    <button 
                      className="btn-next" 
                      onClick={() => goToQuestion(currentIdx + 1)}
                    >
                      Next
                    </button>
                  ) : (
                    <button 
                      className="btn-next" 
                      onClick={handleSubmit}
                    >
                      Submit Test
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}