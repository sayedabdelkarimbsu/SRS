#!/bin/bash
echo "============================================"
echo "🔐 بدء تنفيذ بوابة المصادقة"
echo "============================================"

cd ~/Desktop/srs-system-backup\ \(1\)/srs-system 2>/dev/null || cd ~/Desktop/srs-system 2>/dev/null

echo "📦 تثبيت المكتبات..."
npm install firebase react-router-dom axios react-hook-form @hookform/resolvers zod framer-motion react-hot-toast --legacy-peer-deps

echo "📁 إنشاء مجلدات..."
mkdir -p src/lib src/auth/context src/auth/components src/auth/pages

echo "📁 إنشاء Firebase..."
cat > src/lib/firebase.js << 'FEOF'
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDemoKey123456789",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export {
  auth,
  db,
  storage,
  googleProvider,
  githubProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail
};
FEOF

echo "📁 إنشاء AuthContext..."
cat > src/auth/context/AuthContext.jsx << 'AEOF'
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, onAuthStateChanged, signOut as firebaseSignOut } from "../../lib/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
AEOF

echo "📁 إنشاء ProtectedRoute..."
cat > src/auth/components/ProtectedRoute.jsx << 'PEOF'
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">⏳ جاري التحميل...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
PEOF

echo "📁 إنشاء صفحات المصادقة..."
cat > src/auth/pages/LoginPage.jsx << 'LEOF'
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword, signInWithPopup, googleProvider, githubProvider, auth } from "../../lib/firebase";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("مرحباً بك!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("تم تسجيل الدخول بـ Google");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "فشل تسجيل الدخول بـ Google");
    }
  };

  const handleGitHub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      toast.success("تم تسجيل الدخول بـ GitHub");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "فشل تسجيل الدخول بـ GitHub");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>🔐 SRS</h1>
          <p>تسجيل الدخول إلى حسابك</p>
        </motion.div>
        <div className="social-buttons">
          <button className="btn-social btn-google" onClick={handleGoogle} disabled={loading}>
            <span>🔴</span> Google
          </button>
          <button className="btn-social btn-github" onClick={handleGitHub} disabled={loading}>
            <span>🐙</span> GitHub
          </button>
        </div>
        <div className="divider"><span>أو</span></div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input type="email" {...register("email")} placeholder="example@email.com" />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>
          <div className="form-group">
            <label>كلمة المرور</label>
            <input type="password" {...register("password")} placeholder="••••••••" />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>
          <div className="auth-options">
            <Link to="/forgot-password" className="forgot-link">نسيت كلمة المرور؟</Link>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "⏳ جاري..." : "🔑 تسجيل الدخول"}
          </button>
          <p className="auth-switch">
            ليس لديك حساب؟ <Link to="/register">سجل الآن</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
LEOF

cat > src/auth/pages/RegisterPage.jsx << 'REOF'
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, auth } from "../../lib/firebase";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const registerSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين",
  path: ["confirmPassword"]
});

export const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, { displayName: data.name });
      await sendEmailVerification(userCredential.user);
      toast.success("تم إنشاء الحساب! تحقق من بريدك للتأكيد");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "فشل إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>📝 SRS</h1>
          <p>إنشاء حساب جديد</p>
        </motion.div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>الاسم</label>
            <input type="text" {...register("name")} placeholder="اسمك الكامل" />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>
          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input type="email" {...register("email")} placeholder="example@email.com" />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>
          <div className="form-group">
            <label>كلمة المرور</label>
            <input type="password" {...register("password")} placeholder="••••••••" />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>
          <div className="form-group">
            <label>تأكيد كلمة المرور</label>
            <input type="password" {...register("confirmPassword")} placeholder="••••••••" />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "⏳ جاري..." : "✅ إنشاء حساب"}
          </button>
          <p className="auth-switch">
            لديك حساب؟ <Link to="/login">سجل دخول</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
REOF

cat > src/auth/pages/ForgotPasswordPage.jsx << 'FEOF2'
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendPasswordResetEmail, auth } from "../../lib/firebase";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const forgotSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صحيح")
});

export const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setSent(true);
      toast.success("تم إرسال رابط إعادة التعيين إلى بريدك");
    } catch (error) {
      toast.error(error.message || "فشل إرسال رابط إعادة التعيين");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-container text-center">
          <h1>📧 تم الإرسال</h1>
          <p>تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني</p>
          <Link to="/login" className="btn btn-primary">العودة لتسجيل الدخول</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>🔑 SRS</h1>
          <p>إعادة تعيين كلمة المرور</p>
        </motion.div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input type="email" {...register("email")} placeholder="example@email.com" />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "⏳ جاري..." : "📧 إرسال رابط"}
          </button>
          <p className="auth-switch">
            <Link to="/login">↩️ العودة لتسجيل الدخول</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
FEOF2

echo "📁 تحديث App.jsx..."
cat > src/App.jsx << 'APPEOF'
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/context/AuthContext";
import { ProtectedRoute } from "./auth/components/ProtectedRoute";
import { LoginPage } from "./auth/pages/LoginPage";
import { RegisterPage } from "./auth/pages/RegisterPage";
import { ForgotPasswordPage } from "./auth/pages/ForgotPasswordPage";
import Dashboard from "./Dashboard";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
APPEOF

echo "📁 تحديث App.css..."
cat >> src/App.css << 'CSSEOF'

/* Auth Styles */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}
.auth-container {
  background: white;
  padding: 2.5rem;
  border-radius: 1.5rem;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
}
.auth-container h1 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #1a202c;
}
.auth-container p {
  text-align: center;
  color: #718096;
  margin-bottom: 1.5rem;
}
.auth-container .form-group {
  margin-bottom: 1.25rem;
}
.auth-container .form-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}
.auth-container .form-group input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}
.auth-container .form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
}
.auth-container .error {
  color: #fc8181;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}
.auth-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.25rem;
}
.forgot-link {
  color: #667eea;
  font-size: 0.875rem;
  text-decoration: none;
}
.forgot-link:hover {
  text-decoration: underline;
}
.social-buttons {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}
.btn-social {
  flex: 1;
  padding: 0.625rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.btn-social:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-google {
  background: white;
  color: #333;
  border: 2px solid #ddd;
}
.btn-google:hover:not(:disabled) {
  background: #f8f8f8;
  border-color: #4285f4;
  transform: translateY(-1px);
}
.btn-github {
  background: #24292e;
  color: white;
  border: 2px solid #24292e;
}
.btn-github:hover:not(:disabled) {
  background: #2f363d;
  transform: translateY(-1px);
}
.divider {
  display: flex;
  align-items: center;
  margin: 1.25rem 0;
  color: #a0aec0;
  font-size: 0.75rem;
}
.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}
.divider span {
  padding: 0 0.75rem;
}
.btn-block {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 0.5rem;
}
.auth-switch {
  text-align: center;
  margin-top: 1.25rem;
  font-size: 0.875rem;
  color: #718096;
}
.auth-switch a {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
}
.auth-switch a:hover {
  text-decoration: underline;
}
.text-center {
  text-align: center;
}
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.5rem;
  color: #667eea;
}
@media (prefers-color-scheme: dark) {
  .auth-container {
    background: #2d3748;
  }
  .auth-container h1 {
    color: #e2e8f0;
  }
  .auth-container p {
    color: #a0aec0;
  }
  .auth-container .form-group label {
    color: #a0aec0;
  }
  .auth-container .form-group input {
    background: #4a5568;
    border-color: #718096;
    color: #e2e8f0;
  }
  .btn-google {
    background: #2d3748;
    color: #e2e8f0;
    border-color: #4a5568;
  }
  .btn-google:hover:not(:disabled) {
    background: #3d4a5c;
    border-color: #667eea;
  }
  .divider::before,
  .divider::after {
    background: #4a5568;
  }
  .divider span {
    color: #718096;
  }
}
@media (max-width: 768px) {
  .auth-container {
    padding: 1.5rem;
    margin: 0.5rem;
  }
  .social-buttons {
    flex-direction: column;
  }
}
CSSEOF

echo "📁 إنشاء .env.example..."
cat > .env.example << 'ENVEOF'
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_API_URL=http://localhost:5000/api
NODE_ENV=development
ENVEOF

echo "📤 رفع التغييرات على GitHub..."
git add .
git commit -m "🔐 إضافة بوابة المصادقة الاحترافية" 2>/dev/null || echo "⚠️ لا توجد تغييرات"
git push origin main 2>/dev/null || echo "⚠️ فشل الرفع"

echo ""
echo "============================================"
echo "✅ تم تنفيذ بوابة المصادقة بالكامل!"
echo "============================================"
echo ""
echo "📊 ما تم إنشاؤه:"
echo "  ✅ Login Page"
echo "  ✅ Register Page"
echo "  ✅ Forgot Password Page"
echo "  ✅ AuthContext + useAuth Hook"
echo "  ✅ ProtectedRoute"
echo "  ✅ Firebase Integration"
echo "  ✅ Dark/Light Mode"
echo "  ✅ Validation with Zod"
echo "  ✅ Toast Notifications"
echo ""
echo "🔧 الخطوة التالية:"
echo "  1. اذهب لـ Firebase Console"
echo "  2. أنشئ مشروع جديد"
echo "  3. فعّل Authentication (Google + GitHub)"
echo "  4. ضع الإعدادات في .env"
echo "  5. npm run dev"
echo ""
echo "🌐 GitHub: https://github.com/sayedabdelkarimbsu/SRS"
echo "============================================"
