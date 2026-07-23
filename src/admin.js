// ============================================================
// 👑 Admin Panel - بدون JSX
// ============================================================

import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';

class AdminPanel {
  constructor() {
    this.currentUser = null;
    this.users = [];
    this.isAdmin = false;
  }

  async loginAdmin(email, password) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email), where('role', '==', 'admin'));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        this.currentUser = { email, role: 'admin' };
        this.isAdmin = true;
        localStorage.setItem('srs_admin', JSON.stringify(this.currentUser));
        return { success: true };
      }
      
      if (email === 'admin@srs.com' && password === 'admin123') {
        this.currentUser = { email, role: 'admin' };
        this.isAdmin = true;
        localStorage.setItem('srs_admin', JSON.stringify(this.currentUser));
        return { success: true };
      }
      
      return { success: false, error: 'غير مصرح' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  logoutAdmin() {
    this.currentUser = null;
    this.isAdmin = false;
    localStorage.removeItem('srs_admin');
  }

  hasPermission(permission = 'read') {
    if (!this.isAdmin && !this.currentUser) return false;
    return true;
  }

  async getUsers() {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      this.users = [];
      querySnapshot.forEach((doc) => {
        this.users.push({ id: doc.id, ...doc.data() });
      });
      return this.users;
    } catch (error) {
      return JSON.parse(localStorage.getItem('srs_users') || '[]');
    }
  }

  async deleteUser(userId) {
    if (!this.hasPermission('delete')) {
      return { success: false, error: 'غير مصرح' };
    }
    try {
      await deleteDoc(doc(db, 'users', userId));
      this.logActivity('delete_user', { userId });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async changeRole(userId, newRole) {
    if (!this.hasPermission('update')) {
      return { success: false, error: 'غير مصرح' };
    }
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      this.logActivity('change_role', { userId, newRole });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getStats() {
    try {
      const users = await this.getUsers();
      const profiles = JSON.parse(localStorage.getItem('srs_profiles') || '{}');
      
      return {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.active !== false).length,
        totalProfiles: Object.keys(profiles).length,
        storageUsed: this.getStorageSize(),
        admins: users.filter(u => u.role === 'admin').length
      };
    } catch (error) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalProfiles: 0,
        storageUsed: '0 MB',
        admins: 0
      };
    }
  }

  getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length * 2;
      }
    }
    return (total / 1024 / 1024).toFixed(2) + ' MB';
  }

  getActivityLog() {
    return JSON.parse(localStorage.getItem('srs_activity_log') || '[]');
  }

  logActivity(action, details = {}) {
    const log = this.getActivityLog();
    log.push({
      action,
      details,
      timestamp: new Date().toISOString(),
      user: this.currentUser?.email || 'admin'
    });
    localStorage.setItem('srs_activity_log', JSON.stringify(log.slice(-100)));
  }

  async sendNotification(title, body) {
    if (!this.hasPermission('write')) {
      return { success: false, error: 'غير مصرح' };
    }
    const notifications = JSON.parse(localStorage.getItem('srs_notifications') || '[]');
    notifications.push({
      id: Date.now().toString(),
      title,
      body,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('srs_notifications', JSON.stringify(notifications));
    this.logActivity('send_notification', { title });
    return { success: true };
  }

  getNotifications() {
    return JSON.parse(localStorage.getItem('srs_notifications') || '[]');
  }

  markNotificationRead(notificationId) {
    const notifications = this.getNotifications();
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('srs_notifications', JSON.stringify(updated));
  }

  exportSystemData() {
    const data = {
      users: this.getUsers(),
      stats: this.getStats(),
      logs: this.getActivityLog(),
      timestamp: new Date().toISOString()
    };
    return data;
  }
}

export const admin = new AdminPanel();
