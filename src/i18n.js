// ============================================================
// 🌍 Multi-Language - بدون JSX
// ============================================================

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      app: { title: 'نظام إدارة الملفات الشخصية', loading: 'جاري التحميل...' },
      auth: { login: 'تسجيل الدخول', register: 'إنشاء حساب', email: 'البريد الإلكتروني', password: 'كلمة المرور', name: 'الاسم الكامل', forgot: 'نسيت كلمة المرور', signIn: 'سجل دخول', signUp: 'سجل الآن' },
      sections: { personal: 'المعلومات الشخصية', contact: 'معلومات التواصل', professional: 'الملفات المهنية', academic: 'المؤهلات الأكاديمية', experience: 'الخبرات المهنية', research: 'البحث العلمي', projects: 'المشاريع البحثية', skills: 'المهارات', languages: 'اللغات', certifications: 'الشهادات', conferences: 'المؤتمرات', preferences: 'تفضيلات التوظيف', references: 'المراجع', documents: 'المستندات' },
      actions: { save: 'حفظ', delete: 'حذف', edit: 'تعديل', add: 'إضافة', cancel: 'إلغاء', confirm: 'تأكيد', search: 'بحث', export: 'تصدير', import: 'استيراد', backup: 'نسخ احتياطي', restore: 'استعادة' },
      messages: { saved: 'تم الحفظ بنجاح', deleted: 'تم الحذف بنجاح', error: 'حدث خطأ', loading: 'جاري التحميل...', noData: 'لا توجد بيانات', confirmDelete: 'هل أنت متأكد من الحذف' },
      status: { online: 'متصل', offline: 'غير متصل', connected: 'متصل', disconnected: 'غير متصل' }
    }
  },
  en: {
    translation: {
      app: { title: 'Professional Profile Management System', loading: 'Loading...' },
      auth: { login: 'Login', register: 'Register', email: 'Email', password: 'Password', name: 'Full Name', forgot: 'Forgot password?', signIn: 'Sign In', signUp: 'Sign Up' },
      sections: { personal: 'Personal Information', contact: 'Contact Information', professional: 'Professional Profiles', academic: 'Academic Qualifications', experience: 'Work Experience', research: 'Scientific Research', projects: 'Research Projects', skills: 'Skills', languages: 'Languages', certifications: 'Certifications', conferences: 'Conferences', preferences: 'Employment Preferences', references: 'Professional References', documents: 'Documents' },
      actions: { save: 'Save', delete: 'Delete', edit: 'Edit', add: 'Add', cancel: 'Cancel', confirm: 'Confirm', search: 'Search', export: 'Export', import: 'Import', backup: 'Backup', restore: 'Restore' },
      messages: { saved: 'Saved successfully', deleted: 'Deleted successfully', error: 'An error occurred', loading: 'Loading...', noData: 'No data available', confirmDelete: 'Are you sure you want to delete?' },
      status: { online: 'Online', offline: 'Offline', connected: 'Connected', disconnected: 'Disconnected' }
    }
  },
  fr: {
    translation: {
      app: { title: "Système de Gestion de Profil", loading: 'Chargement...' },
      auth: { login: 'Connexion', register: "S'inscrire", email: 'Email', password: 'Mot de passe', name: 'Nom complet', forgot: 'Mot de passe oublié?', signIn: 'Se connecter', signUp: "S'inscrire" },
      sections: { personal: 'Informations personnelles', contact: 'Coordonnées', professional: 'Profils professionnels', academic: 'Qualifications académiques', experience: "Expérience professionnelle", research: 'Recherche scientifique', projects: 'Projets de recherche', skills: 'Compétences', languages: 'Langues', certifications: 'Certifications', conferences: 'Conférences', preferences: "Préférences d'emploi", references: 'Références', documents: 'Documents' },
      actions: { save: 'Enregistrer', delete: 'Supprimer', edit: 'Modifier', add: 'Ajouter', cancel: 'Annuler', confirm: 'Confirmer', search: 'Rechercher', export: 'Exporter', import: 'Importer', backup: 'Sauvegarde', restore: 'Restaurer' },
      messages: { saved: 'Enregistré avec succès', deleted: 'Supprimé avec succès', error: 'Une erreur est survenue', loading: 'Chargement...', noData: 'Aucune donnée disponible', confirmDelete: 'Êtes-vous sûr de vouloir supprimer?' },
      status: { online: 'En ligne', offline: 'Hors ligne', connected: 'Connecté', disconnected: 'Déconnecté' }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false }
});

export const changeLanguage = (lang) => {
  i18n.changeLanguage(lang);
  localStorage.setItem('srs_language', lang);
};

export const getCurrentLanguage = () => {
  return localStorage.getItem('srs_language') || 'ar';
};

export default i18n;
