import React, { useState } from "react";
import { useAuth } from "../auth/context/AuthContext";
import { Icons } from "../lib/icons";
import { motion, AnimatePresence } from "framer-motion";

export const Sidebar = ({ active, setActive, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const navItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: Icons.LayoutDashboard },
    { id: "personal", label: "الشخصي", icon: Icons.User },
    { id: "contact", label: "التواصل", icon: Icons.Mail },
    { id: "professional", label: "الملفات المهنية", icon: Icons.Link2 },
    { id: "academic", label: "المؤهلات", icon: Icons.GraduationCap },
    { id: "experience", label: "الخبرات", icon: Icons.Briefcase },
    { id: "research", label: "البحث العلمي", icon: Icons.BookOpen },
    { id: "projects", label: "المشاريع", icon: Icons.FolderOpen },
    { id: "skills", label: "المهارات", icon: Icons.Zap },
    { id: "languages", label: "اللغات", icon: Icons.Languages },
    { id: "certifications", label: "الشهادات", icon: Icons.Award },
    { id: "conferences", label: "المؤتمرات", icon: Icons.Users },
    { id: "preferences", label: "التفضيلات", icon: Icons.Settings },
    { id: "documents", label: "المستندات", icon: Icons.Folder },
  ];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">📚</span>
          {!collapsed && <span className="logo-text">SRS</span>}
        </div>
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <Icons.ChevronRight size={20} /> : <Icons.ChevronDown size={20} />}
        </button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? "active" : ""}`}
            onClick={() => setActive(item.id)}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" />
            ) : (
              <span>{user?.displayName?.charAt(0) || "U"}</span>
            )}
          </div>
          {!collapsed && (
            <div className="user-details">
              <span className="user-name">{user?.displayName || "مستخدم"}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Header = ({ onSearch }) => {
  const { user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <div className="search-box">
          <Icons.Search size={18} />
          <input 
            type="text" 
            placeholder="بحث..." 
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>
      <div className="header-right">
        <button className="header-btn">
          <Icons.Bell size={20} />
          <span className="badge">3</span>
        </button>
        <div className="user-menu" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="user-avatar-sm">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" />
            ) : (
              <span>{user?.displayName?.charAt(0) || "U"}</span>
            )}
          </div>
          <Icons.ChevronDown size={16} />
          {showDropdown && (
            <div className="dropdown">
              <button onClick={() => signOut()}>
                <Icons.LogOut size={16} />
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
