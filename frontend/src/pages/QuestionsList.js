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
  Plus,
  Edit,
  Trash2,
  Bell,
  User,
  Menu,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Oz Citizen - Trans.png";

export default function QuestionsList() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("questions");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API_URL = "http://localhost:5000/api/questions";

  useEffect(() => {
    fetchQuestions();
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(API_URL);
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Failed to load questions: ${res.status} – ${txt}`);
      }

      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, current) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !current }),
      });
      if (!res.ok) throw new Error("Update failed");

      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: !current } : q))
      );
    } catch (e) {
      alert("Could not toggle status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (e) {
      alert("Delete failed");
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

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "system-ui",
          background: "#f0f9ff",
        }}
      >
        Loading questions…
      </div>
    );
  }

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
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 30;
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
        }

        .mobile-menu-btn {
          display: flex; align-items: center; justify-content: center;
          position: fixed; top: 16px; left: 16px; z-index: 50;
          width: 44px; height: 44px; border-radius: 10px; background: white; border: none;
          box-shadow: 0 6px 18px rgba(2,6,23,0.08); cursor: pointer;
        }
        @media(min-width:1024px) { .mobile-menu-btn { display: none; } }

        .content-area { padding: 20px; }
        @media(min-width:1024px) { .content-area { padding: 28px; } }

        .page-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .page-title { font-size: 1.75rem; font-weight: 800; color: #0c4a6e; margin: 0; }

        .filters { 
          display: flex; 
          gap: 12px; 
          align-items: center; 
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .filter-select { 
          padding: 10px 16px; 
          border: 2px solid #e2e8f0; 
          border-radius: 10px; 
          font-size: 14px; 
          background: white;
          font-weight: 500;
          color: #475569;
          cursor: pointer;
        }
        .filter-select:focus {
          outline: none;
          border-color: #0ea5e9;
        }

        .btn-primary {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: white;
          padding: 11px 22px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(3,105,161,.2);
          transition: all .2s;
        }
        .btn-primary:hover { transform: translateY(-2px); }

        .table-container {
          background: white;
          border-radius: 16px;
          border: 2px solid #bae6fd;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .table { width: 100%; border-collapse: collapse; }
        .table th {
          background: #f0f9ff;
          padding: 16px 20px;
          text-align: left;
          font-weight: 700;
          color: #0c4a6e;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #bae6fd;
        }
        .table td {
          padding: 16px 20px;
          border-bottom: 1px solid #e0f2fe;
          font-size: 0.925rem;
          color: #334155;
        }
        .table tr:hover {
          background: #f0f9ff;
        }
        .table tr:last-child td {
          border-bottom: none;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.825rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .status-badge.active {
          background: #d1fae5;
          color: #047857;
        }

        .status-badge.deactivated {
          background: #fee2e2;
          color: #dc2626;
        }

        .status-badge:hover {
          opacity: 0.8;
        }

        .pre-test {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 12px;
          display: inline-block;
        }
        .pre-test.yes { background: #dcfce7; color: #166534; }
        .pre-test.no { background: #fee2e2; color: #991b1b; }

        .action-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: #64748b;
          border-radius: 8px;
          transition: all .2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .action-btn:hover {
          background: #f1f5f9;
          color: #1e293b;
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
            <div className="page-header">
              <h1 className="page-title">Questions</h1>
              <button
                className="btn-primary"
                onClick={() => navigate("/admin/question/add")}
              >
                <Plus size={20} /> Add Question
              </button>
            </div>

            <div className="filters">
              <select className="filter-select">
                <option>All Category</option>
                <option>Grammar</option>
                <option>Vocabulary</option>
              </select>
              <select className="filter-select">
                <option>Sort by: Popular</option>
                <option>Date Added</option>
                <option>Title</option>
              </select>
            </div>

            {error && (
              <div className="error-msg">
                Error: {error}
              </div>
            )}

            <div className="table-container">
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Question Title</th>
                      <th>Status</th>
                      <th>Chapter</th>
                      <th>Add Date</th>
                      <th>Pre Test</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                          No questions found.
                        </td>
                      </tr>
                    ) : (
                      questions.map((q) => (
                        <tr key={q.id}>
                          <td style={{ fontWeight: 600, color: "#0c4a6e" }}>{q.question}</td>
                          <td>
                            <span
                              className={`status-badge ${q.status ? "active" : "deactivated"}`}
                              onClick={() => toggleStatus(q.id, q.status)}
                              title="Click to toggle status"
                            >
                              {q.status ? (
                                <>
                                  <CheckCircle size={14} />
                                  ACTIVE
                                </>
                              ) : (
                                <>
                                  <XCircle size={14} />
                                  DEACTIVATED
                                </>
                              )}
                            </span>
                          </td>
                          <td>{q.chapter?.title || "—"}</td>
                          <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span
                              className={`pre-test ${q.testType === "PAID" ? "yes" : "no"}`}
                            >
                              {q.testType === "PAID" ? "Yes" : "No"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="action-btn"
                              onClick={() => navigate(`/admin/question/edit/${q.id}`)}
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className="action-btn"
                              onClick={() => handleDelete(q.id)}
                              title="Delete"
                              style={{ marginLeft: "0.5rem" }}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}