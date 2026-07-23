import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./auth/context/AuthContext";
import { 
  LayoutDashboard, User, Phone, Link2, GraduationCap, Briefcase, 
  BarChart3, FlaskConical, Wrench, Globe, Award, Target, Settings, 
  Users, Folder, Search, Bell, LogOut, UploadCloud, FileText, Menu, X, 
  Sun, Moon, Sparkles, Download, Save, CheckCircle, AlertCircle, 
  Eye, Trash2, RefreshCw, Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { storage, db } from "./lib/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { PDFExportService } from "./services/pdf";
import toast from "react-hot-toast";
import { Button } from "./components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { Progress } from "./components/ui/progress";
import { Badge } from "./components/ui/badge";
import "./App.css";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDark, setIsDark] = useState(false);
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    personal: {}, contact: {}, professional: {}, academic: [],
    experience: [], research: {}, projects: [], skills: {},
    languages: [], certifications: [], conferences: {},
    preferences: {}, references: [], documents: []
  });
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => { loadProfile(); }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const local = localStorage.getItem("profile");
      if (local) { try { setProfile(JSON.parse(local)); } catch {} }
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.profile) {
            setProfile(data.profile);
            localStorage.setItem("profile", JSON.stringify(data.profile));
          }
        }
      }
    } catch (error) { console.error("Load error:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!user || loading) return;
    const timer = setTimeout(() => handleAutoSave(), 1500);
    return () => clearTimeout(timer);
  }, [profile, user]);

  const handleAutoSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), { profile, updatedAt: new Date().toISOString() }, { merge: true });
      localStorage.setItem("profile", JSON.stringify(profile));
      setSavedStatus("✅ Auto-saved");
    } catch (error) {
      console.error("Auto-save error:", error);
      setSavedStatus("❌ Save failed");
    } finally { setIsSaving(false); }
  };

  const handleFileSelect = () => { fileInputRef.current?.click(); };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) { toast.error("Please login first"); return; }
    setIsUploading(true); setUploadProgress(10); setUploadedFile(file);
    try {
      const storageRef = ref(storage, `users/${user.uid}/documents/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      setUploadProgress(50);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setUploadProgress(75);
      const newDoc = { id: Date.now().toString(), name: file.name, size: file.size, type: file.type, url: downloadURL, path: storageRef.fullPath, uploadedAt: new Date().toISOString() };
      const updatedProfile = { ...profile, documents: [...(profile.documents || []), newDoc] };
      setProfile(updatedProfile);
      setUploadedFile({ ...newDoc, progress: 100 });
      setUploadProgress(100);
      await setDoc(doc(db, "users", user.uid), { profile: updatedProfile, updatedAt: new Date().toISOString() }, { merge: true });
      localStorage.setItem("profile", JSON.stringify(updatedProfile));
      toast.success(`✅ ${file.name} uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const handleExportPDF = async () => {
    if (!user) { toast.error("Please login first"); return; }
    setIsExporting(true);
    try {
      await PDFExportService.generateProfilePDF(profile, user);
      toast.success("✅ PDF exported successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("PDF export failed");
    } finally { setIsExporting(false); }
  };

  useEffect(() => {
    if (isDark) { document.documentElement.classList.add("dark"); } 
    else { document.documentElement.classList.remove("dark"); }
  }, [isDark]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "personal", label: "Personal", icon: User },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "professional", label: "Professional", icon: Link2 },
    { id: "academic", label: "Academic", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "research", label: "Research", icon: BarChart3 },
    { id: "projects", label: "Projects", icon: FlaskConical },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "languages", label: "Languages", icon: Globe },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "conferences", label: "Conferences", icon: Target },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "references", label: "References", icon: Users },
    { id: "documents", label: "Documents", icon: Folder },
  ];

  const stats = [
    { label: "Documents", value: profile.documents?.length || 0, icon: FileText, color: "#6366f1" },
    { label: "Qualifications", value: profile.academic?.length || 0, icon: GraduationCap, color: "#22c55e" },
    { label: "Experiences", value: profile.experience?.length || 0, icon: Briefcase, color: "#f59e0b" },
    { label: "Projects", value: profile.projects?.length || 0, icon: FlaskConical, color: "#8b5cf6" },
  ];

  const quickActions = [
    { icon: UploadCloud, label: "Upload", color: "#6366f1", action: handleFileSelect },
    { icon: User, label: "Edit Profile", color: "#22c55e", action: () => setActiveTab("personal") },
    { icon: Sparkles, label: "AutoFill", color: "#8b5cf6", action: () => toast.success("AutoFill started!") },
    { icon: Download, label: "Export PDF", color: "#f59e0b", action: handleExportPDF },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans antialiased">
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx,.xls,.txt,.csv" />

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 z-40 h-full w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-l border-slate-200 dark:border-slate-700 shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">S</div>
              <div><h1 className="text-xl font-bold text-slate-900 dark:text-white">SRS</h1><p className="text-xs text-slate-500 dark:text-slate-400">Smart Profile</p></div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><X size={20} /></button>
          </div>
          <nav className="flex-1 overflow-y-auto space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                  <Icon size={20} /><span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">{user?.displayName?.charAt(0) || 'U'}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.displayName || 'User'}</p><p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p></div>
              <button onClick={signOut} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"><LogOut size={18} /></button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:mr-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><Menu size={24} /></button>
              <span className="text-sm text-slate-600 dark:text-slate-300 hidden sm:block">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 relative"><Bell size={20} /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span></button>
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><Search size={20} /></button>
              <Button variant="success" size="sm" onClick={handleExportPDF} disabled={isExporting}>
                <Download size={16} /> Export
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 md:p-6">
          {activeTab === "dashboard" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Welcome */}
              <Card className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0 shadow-xl shadow-purple-500/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-3xl text-white">Welcome back, {user?.displayName || 'User'}! 👋</CardTitle>
                      <p className="text-white/80 mt-2">Manage your academic and professional profile.</p>
                    </div>
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      {isSaving ? <Save size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                      <span className="ml-2">{savedStatus || "Ready"}</span>
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <Card key={i} className="hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: stat.color + '20' }}>
                          <stat.icon size={24} style={{ color: stat.color }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {quickActions.map((action, i) => (
                      <Button key={i} variant="secondary" className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={action.action}>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: action.color + '20' }}>
                          <action.icon size={24} style={{ color: action.color }} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{action.label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upload Progress */}
              {isUploading && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Uploading...</span>
                      <span className="font-bold text-blue-600">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                    {uploadedFile && <p className="text-xs text-slate-500 mt-1">{uploadedFile.name}</p>}
                  </CardContent>
                </Card>
              )}

              {/* Recent Documents */}
              {profile.documents?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {profile.documents.slice(-3).reverse().map((doc, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition">
                          <FileText size={24} className="text-blue-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{doc.name}</p>
                            <p className="text-xs text-slate-400">{(doc.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-slate-100 rounded">
                            <Eye size={16} className="text-slate-400" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {activeTab !== "dashboard" && (
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{activeTab}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 dark:text-slate-400">This section is being prepared...</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

