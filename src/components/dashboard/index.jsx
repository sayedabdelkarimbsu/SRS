import React from "react";
import { Icons } from "../lib/icons";
import { motion } from "framer-motion";

export const StatsCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="stats-card"
  >
    <div className="stats-card-header">
      <span className="stats-icon" style={{ background: color }}>
        <Icon size={20} color="white" />
      </span>
      <span className="stats-value">{value}</span>
    </div>
    <div className="stats-card-footer">
      <span className="stats-title">{title}</span>
      {subtitle && <span className="stats-subtitle">{subtitle}</span>}
    </div>
  </motion.div>
);

export const QuickAction = ({ icon: Icon, label, onClick, color }) => (
  <motion.button 
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="quick-action"
    onClick={onClick}
  >
    <span className="quick-action-icon" style={{ background: color }}>
      <Icon size={18} />
    </span>
    <span className="quick-action-label">{label}</span>
  </motion.button>
);

export const ProgressCard = ({ title, progress, items }) => (
  <div className="progress-card">
    <h3>{title}</h3>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${progress}%` }} />
    </div>
    <span className="progress-label">{progress}% مكتمل</span>
    {items && (
      <div className="progress-items">
        {items.map((item, i) => (
          <div key={i} className="progress-item">
            {item.completed ? 
              <Icons.CheckCircle size={16} color="#22c55e" /> : 
              <Icons.Clock size={16} color="#f59e0b" />
            }
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export const DocumentCard = ({ doc, onPreview, onDownload, onReplace, onDelete }) => {
  const getIcon = (type) => {
    if (!type) return Icons.File;
    if (type.includes('pdf')) return Icons.FilePdf;
    if (type.includes('word')) return Icons.FileWord;
    if (type.includes('excel') || type.includes('sheet')) return Icons.FileSpreadsheet;
    if (type.includes('image')) return Icons.Image;
    return Icons.File;
  };

  const getColor = (type) => {
    if (!type) return '#64748b';
    if (type.includes('pdf')) return '#dc2626';
    if (type.includes('word')) return '#2563eb';
    if (type.includes('excel')) return '#16a34a';
    if (type.includes('image')) return '#8b5cf6';
    return '#64748b';
  };

  const Icon = getIcon(doc.type);
  const color = getColor(doc.type);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="document-card"
    >
      <div className="doc-card-icon" style={{ color }}>
        <Icon size={32} />
      </div>
      <div className="doc-card-info">
        <p className="doc-card-name" title={doc.name}>{doc.name}</p>
        <div className="doc-card-meta">
          <span>{(doc.size / 1024).toFixed(1)} KB</span>
          <span>•</span>
          <span>{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('ar-EG') : ''}</span>
        </div>
      </div>
      <div className="doc-card-actions">
        <button onClick={() => onPreview(doc)} title="عرض"><Icons.Eye size={16} /></button>
        <button onClick={() => onDownload(doc)} title="تنزيل"><Icons.Download size={16} /></button>
        <button onClick={() => onReplace(doc)} title="استبدال"><Icons.RefreshCw size={16} /></button>
        <button onClick={() => onDelete(doc)} title="حذف"><Icons.Trash2 size={16} /></button>
      </div>
    </motion.div>
  );
};
