// ============================================================
// 📄 PDF Export - بدون JSX
// ============================================================

import { notifications } from './notifications';

export const exportToPDF = (data, title = 'الملف الشخصي') => {
  try {
    // استخدام jsPDF حقيقي إذا كان موجود
    let jsPDF;
    try {
      jsPDF = require('jspdf');
    } catch {
      // Fallback: تصدير كـ JSON
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = title + '_' + new Date().toISOString().slice(0,10) + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      notifications.exportDone();
      return { success: true };
    }
    
    const doc = new jsPDF();
    doc.text(title, 20, 20);
    doc.text('التاريخ: ' + new Date().toLocaleDateString('ar-EG'), 20, 30);
    
    let y = 40;
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        doc.text(key, 20, y);
        y += 10;
        if (Array.isArray(value)) {
          value.forEach((item, i) => {
            const text = (i + 1) + '. ' + JSON.stringify(item).slice(0, 50);
            doc.text(text, 30, y);
            y += 8;
          });
        } else {
          Object.entries(value).forEach(([k, v]) => {
            if (v && v !== '') {
              doc.text(k + ': ' + v, 30, y);
              y += 8;
            }
          });
        }
        y += 5;
      }
    });
    
    doc.save(title + '_' + new Date().toISOString().slice(0,10) + '.pdf');
    notifications.exportDone();
    return { success: true };
    
  } catch (error) {
    notifications.error('فشل تصدير PDF: ' + error.message);
    return { success: false, error: error.message };
  }
};

export const exportToCSV = (data) => {
  try {
    let csv = 'القسم,الحقل,القيمة\n';
    
    const flattenData = (obj, prefix = '') => {
      if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            flattenData(item, prefix + '[' + index + ']');
          });
        } else {
          Object.entries(obj).forEach(([key, value]) => {
            const newKey = prefix ? prefix + '.' + key : key;
            if (typeof value === 'object' && value !== null) {
              flattenData(value, newKey);
            } else if (value && value !== '') {
              csv += (prefix || 'root') + ',' + key + ',\"' + String(value).replace(/"/g, '""') + '\"\n';
            }
          });
        }
      }
    };
    
    flattenData(data);
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profile_' + new Date().toISOString().slice(0,10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    notifications.exportDone();
    return { success: true };
  } catch (error) {
    notifications.error('فشل تصدير CSV: ' + error.message);
    return { success: false, error: error.message };
  }
};
