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
  UserCheck,
  UserX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Oz Citizen - Trans.png";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const API_URL = "http://localhost:5000/api/users";
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter((user) => {
        const email = (user.email || "").toLowerCase();
        const username = (user.username || "").toLowerCase();
        const phone = (user.phone || "").toLowerCase();
        return email.includes(query) || username.includes(query) || phone.includes(query);
      });
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const usersData = data.data || [];
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (err) {
      const msg = err.message || "Failed to load users";
      setError(
        msg.includes("Failed to fetch")
          ? "Cannot connect to server. Is your backend running on port 5000?"
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "DEACTIVATED" : "ACTIVE";
    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, status: newStatus } : user))
      );
    } catch (err) {
      console.error("Status toggle error:", err);
      alert("Failed to update user status");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

        .content-area { padding: 20px; }
        @media(min-width:1024px) { .content-area { padding: 28px; } }

        .mobile-menu-btn {
          display: flex; align-items: center; justify-content: center;
          position: fixed; top: 16px; left: 16px; z-index: 50;
          width: 44px; height: 44px; border-radius: 10px; background: white; border: none;
          box-shadow: 0 6px 18px rgba(2,6,23,0.08); cursor: pointer;
        }
        @media(min-width:1024px) { .mobile-menu-btn { display: none; } }

        .page-header { 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          flex-wrap: wrap; 
          gap: 16px; 
          margin-bottom: 32px; 
        }
        .title { font-size: 1.75rem; font-weight: 800; color: #0c4a6e; margin: 0; }

        /* TABLE */
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

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #f0f9ff;
          border-bottom: 2px solid #bae6fd;
        }

        th {
          text-align: left;
          padding: 16px 20px;
          font-size: 0.875rem;
          font-weight: 700;
          color: #0c4a6e;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        tbody tr {
          border-bottom: 1px solid #e0f2fe;
          transition: background 0.2s;
        }

        tbody tr:hover {
          background: #f0f9ff;
        }

        td {
          padding: 16px 20px;
          font-size: 0.925rem;
          color: #334155;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar-table {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #bae6fd;
        }

        .user-avatar-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1rem;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          color: #0c4a6e;
        }

        .user-email {
          font-size: 0.825rem;
          color: #64748b;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.825rem;
          font-weight: 600;
        }

        .status-badge.active {
          background: #d1fae5;
          color: #047857;
        }

        .status-badge.deactivated {
          background: #fee2e2;
          color: #dc2626;
        }

        .actions-cell {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toggle-switch { 
          position: relative; 
          width: 48px; 
          height: 26px; 
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
          height: 20px; 
          width: 20px;
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
          transform: translateX(22px); 
        }

        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .no-results-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          color: #cbd5e1;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          padding: 20px;
          background: white;
          border-top: 1px solid #e0f2fe;
        }

        .page-info {
          color: #64748b;
          font-size: 0.875rem;
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
                <input 
                  placeholder="Search users by name, email or phone..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
              <h2 className="title">Users Management</h2>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b" }}>
                Loading users...
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "2rem", background: "#fee2e2", color: "#dc2626", borderRadius: 12 }}>
                {error}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="no-results">
                <Search className="no-results-icon" />
                <div>No users found matching "{searchQuery}"</div>
              </div>
            ) : (
              <div className="table-container">
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Tests</th>
                        <th>Joined</th>
                        <th>Last Activity</th>
                        <th>Toggle Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => {
                        const profilePicUrl = user.profilePic
                          ? `http://localhost:5000${user.profilePic}`
                          : null;

                        return (
                          <tr key={user.id}>
                            <td>
                              <div className="user-cell">
                                {profilePicUrl ? (
                                  <img src={profilePicUrl} alt={user.username} className="user-avatar-table" />
                                ) : (
                                  <div className="user-avatar-placeholder">
                                    {user.username.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="user-info">
                                  <div className="user-name">{user.username}</div>
                                  <div className="user-email">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>{user.phone}</td>
                            <td>
                              <span className={`status-badge ${user.status.toLowerCase()}`}>
                                {user.status === "ACTIVE" ? (
                                  <UserCheck size={14} />
                                ) : (
                                  <UserX size={14} />
                                )}
                                {user.status}
                              </span>
                            </td>
                            <td>{user.testCount}</td>
                            <td>{formatDate(user.createdAt)}</td>
                            <td>{formatDate(user.lastActivity)}</td>
                            <td>
                              <div className="actions-cell">
                                <label className="toggle-switch" title="Toggle Status">
                                  <input
                                    type="checkbox"
                                    checked={user.status === "ACTIVE"}
                                    onChange={() => handleStatusToggle(user.id, user.status)}
                                  />
                                  <span className="slider"></span>
                                </label>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="pagination">
                  <div className="page-info">
                    Showing {filteredUsers.length} of {users.length} users
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}