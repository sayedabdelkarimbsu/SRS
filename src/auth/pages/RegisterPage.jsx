import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { auth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "../../lib/firebase";
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
