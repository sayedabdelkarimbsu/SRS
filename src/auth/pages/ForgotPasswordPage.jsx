import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { auth, sendPasswordResetEmail } from "../../lib/firebase";
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
