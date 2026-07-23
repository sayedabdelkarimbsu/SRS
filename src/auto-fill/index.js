// ============================================================
// 🔄 Auto-Fill Engine - تعبئة النماذج التلقائية
// ============================================================

class AutoFillEngine {
  constructor() {
    this.fields = [];
    this.data = {};
  }

  // تحميل البيانات من LocalStorage أو Firebase
  loadData() {
    try {
      const profile = JSON.parse(localStorage.getItem('profile') || '{}');
      this.data = {
        firstName: profile.personal?.firstName || '',
        lastName: profile.personal?.lastName || '',
        email: profile.personal?.email || profile.contact?.personalEmail || '',
        phone: profile.personal?.phone || profile.contact?.primaryPhone || '',
        address: profile.contact?.address || '',
        city: profile.contact?.city || '',
        country: profile.contact?.country || '',
        jobTitle: profile.experience?.[0]?.jobTitle || '',
        company: profile.experience?.[0]?.organization || '',
        skills: profile.skills?.technical || '',
        ...profile.personal,
        ...profile.contact,
        ...profile.professional
      };
      return this.data;
    } catch {
      return {};
    }
  }

  // البحث عن الحقول في الصفحة
  findFields() {
    const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
    this.fields = Array.from(inputs).map(field => ({
      element: field,
      name: field.name?.toLowerCase() || '',
      id: field.id?.toLowerCase() || '',
      placeholder: field.placeholder?.toLowerCase() || '',
      type: field.type || 'text',
      value: field.value || ''
    }));
    return this.fields;
  }

  // تعبئة النموذج
  fillForm() {
    const data = this.loadData();
    const fields = this.findFields();
    let filled = 0;

    fields.forEach(field => {
      const fieldName = field.name || field.id || '';
      const fieldLabels = [fieldName, field.placeholder, field.id];

      // البحث عن تطابق مع البيانات
      Object.keys(data).forEach(key => {
        const keyLower = key.toLowerCase();
        const match = fieldLabels.some(label => 
          label.includes(keyLower) || keyLower.includes(label)
        );

        if (match && data[key] && !field.element.value) {
          field.element.value = data[key];
          field.element.dispatchEvent(new Event('input', { bubbles: true }));
          field.element.dispatchEvent(new Event('change', { bubbles: true }));
          filled++;
        }
      });
    });

    return { filled, total: fields.length };
  }

  // التعبئة التلقائية عند تحميل الصفحة
  autoFillOnLoad() {
    if (document.readyState === 'complete') {
      return this.fillForm();
    }
    return new Promise((resolve) => {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const result = this.fillForm();
          resolve(result);
        }, 500);
      });
    });
  }
}

export default new AutoFillEngine();
