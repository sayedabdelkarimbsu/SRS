// ============================================================
// 🤖 Auto-Fill Engine - التنفيذ الفعلي
// ============================================================

class AutoFillEngine {
  constructor() {
    this.rules = [];
    this.fieldMappers = {
      'name': ['name', 'fullname', 'username', 'user_name', 'firstname', 'lastname'],
      'email': ['email', 'e-mail', 'mail', 'email_address', 'user_email'],
      'phone': ['phone', 'mobile', 'telephone', 'tel', 'cell', 'phone_number'],
      'address': ['address', 'street', 'location', 'addr', 'address_line'],
      'city': ['city', 'town', 'municipality', 'city_name'],
      'country': ['country', 'nation', 'state', 'country_name'],
      'zip': ['zip', 'postal', 'postcode', 'pincode', 'zipcode'],
      'website': ['website', 'url', 'link', 'site', 'web'],
      'linkedin': ['linkedin', 'linked_in', 'linkedin_url'],
      'github': ['github', 'git_hub', 'github_url'],
      'twitter': ['twitter', 'x', 'social', 'twitter_url'],
      'job': ['job', 'title', 'position', 'role', 'occupation', 'job_title'],
      'company': ['company', 'organization', 'org', 'employer', 'company_name'],
      'education': ['education', 'degree', 'major', 'university', 'college', 'school'],
      'skills': ['skills', 'expertise', 'competencies', 'abilities', 'skill'],
      'languages': ['languages', 'lang', 'spoken', 'language'],
      'experience': ['experience', 'work', 'employment', 'career', 'work_experience'],
      'projects': ['project', 'portfolio', 'work_sample', 'project_name'],
      'certifications': ['certification', 'cert', 'license', 'credential', 'certificate'],
      'references': ['reference', 'referee', 'recommendation', 'refer']
    };
  }

  analyzeForm(form) {
    const fields = [];
    const elements = form.querySelectorAll('input, select, textarea');
    
    elements.forEach(el => {
      const fieldInfo = {
        element: el,
        type: el.type || 'text',
        name: el.name || '',
        id: el.id || '',
        placeholder: el.placeholder || '',
        label: this.getLabel(el),
        value: el.value || '',
        required: el.required || false,
        confidence: 0,
        matchedField: null
      };
      
      Object.entries(this.fieldMappers).forEach(([key, patterns]) => {
        const match = this.matchField(fieldInfo, patterns);
        if (match && match.confidence > fieldInfo.confidence) {
          fieldInfo.matchedField = key;
          fieldInfo.confidence = match.confidence;
        }
      });
      
      fields.push(fieldInfo);
    });
    
    return fields;
  }

  matchField(fieldInfo, patterns) {
    const text = ${fieldInfo.name}   .toLowerCase();
    let bestScore = 0;
    let bestPattern = null;
    
    patterns.forEach(pattern => {
      const score = this.calculateScore(text, pattern);
      if (score > bestScore) {
        bestScore = score;
        bestPattern = pattern;
      }
    });
    
    return bestScore > 0 ? { pattern: bestPattern, confidence: bestScore } : null;
  }

  calculateScore(text, pattern) {
    const patternWords = pattern.toLowerCase().split(/[_\s-]/);
    let score = 0;
    let matched = 0;
    
    patternWords.forEach(word => {
      if (text.includes(word)) {
        score += 1 + (word.length / 10);
        matched++;
      }
    });
    
    return score * (matched / patternWords.length);
  }

  getLabel(element) {
    let label = '';
    const id = element.id;
    if (id) {
      const labelEl = document.querySelector(label[for=""]);
      if (labelEl) label = labelEl.textContent;
    }
    if (!label) {
      const parent = element.closest('.form-group, .field, .input-group');
      if (parent) {
        const labelEl = parent.querySelector('label, .label, .field-label');
        if (labelEl) label = labelEl.textContent;
      }
    }
    return label || '';
  }

  fillForm(form, data) {
    const fields = this.analyzeForm(form);
    let filled = 0;
    let missed = 0;
    
    fields.forEach(field => {
      if (field.matchedField && data[field.matchedField]) {
        const value = data[field.matchedField];
        this.setFieldValue(field.element, value);
        filled++;
      } else {
        missed++;
      }
    });
    
    return { filled, missed, total: fields.length };
  }

  setFieldValue(element, value) {
    if (element.tagName === 'SELECT') {
      const option = Array.from(element.options).find(opt => 
        opt.text.toLowerCase().includes(value.toLowerCase()) ||
        opt.value.toLowerCase().includes(value.toLowerCase())
      );
      if (option) {
        element.value = option.value;
      } else {
        element.value = value;
      }
    } else if (element.type === 'checkbox' || element.type === 'radio') {
      element.checked = element.value === value || element.value.toLowerCase() === value.toLowerCase();
    } else {
      element.value = value;
    }
    
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  findForms() {
    return document.querySelectorAll('form');
  }

  fillAllForms(data) {
    const forms = this.findForms();
    const results = [];
    forms.forEach(form => {
      results.push(this.fillForm(form, data));
    });
    return results;
  }

  createUI() {
    const container = document.createElement('div');
    container.id = 'srs-autofill-ui';
    container.style.cssText = 
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #2d3748;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      z-index: 99999;
      color: white;
      font-family: sans-serif;
      min-width: 200px;
      max-width: 300px;
      border: 1px solid #667eea;
    ;
    
    container.innerHTML = 
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-weight:bold;color:#667eea;">🤖 SRS Auto-Fill</span>
        <span id="srs-af-status" style="font-size:12px;color:#48bb78;">● نشط</span>
      </div>
      <button id="srs-af-fill" style="width:100%;padding:8px;background:#667eea;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;margin-bottom:4px;">
        🚀 تعبئة النموذج
      </button>
      <div id="srs-af-result" style="font-size:12px;color:#a0aec0;margin-top:4px;"></div>
      <button id="srs-af-close" style="position:absolute;top:4px;right:8px;background:none;border:none;color:#fc8181;cursor:pointer;font-size:16px;">✕</button>
    ;
    
    document.body.appendChild(container);
    
    document.getElementById('srs-af-fill').addEventListener('click', () => {
      const data = JSON.parse(localStorage.getItem('profile') || '{}');
      const result = this.fillAllForms(data);
      const total = result.reduce((acc, r) => acc + r.filled, 0);
      document.getElementById('srs-af-result').textContent = ✅ تم تعبئة  حقلاً;
    });
    
    document.getElementById('srs-af-close').addEventListener('click', () => container.remove());
    
    return container;
  }

  init() {
    if (document.readyState === 'complete') {
      setTimeout(() => this.createUI(), 1000);
    } else {
      window.addEventListener('load', () => setTimeout(() => this.createUI(), 1000));
    }
  }
}

window.AutoFillEngine = AutoFillEngine;
window.autoFillEngine = new AutoFillEngine();
window.autoFillEngine.init();

export default AutoFillEngine;
