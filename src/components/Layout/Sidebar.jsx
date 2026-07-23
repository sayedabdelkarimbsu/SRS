import React, { useState } from "react";
import {
  LayoutDashboard,
  User,
  Mail,
  Briefcase,
  GraduationCap,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Database,
  Languages,
  Award,
  BookOpen,
  Users,
  FolderOpen,
  Lightbulb
} from "lucide-react";
import { useAuth } from "../../auth/context/AuthContext";
import { motion } from "framer-motion";

const Sidebar = ({ activeSection, onSectionChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { signOut } = useAuth();

  const sections = [
    { id: "personal", label: "شخصي", icon: User },
    { id: "contact", label: "تواصل", icon: Mail },
    { id: "professional", label: "ملفات مهنية", icon: Briefcase },
    { id: "academic", label: "مؤهلات", icon: GraduationCap },
    { id: "experience", label: "خبرات", icon: Briefcase },
    { id: "research", label: "بحث علمي", icon: Database },
    { id: "projects", label: "مشاريع", icon: FolderOpen },
    { id: "skills", label: "مهارات", icon: Lightbulb },
    { id: "languages", label: "لغات", icon: Languages },
    { id: "certifications", label: "شهادات", icon: Award },
    { id: "conferences", label: "مؤتمرات", icon: Users },
    { id: "preferences", label: "تفضيلات", icon: Settings },
    { id: "references", label: "مراجع", icon: Users },
    { id: "documents", label: "مستندات", icon: FileText }
  ];

  return (
    <motion.div
      className={"sidebar " + (collapsed ? "collapsed" : "")}
      animate={{ width: collapsed ? 80 : 240 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sidebar-header">
        <div className="logo">
          {!collapsed && <span>SRS</span>}
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sections.map(function(section) {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              className={"sidebar-item " + (activeSection === section.id ? "active" : "")}
              onClick={() => onSectionChange(section.id)}
            >
              <Icon size={20} />
              {!collapsed && <span>{section.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button onClick={signOut} className="sidebar-item logout">
          <LogOut size={20} />
          {!collapsed && <span>خروج</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
