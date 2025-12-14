import React, { useState, useEffect } from "react";
import {
  Search,
  Menu,
  Home,
  Users,
  BookOpen,
  HelpCircle,
  Beaker,
  LogOut,
  Settings,
  Bell,
  User,
  TrendingUp,
  Edit,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Oz Citizen - Trans.png";

export default function AdminOverview() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAdminData();
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/overview", {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        }
      });
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || "Failed to load data");
      }
    } catch (err) {
      console.error("Admin overview error:", err);
      setError("Cannot connect to server. Is your backend running?");
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

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.href = '/login';
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
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f9ff',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '4px solid #e0f2fe',
          borderTop: '4px solid #0ea5e9',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div style={{ fontSize: '1.25rem', color: '#6b7280' }}>Loading admin dashboard...</div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f9ff'
      }}>
        <div style={{ 
          fontSize: '1.25rem', 
          color: '#ef4444',
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Error Loading Dashboard</div>
          <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: '20px' }}>{error}</div>
          <button 
            onClick={fetchAdminData}
            style={{
              padding: '12px 24px',
              background: '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Retry
          </button>
        </div>
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
        .logo-img { 
          height: 50px; 
          object-fit: contain; 
          filter: drop-shadow(0 6px 12px rgba(3,105,161,0.08));
        }

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
          text-align: left;
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
          text-align: left;
          width: 100%;
        }
        .settings-btn { color: #1e40af; }
        .settings-btn:hover { background: #bae6fd; }
        .logout-btn { color: #ef4444; }
        .logout-btn:hover { background: #fff0f1; }

        .sidebar-overlay { 
          display: none; 
          position: fixed; 
          inset: 0; 
          background: rgba(0,0,0,0.45); 
          z-index: 35; 
        }
        .sidebar-overlay.show { display: block; }
        @media(min-width:1024px) { .sidebar-overlay { display: none !important; } }

        .main-content { flex: 1; margin-left: 0; padding: 0; }
        @media(min-width:1024px) { .main-content { margin-left: 240px; } }

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

        .content-area { padding: 20px; }
        @media(min-width:1024px) { .content-area { padding: 28px; } }

        .page-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0c4a6e;
          margin: 0 0 32px 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 2px solid #bae6fd;
          transition: all .35s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 
            0 10px 30px rgba(0,0,0,0.15),
            0 25px 60px rgba(0,0,0,0.12),
            0 4px 12px rgba(0,0,0,0.08);
        }

        .stat-card:hover {
          transform: translateY(-14px);
          box-shadow: 
            0 25px 60px rgba(0,0,0,0.22),
            0 45px 90px rgba(0,0,0,0.18),
            0 12px 24px rgba(0,0,0,0.14);
          border-color: #7dd3fc;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #0c4a6e;
          margin-bottom: 8px;
        }

        .stat-change {
          font-size: 0.75rem;
          color: #10b981;
          font-weight: 600;
        }

        .section-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        @media(max-width: 1024px) {
          .section-grid {
            grid-template-columns: 1fr;
          }
        }

        .section-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 2px solid #bae6fd;
          box-shadow: 
            0 10px 30px rgba(0,0,0,0.15),
            0 25px 60px rgba(0,0,0,0.12),
            0 4px 12px rgba(0,0,0,0.08);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0c4a6e;
        }

        .see-all {
          font-size: 0.875rem;
          color: #0ea5e9;
          cursor: pointer;
          font-weight: 600;
        }

        .see-all:hover {
          text-decoration: underline;
        }

        .users-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .user-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 10px;
          background: #f8fafc;
          transition: all 0.2s;
        }

        .user-row:hover {
          background: #f0f9ff;
        }

        .user-avatar-list {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .user-avatar-list img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .user-details {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-weight: 600;
          color: #0c4a6e;
          font-size: 0.925rem;
          margin-bottom: 2px;
        }

        .user-email {
          font-size: 0.8rem;
          color: #64748b;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-meta {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .practice-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .practice-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 10px;
          background: #f8fafc;
          transition: all 0.2s;
        }

        .practice-item:hover {
          background: #f0f9ff;
        }

        .practice-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
          background: linear-gradient(135deg, #e0f2fe, #bae6fd);
          flex-shrink: 0;
        }

        .practice-info {
          flex: 1;
          min-width: 0;
        }

        .practice-title {
          font-weight: 600;
          color: #0c4a6e;
          font-size: 0.875rem;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .practice-subtitle {
          font-size: 0.75rem;
          color: #64748b;
        }

        .practice-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .action-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-icon-btn:hover {
          background: #f1f5f9;
          transform: scale(1.1);
        }

        .toggle-switch { 
          position: relative; 
          width: 52px; 
          height: 28px; 
        }
        .toggle-switch input { 
          opacity: 0; 
          width: 0; 
          height: 0; 
        }
        .slider {
          position: absolute; 
          cursor: pointer; 
          top: 0; 
          left: 0; 
          right: 0; 
          bottom: 0;
          background: #cbd5e1; 
          transition: .3s; 
          border-radius: 34px;
        }
        .slider:before {
          position: absolute; 
          content: ""; 
          height: 22px; 
          width: 22px;
          left: 3px; 
          bottom: 3px; 
          background: white; 
          transition: .3s; 
          border-radius: 50%;
        }
        input:checked + .slider { 
          background: #10b981; 
        }
        input:checked + .slider:before { 
          transform: translateX(24px); 
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #94a3b8;
          font-size: 0.9rem;
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
                <input placeholder="Search..." readOnly />
              </div>
            </div>
            <div className="top-bar-right">
              <button className="icon-button" title="Notifications">
                <Bell size={22} color="#475569" />
              </button>
              <div className="user-avatar" title="Admin profile">
                <User size={22} color="white" />
              </div>
            </div>
          </div>

          <div className="content-area">
            <h2 className="page-title">Dashboard</h2>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Users</div>
                <div className="stat-number">{data?.totalUsers || 0}</div>
                <div className="stat-change">↑ +12% from last month</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Total Free Practice Test</div>
                <div className="stat-number">{data?.totalPracticeTests || 0}</div>
                <div className="stat-change">↑ +8% from last month</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Total Chapters</div>
                <div className="stat-number">{data?.totalChapters || 0}</div>
                <div className="stat-change">↑ +15% from last month</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Total Simulation</div>
                <div className="stat-number">{data?.totalSimulationTests || 0}</div>
                <div className="stat-change">↑ +5% from yesterday</div>
              </div>
            </div>

            <div className="section-grid">
              <div className="section-card">
                <div className="section-header">
                  <h2 className="section-title">Users</h2>
                  <span className="see-all" onClick={() => handleNavigation('users')}>
                    See all
                  </span>
                </div>
                <div className="users-list">
                  {data?.usersList && data.usersList.length > 0 ? (
                    data.usersList.slice(0, 5).map((user) => (
                      <div key={user.id} className="user-row">
                        <div className="user-avatar-list">
                          {user.profilePic ? (
                            <img src={user.profilePic} alt={user.name} />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="user-details">
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                        <div className="user-meta">{user.timeAgo}</div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">No users yet</div>
                  )}
                </div>
              </div>

              <div className="section-card">
                <div className="section-header">
                  <h2 className="section-title">Practice Test</h2>
                  <span className="see-all" onClick={() => handleNavigation('tests-chapters')}>
                    See all
                  </span>
                </div>
                <div className="practice-list">
                  {data?.recentChapters && data.recentChapters.length > 0 ? (
                    data.recentChapters.map((chapter) => (
                      <div key={chapter.id} className="practice-item">
                        <img
                          src={chapter.image.startsWith('http') 
                            ? chapter.image 
                            : `http://localhost:5000${chapter.image}`}
                          alt={chapter.title}
                          className="practice-image"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&auto=format&fit=crop';
                          }}
                        />
                        <div className="practice-info">
                          <div className="practice-title">Practice test for: {chapter.title}</div>
                          <div className="practice-subtitle">
                            Average score: {chapter.averageScore || 0}%
                          </div>
                        </div>
                        <div className="practice-actions">
                          <label className="toggle-switch">
                            <input 
                              type="checkbox" 
                              checked={chapter.status}
                              readOnly
                            />
                            <span className="slider"></span>
                          </label>
                          <button 
                            className="action-icon-btn"
                            onClick={() => navigate(`/admin/chapter/edit/${chapter.id}`)}
                            title="Edit"
                          >
                            <Edit size={16} color="#475569" />
                          </button>
                          <button 
                            className="action-icon-btn"
                            title="Delete"
                          >
                            <Trash2 size={16} color="#ef4444" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">No chapters available</div>
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