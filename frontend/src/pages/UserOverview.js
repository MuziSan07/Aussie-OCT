import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Filter
} from 'lucide-react';
import logo from "../assets/Oz Citizen - Trans.png";

export default function UserOverview() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('overview');
  
  const userId = localStorage.getItem('userId') || '1';
  
  useEffect(() => {
    fetchOverview();
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/overview/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setOverview(data.data);
      } else {
        setError(data.message || 'Failed to fetch overview');
      }
    } catch (err) {
      console.error('Error fetching overview:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
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

  const handleChapterClick = (chapterId) => {
    navigate(`/practice/chapter/${chapterId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not attempted yet';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'practice-test', label: 'Practice Test', icon: BookOpen },
    { id: 'simulation', label: 'Simulation Test', icon: Trophy },
    { id: 'flagged', label: 'Flagged Questions', icon: Flag }
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
        gap: '20px',
        zoom: 0.8
      }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '4px solid #e0f2fe',
          borderTop: '4px solid #0ea5e9',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div style={{ fontSize: '1.25rem', color: '#6b7280' }}>Loading overview...</div>
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
        background: '#f0f9ff',
        zoom: 0.8
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
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Error Loading Data</div>
          <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: '20px' }}>{error}</div>
          <button 
            onClick={fetchOverview}
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
          overflow: hidden;
        }
        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
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

        .welcome-section { margin-bottom: 32px; }
        .welcome-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0c4a6e;
          margin-bottom: 8px;
        }
        .welcome-subtitle {
          font-size: 1rem;
          color: #64748b;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        @media(min-width: 1400px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 2px solid #bae6fd;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
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

        .stat-number {
          font-size: 3rem;
          font-weight: 800;
          color: #0369a1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 0.95rem;
          color: #64748b;
          font-weight: 600;
        }

        .page-header { 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          flex-wrap: wrap; 
          gap: 16px; 
          margin-bottom: 32px; 
        }
        .page-title { 
          font-size: 1.25rem; 
          font-weight: 700; 
          color: #0c4a6e; 
          margin: 0; 
        }
        .right-section { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          flex-wrap: wrap; 
        }
        .filter-tag { 
          display: flex; 
          align-items: center; 
          gap: 7px; 
          padding: 7px 14px; 
          background: #f8fafc;
          border: 1px solid #e2e8f0; 
          border-radius: 10px; 
          color: #475569; 
          font-size: 14px; 
          font-weight: 500; 
          white-space: nowrap; 
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-tag:hover {
          border-color: #0ea5e9;
          color: #0ea5e9;
        }
        .filter-tag svg { 
          width: 16px; 
          height: 16px; 
          color: #64748b; 
        }
        .badge { 
          background: #e0f2fe; 
          color: #0369a1; 
          font-size: 11px; 
          font-weight: 700; 
          padding: 2px 8px; 
          border-radius: 20px; 
        }

        .test-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 20px; 
          margin-bottom: 40px;
        }

        @media(min-width: 1400px) {
          .test-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

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

        .chapter-img { 
          width: 100%; 
          height: 180px; 
          object-fit: cover; 
          display: block; 
        }
        .card-content { padding: 20px; }
        .chapter-title { 
          font-size: 1.25rem; 
          font-weight: 700; 
          color: #0c4a6e; 
          margin: 0 0 6px; 
        }
        .sessions-label { 
          font-size: .925rem; 
          color: #64748b; 
          margin: 0 0 4px; 
        }
        .date-label {
          font-size: 0.75rem;
          color: #94a3b8;
          font-style: italic;
          margin: 0 0 16px;
        }
        .bottom-row { 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
        }
        .session-count { 
          font-size: .95rem; 
          color: #475569; 
          font-weight: 600; 
        }

        .practice-progress {
          margin-top: 12px;
          height: 6px;
          background: #e0f2fe;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: #0ea5e9;
          border-radius: 3px;
          transition: width 0.5s;
        }

        .empty-message {
          text-align: center;
          padding: 60px 40px;
          color: #94a3b8;
          font-size: 1rem;
          background: white;
          border-radius: 16px;
          border: 2px dashed #cbd5e1;
        }

        @media(max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .test-grid {
            grid-template-columns: 1fr;
          }
          .welcome-title {
            font-size: 1.5rem;
          }
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }
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
          className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="logo-container">
            <img src={logo} alt="Oz Citizen" className="logo-img" />
          </div>

          <nav className="nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="logout-section">
            <button className="settings-btn" onClick={() => navigate('/settings')}>
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
              <div className="user-avatar" title="Profile" onClick={() => navigate(`/profile/${userId}`)}>
                {overview?.user?.profilePic ? (
                  <img
                    src={overview.user.profilePic.startsWith('http') 
                      ? overview.user.profilePic 
                      : `http://localhost:5000${overview.user.profilePic}`}
                    alt="Profile"
                  />
                ) : (
                  <User size={22} color="white" />
                )}
              </div>
            </div>
          </div>

          <div className="content-area">
            <div className="welcome-section">
              <h1 className="welcome-title">
                Welcome back, {overview?.user?.username || 'Student'}! 👋
              </h1>
              <p className="welcome-subtitle">
                Ready to continue your Australian Citizenship journey?
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{overview?.stats?.totalSimulations || 0}</div>
                <div className="stat-label">Total Simulations</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{overview?.stats?.completedChapters || 0}</div>
                <div className="stat-label">Completed Chapters</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{overview?.stats?.quizScore || 0}%</div>
                <div className="stat-label">Practice Score</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{overview?.stats?.simulationQuizScore || 0}%</div>
                <div className="stat-label">Simulation Score</div>
              </div>
            </div>

            <div className="page-header">
              <h2 className="page-title">Recent Practice Tests</h2>
              <div className="right-section">
                <div className="filter-tag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                  All Category
                </div>
                <div className="filter-tag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="15" y2="6"/><line x1="3" y1="12" x2="12" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
                  </svg>
                  Sort by: Popular
                </div>
              </div>
            </div>

            {overview?.recentPracticeTests && overview.recentPracticeTests.length > 0 ? (
              <div className="test-grid">
                {overview.recentPracticeTests.map((test) => {
                  const imageUrl = test.chapterImage 
                    ? (test.chapterImage.startsWith('http') 
                        ? test.chapterImage 
                        : `http://localhost:5000${test.chapterImage}`)
                    : 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop';
                  
                  return (
                    <article 
                      key={test.id} 
                      className="chapter-card"
                      onClick={() => handleChapterClick(test.chapterId)}
                    >
                      <img
                        src={imageUrl}
                        alt={test.chapterTitle}
                        className="chapter-img"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop';
                        }}
                      />
                      <div className="card-content">
                        <h3 className="chapter-title">
                          Practice test for: {test.chapterTitle}
                        </h3>
                        <p className="sessions-label">
                          Practice Sessions Completed:
                        </p>
                        <p className="date-label">
                          📅 Last attempt: {formatDate(test.lastAttemptDate)}
                        </p>

                        <div className="bottom-row">
                          <span className="session-count">
                            {test.questionsAttempted}/{test.totalQuestions} Sessions
                          </span>
                        </div>

                        <div style={{ 
                          marginTop: '12px', 
                          fontSize: '0.875rem', 
                          color: '#475569',
                          fontWeight: '600'
                        }}>
                          Average score: {test.bestScore || 0}%
                        </div>

                        <div className="practice-progress">
                          <div
                            className="progress-bar"
                            style={{ width: `${test.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="empty-message">
                📚 No practice tests yet. Start your first chapter to begin!
              </div>
            )}

            <h2 className="page-title" style={{ marginBottom: '24px' }}>Recent Simulation Tests</h2>
            {overview?.recentSimulations && overview.recentSimulations.length > 0 ? (
              <div className="test-grid">
                {overview.recentSimulations.map((sim, idx) => (
                  <article 
                    key={sim.id} 
                    className="chapter-card"
                    onClick={() => navigate('/practice/simulation')}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop"
                      alt="Simulation Test"
                      className="chapter-img"
                    />
                    <div className="card-content">
                      <h3 className="chapter-title">
                        🎯 Simulation Test #{overview.recentSimulations.length - idx}
                      </h3>
                      <p className="sessions-label">
                        Score: {sim.score} out of {sim.totalQuestions} correct
                      </p>
                      <p className="date-label">
                        📅 Completed: {formatDate(sim.createdAt)}
                      </p>

                      <div className="bottom-row">
                        <span className="session-count">
                          {sim.percentage}%
                        </span>
                        <span style={{ 
                          color: sim.passed ? '#10b981' : '#ef4444',
                          fontWeight: 'bold',
                          fontSize: '0.875rem'
                        }}>
                          {sim.passed ? '✓ PASSED' : '✗ FAILED'}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-message">
                🎯 No simulation tests yet. Take your first simulation when you're ready!
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}