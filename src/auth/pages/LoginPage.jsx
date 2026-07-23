import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { auth, signInWithEmailAndPassword, signInWithPopup, googleProvider, githubProvider } from "../../lib/firebase";
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
