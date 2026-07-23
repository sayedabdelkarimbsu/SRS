import React, { useState } from "react";

// ============================================================
// 1. Personal Information
// ============================================================
export const PersonalInfo = ({ profile, onSave }) => {
  const [data, setData] = useState(profile?.personal || {});
  const handleChange = (field, value) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onSave({ ...profile, personal: newData });
  };
  return (
    <div className="section-container">
      <h2>👤 Personal Information</h2>
      <div className="form-grid">
        <div className="form-group"><label>Title</label>
          <select value={data.title || ''} onChange={e => handleChange('title', e.target.value)}>
            <option value="">Select</option><option value="Dr">Dr.</option><option value="Prof">Prof.</option>
            <option value="Mr">Mr.</option><option value="Ms">Ms.</option><option value="Mrs">Mrs.</option>
          </select>
        </div>
        <div className="form-group"><label>First Name *</label><input type="text" value={data.firstName || ''} onChange={e => handleChange('firstName', e.target.value)} /></div>
        <div className="form-group"><label>Middle Name</label><input type="text" value={data.middleName || ''} onChange={e => handleChange('middleName', e.target.value)} /></div>
        <div className="form-group"><label>Last Name *</label><input type="text" value={data.lastName || ''} onChange={e => handleChange('lastName', e.target.value)} /></div>
        <div className="form-group"><label>Full Name</label><input type="text" value={data.fullName || ''} onChange={e => handleChange('fullName', e.target.value)} /></div>
        <div className="form-group"><label>Preferred Name</label><input type="text" value={data.preferredName || ''} onChange={e => handleChange('preferredName', e.target.value)} /></div>
        <div className="form-group"><label>Gender</label>
          <select value={data.gender || ''} onChange={e => handleChange('gender', e.target.value)}>
            <option value="">Select</option><option value="male">Male</option><option value="female">Female</option>
          </select>
        </div>
        <div className="form-group"><label>Date of Birth</label><input type="date" value={data.dob || ''} onChange={e => handleChange('dob', e.target.value)} /></div>
        <div className="form-group"><label>Age</label><input type="number" value={data.age || ''} onChange={e => handleChange('age', e.target.value)} /></div>
        <div className="form-group"><label>Marital Status</label>
          <select value={data.maritalStatus || ''} onChange={e => handleChange('maritalStatus', e.target.value)}>
            <option value="">Select</option><option value="single">Single</option><option value="married">Married</option>
            <option value="divorced">Divorced</option><option value="widowed">Widowed</option>
          </select>
        </div>
        <div className="form-group"><label>Nationality</label><input type="text" value={data.nationality || ''} onChange={e => handleChange('nationality', e.target.value)} /></div>
        <div className="form-group"><label>Country of Birth</label><input type="text" value={data.countryOfBirth || ''} onChange={e => handleChange('countryOfBirth', e.target.value)} /></div>
        <div className="form-group"><label>City of Birth</label><input type="text" value={data.cityOfBirth || ''} onChange={e => handleChange('cityOfBirth', e.target.value)} /></div>
        <div className="form-group"><label>National ID Number</label><input type="text" value={data.nationalId || ''} onChange={e => handleChange('nationalId', e.target.value)} /></div>
        <div className="form-group"><label>Passport Number</label><input type="text" value={data.passportNumber || ''} onChange={e => handleChange('passportNumber', e.target.value)} /></div>
        <div className="form-group"><label>Passport Issue Date</label><input type="date" value={data.passportIssueDate || ''} onChange={e => handleChange('passportIssueDate', e.target.value)} /></div>
        <div className="form-group"><label>Passport Expiry Date</label><input type="date" value={data.passportExpiryDate || ''} onChange={e => handleChange('passportExpiryDate', e.target.value)} /></div>
        <div className="form-group full-width"><label>Profile Photo</label>
          <div className="upload-area-small"><span>📸 Click to upload photo</span></div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 2. Contact Information
// ============================================================
export const ContactInfo = ({ profile, onSave }) => {
  const [data, setData] = useState(profile?.contact || {});
  const handleChange = (field, value) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onSave({ ...profile, contact: newData });
  };
  return (
    <div className="section-container">
      <h2>📞 Contact Information</h2>
      <div className="form-grid">
        <div className="form-group"><label>Personal Email</label><input type="email" value={data.personalEmail || ''} onChange={e => handleChange('personalEmail', e.target.value)} /></div>
        <div className="form-group"><label>Institutional Email</label><input type="email" value={data.institutionalEmail || ''} onChange={e => handleChange('institutionalEmail', e.target.value)} /></div>
        <div className="form-group"><label>Primary Phone</label><input type="tel" value={data.primaryPhone || ''} onChange={e => handleChange('primaryPhone', e.target.value)} /></div>
        <div className="form-group"><label>Alternative Phone</label><input type="tel" value={data.alternativePhone || ''} onChange={e => handleChange('alternativePhone', e.target.value)} /></div>
        <div className="form-group"><label>WhatsApp Number</label><input type="tel" value={data.whatsapp || ''} onChange={e => handleChange('whatsapp', e.target.value)} /></div>
        <div className="form-group full-width"><label>Street Address</label><input type="text" value={data.address || ''} onChange={e => handleChange('address', e.target.value)} /></div>
        <div className="form-group"><label>City</label><input type="text" value={data.city || ''} onChange={e => handleChange('city', e.target.value)} /></div>
        <div className="form-group"><label>State/Governorate</label><input type="text" value={data.state || ''} onChange={e => handleChange('state', e.target.value)} /></div>
        <div className="form-group"><label>Country</label>
          <select value={data.country || ''} onChange={e => handleChange('country', e.target.value)}>
            <option value="">Select</option><option value="US">United States</option><option value="UK">United Kingdom</option>
            <option value="EG">Egypt</option><option value="SA">Saudi Arabia</option><option value="AE">UAE</option>
          </select>
        </div>
        <div className="form-group"><label>Postal/ZIP Code</label><input type="text" value={data.postalCode || ''} onChange={e => handleChange('postalCode', e.target.value)} /></div>
      </div>
    </div>
  );
};

// ============================================================
// 3. Professional Profiles & Identifiers
// ============================================================
export const ProfessionalProfiles = ({ profile, onSave }) => {
  const [data, setData] = useState(profile?.professional || {});
  const handleChange = (field, value) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onSave({ ...profile, professional: newData });
  };
  const fields = [
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'orcid', label: 'ORCID' },
    { key: 'googleScholar', label: 'Google Scholar' },
    { key: 'researchGate', label: 'ResearchGate' },
    { key: 'scopus', label: 'Scopus Author ID' },
    { key: 'wos', label: 'Web of Science Researcher ID' },
    { key: 'github', label: 'GitHub' },
    { key: 'website', label: 'Personal Website' },
    { key: 'portfolio', label: 'Portfolio URL' },
    { key: 'skype', label: 'Skype ID' },
    { key: 'twitter', label: 'X/Twitter' },
    { key: 'facebook', label: 'Facebook' }
  ];
  return (
    <div className="section-container">
      <h2>🔗 Professional Profiles & Identifiers</h2>
      <div className="form-grid">
        {fields.map(f => (
          <div key={f.key} className="form-group"><label>{f.label}</label><input type="text" value={data[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)} /></div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// 4. Academic Qualifications
// ============================================================
export const AcademicQualifications = ({ profile, onSave }) => {
  const [items, setItems] = useState(profile?.academic || []);
  const add = () => setItems([...items, { id: Date.now().toString(), degree: '', major: '', subSpecialization: '', university: '', faculty: '', department: '', country: '', startYear: '', graduationYear: '', gpa: '', gradingScale: '', thesisTitle: '', supervisor: '', status: '' }]);
  const update = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setItems(newItems);
    onSave({ ...profile, academic: newItems });
  };
  const remove = (idx) => {
    const newItems = items.filter((_, i) => i !== idx);
    setItems(newItems);
    onSave({ ...profile, academic: newItems });
  };
  return (
    <div className="section-container">
      <h2>🎓 Academic Qualifications</h2>
      <button className="btn btn-secondary" onClick={add}>+ Add Qualification</button>
      {items.map((item, idx) => (
        <div key={item.id} className="form-card">
          <div className="form-card-header"><h4>Qualification #{idx+1}</h4><button className="btn btn-danger" onClick={() => remove(idx)}>✕</button></div>
          <div className="form-grid">
            <div className="form-group"><label>Degree Level</label>
              <select value={item.degree || ''} onChange={e => update(idx, 'degree', e.target.value)}>
                <option value="">Select</option><option value="BSc">BSc</option><option value="BA">BA</option>
                <option value="MSc">MSc</option><option value="MA">MA</option><option value="MBA">MBA</option>
                <option value="PhD">PhD</option><option value="MD">MD</option>
              </select>
            </div>
            <div className="form-group"><label>Major Discipline</label><input type="text" value={item.major || ''} onChange={e => update(idx, 'major', e.target.value)} /></div>
            <div className="form-group"><label>Sub-Specialization</label><input type="text" value={item.subSpecialization || ''} onChange={e => update(idx, 'subSpecialization', e.target.value)} /></div>
            <div className="form-group"><label>University/Institution</label><input type="text" value={item.university || ''} onChange={e => update(idx, 'university', e.target.value)} /></div>
            <div className="form-group"><label>Faculty/College</label><input type="text" value={item.faculty || ''} onChange={e => update(idx, 'faculty', e.target.value)} /></div>
            <div className="form-group"><label>Department</label><input type="text" value={item.department || ''} onChange={e => update(idx, 'department', e.target.value)} /></div>
            <div className="form-group"><label>Country</label>
              <select value={item.country || ''} onChange={e => update(idx, 'country', e.target.value)}>
                <option value="">Select</option><option value="US">US</option><option value="UK">UK</option>
                <option value="EG">Egypt</option><option value="SA">Saudi</option><option value="AE">UAE</option>
              </select>
            </div>
            <div className="form-group"><label>Start Year</label><input type="number" value={item.startYear || ''} onChange={e => update(idx, 'startYear', e.target.value)} /></div>
            <div className="form-group"><label>Graduation Year</label><input type="number" value={item.graduationYear || ''} onChange={e => update(idx, 'graduationYear', e.target.value)} /></div>
            <div className="form-group"><label>GPA</label><input type="number" step="0.01" value={item.gpa || ''} onChange={e => update(idx, 'gpa', e.target.value)} /></div>
            <div className="form-group"><label>Grading Scale</label><input type="text" value={item.gradingScale || ''} onChange={e => update(idx, 'gradingScale', e.target.value)} /></div>
            <div className="form-group full-width"><label>Thesis Title</label><input type="text" value={item.thesisTitle || ''} onChange={e => update(idx, 'thesisTitle', e.target.value)} /></div>
            <div className="form-group"><label>Primary Supervisor</label><input type="text" value={item.supervisor || ''} onChange={e => update(idx, 'supervisor', e.target.value)} /></div>
            <div className="form-group"><label>Current Academic Status</label>
              <select value={item.status || ''} onChange={e => update(idx, 'status', e.target.value)}>
                <option value="">Select</option><option value="current">Current</option>
                <option value="completed">Completed</option><option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// 5. Professional Work Experience
// ============================================================
export const WorkExperience = ({ profile, onSave }) => {
  const [items, setItems] = useState(profile?.experience || []);
  const add = () => setItems([...items, { id: Date.now().toString(), jobTitle: '', organization: '', department: '', city: '', country: '', startDate: '', endDate: '', employmentType: '', responsibilities: '', achievements: '' }]);
  const update = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setItems(newItems);
    onSave({ ...profile, experience: newItems });
  };
  const remove = (idx) => {
    const newItems = items.filter((_, i) => i !== idx);
    setItems(newItems);
    onSave({ ...profile, experience: newItems });
  };
  return (
    <div className="section-container">
      <h2>💼 Professional Work Experience</h2>
      <button className="btn btn-secondary" onClick={add}>+ Add Experience</button>
      {items.map((item, idx) => (
        <div key={item.id} className="form-card">
          <div className="form-card-header"><h4>Experience #{idx+1}</h4><button className="btn btn-danger" onClick={() => remove(idx)}>✕</button></div>
          <div className="form-grid">
            <div className="form-group"><label>Job Title</label><input type="text" value={item.jobTitle || ''} onChange={e => update(idx, 'jobTitle', e.target.value)} /></div>
            <div className="form-group"><label>Organization</label><input type="text" value={item.organization || ''} onChange={e => update(idx, 'organization', e.target.value)} /></div>
            <div className="form-group"><label>Department</label><input type="text" value={item.department || ''} onChange={e => update(idx, 'department', e.target.value)} /></div>
            <div className="form-group"><label>City</label><input type="text" value={item.city || ''} onChange={e => update(idx, 'city', e.target.value)} /></div>
            <div className="form-group"><label>Country</label>
              <select value={item.country || ''} onChange={e => update(idx, 'country', e.target.value)}>
                <option value="">Select</option><option value="US">US</option><option value="UK">UK</option>
                <option value="EG">Egypt</option><option value="SA">Saudi</option>
              </select>
            </div>
            <div className="form-group"><label>Start Date</label><input type="date" value={item.startDate || ''} onChange={e => update(idx, 'startDate', e.target.value)} /></div>
            <div className="form-group"><label>End Date</label><input type="date" value={item.endDate || ''} onChange={e => update(idx, 'endDate', e.target.value)} /></div>
            <div className="form-group"><label>Employment Type</label>
              <select value={item.employmentType || ''} onChange={e => update(idx, 'employmentType', e.target.value)}>
                <option value="">Select</option><option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option><option value="remote">Remote</option>
              </select>
            </div>
            <div className="form-group full-width"><label>Core Responsibilities</label><textarea rows="2" value={item.responsibilities || ''} onChange={e => update(idx, 'responsibilities', e.target.value)} /></div>
            <div className="form-group full-width"><label>Key Achievements & Impacts</label><textarea rows="2" value={item.achievements || ''} onChange={e => update(idx, 'achievements', e.target.value)} /></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// 6. Scientific Research & Bibliometrics
// ============================================================
export const ScientificResearch = ({ profile, onSave }) => {
  const [data, setData] = useState(profile?.research || {});
  const handleChange = (field, value) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onSave({ ...profile, research: newData });
  };
  return (
    <div className="section-container">
      <h2>📊 Scientific Research & Bibliometrics</h2>
      <div className="form-grid">
        <div className="form-group full-width"><label>Research Interests</label><input type="text" value={data.researchInterests || ''} onChange={e => handleChange('researchInterests', e.target.value)} /></div>
        <div className="form-group full-width"><label>Keywords</label><input type="text" value={data.keywords || ''} onChange={e => handleChange('keywords', e.target.value)} /></div>
        <div className="form-group full-width"><label>Core Areas of Expertise</label><input type="text" value={data.expertise || ''} onChange={e => handleChange('expertise', e.target.value)} /></div>
        <div className="form-group"><label>Total Publications</label><input type="number" value={data.totalPublications || ''} onChange={e => handleChange('totalPublications', e.target.value)} /></div>
        <div className="form-group"><label>DOIs</label><input type="text" value={data.dois || ''} onChange={e => handleChange('dois', e.target.value)} /></div>
        <div className="form-group"><label>Total Citations</label><input type="number" value={data.totalCitations || ''} onChange={e => handleChange('totalCitations', e.target.value)} /></div>
        <div className="form-group"><label>h-index</label><input type="number" value={data.hindex || ''} onChange={e => handleChange('hindex', e.target.value)} /></div>
        <div className="form-group"><label>i10-index</label><input type="number" value={data.i10index || ''} onChange={e => handleChange('i10index', e.target.value)} /></div>
        <div className="form-group"><label>Patents</label><input type="number" value={data.patents || ''} onChange={e => handleChange('patents', e.target.value)} /></div>
        <div className="form-group"><label>Published Books</label><input type="number" value={data.publishedBooks || ''} onChange={e => handleChange('publishedBooks', e.target.value)} /></div>
        <div className="form-group"><label>Book Chapters</label><input type="number" value={data.bookChapters || ''} onChange={e => handleChange('bookChapters', e.target.value)} /></div>
      </div>
    </div>
  );
};

// ============================================================
// 7. Research Projects & Grants
// ============================================================
export const ResearchProjects = ({ profile, onSave }) => {
  const [items, setItems] = useState(profile?.projects || []);
  const add = () => setItems([...items, { id: Date.now().toString(), title: '', fundingAgency: '', budget: '', duration: '', role: '', partners: '', deliverables: '', fellowships: '', grants: '' }]);
  const update = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setItems(newItems);
    onSave({ ...profile, projects: newItems });
  };
  const remove = (idx) => {
    const newItems = items.filter((_, i) => i !== idx);
    setItems(newItems);
    onSave({ ...profile, projects: newItems });
  };
  return (
    <div className="section-container">
      <h2>🔬 Research Projects & Grants</h2>
      <button className="btn btn-secondary" onClick={add}>+ Add Project</button>
      {items.map((item, idx) => (
        <div key={item.id} className="form-card">
          <div className="form-card-header"><h4>Project #{idx+1}</h4><button className="btn btn-danger" onClick={() => remove(idx)}>✕</button></div>
          <div className="form-grid">
            <div className="form-group full-width"><label>Project Title</label><input type="text" value={item.title || ''} onChange={e => update(idx, 'title', e.target.value)} /></div>
            <div className="form-group"><label>Funding Agency</label><input type="text" value={item.fundingAgency || ''} onChange={e => update(idx, 'fundingAgency', e.target.value)} /></div>
            <div className="form-group"><label>Budget</label><input type="text" value={item.budget || ''} onChange={e => update(idx, 'budget', e.target.value)} /></div>
            <div className="form-group"><label>Project Duration</label><input type="text" value={item.duration || ''} onChange={e => update(idx, 'duration', e.target.value)} /></div>
            <div className="form-group"><label>Role/PI Status</label>
              <select value={item.role || ''} onChange={e => update(idx, 'role', e.target.value)}>
                <option value="">Select</option><option value="pi">Principal Investigator</option>
                <option value="co-pi">Co-Investigator</option><option value="member">Team Member</option>
              </select>
            </div>
            <div className="form-group"><label>Consortium Partners</label><input type="text" value={item.partners || ''} onChange={e => update(idx, 'partners', e.target.value)} /></div>
            <div className="form-group full-width"><label>Deliverables & Outcomes</label><textarea rows="2" value={item.deliverables || ''} onChange={e => update(idx, 'deliverables', e.target.value)} /></div>
            <div className="form-group"><label>Fellowships</label><input type="text" value={item.fellowships || ''} onChange={e => update(idx, 'fellowships', e.target.value)} /></div>
            <div className="form-group"><label>Research Grants</label><input type="text" value={item.grants || ''} onChange={e => update(idx, 'grants', e.target.value)} /></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// 8. Skills Inventory
// ============================================================
export const SkillsInventory = ({ profile, onSave }) => {
  const [data, setData] = useState(profile?.skills || {});
  const handleChange = (field, value) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onSave({ ...profile, skills: newData });
  };
  const skills = [
    { key: 'technical', label: 'Technical Skills' },
    { key: 'programming', label: 'Programming Languages' },
    { key: 'dataAnalysis', label: 'Data Analysis' },
    { key: 'statistical', label: 'Statistical Toolkits' },
    { key: 'ai', label: 'Artificial Intelligence' },
    { key: 'ml', label: 'Machine Learning Models' },
    { key: 'database', label: 'Database Management' },
    { key: 'office', label: 'Microsoft Office Suite' },
    { key: 'projectManagement', label: 'Project Management' },
    { key: 'leadership', label: 'Leadership' },
    { key: 'communication', label: 'Communication' },
    { key: 'teamwork', label: 'Teamwork' }
  ];
  return (
    <div className="section-container">
      <h2>🛠️ Skills Inventory</h2>
      <div className="form-grid">
        {skills.map(s => (
          <div key={s.key} className="form-group"><label>{s.label}</label><input type="text" value={data[s.key] || ''} onChange={e => handleChange(s.key, e.target.value)} /></div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// 9. Language Proficiency
// ============================================================
export const LanguageProficiency = ({ profile, onSave }) => {
  const [items, setItems] = useState(profile?.languages || []);
  const add = () => setItems([...items, { id: Date.now().toString(), language: '', reading: '', writing: '', speaking: '', certifications: '' }]);
  const update = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setItems(newItems);
    onSave({ ...profile, languages: newItems });
  };
  const remove = (idx) => {
    const newItems = items.filter((_, i) => i !== idx);
    setItems(newItems);
    onSave({ ...profile, languages: newItems });
  };
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Fluent', 'Native'];
  return (
    <div className="section-container">
      <h2>🌐 Language Proficiency</h2>
      <button className="btn btn-secondary" onClick={add}>+ Add Language</button>
      {items.map((item, idx) => (
        <div key={item.id} className="form-card">
          <div className="form-card-header"><h4>Language #{idx+1}</h4><button className="btn btn-danger" onClick={() => remove(idx)}>✕</button></div>
          <div className="form-grid">
            <div className="form-group"><label>Language</label><input type="text" value={item.language || ''} onChange={e => update(idx, 'language', e.target.value)} /></div>
            <div className="form-group"><label>Reading Level</label>
              <select value={item.reading || ''} onChange={e => update(idx, 'reading', e.target.value)}>
                <option value="">Select</option>{levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Writing Level</label>
              <select value={item.writing || ''} onChange={e => update(idx, 'writing', e.target.value)}>
                <option value="">Select</option>{levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Speaking Level</label>
              <select value={item.speaking || ''} onChange={e => update(idx, 'speaking', e.target.value)}>
                <option value="">Select</option>{levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="form-group full-width"><label>Certifications (TOEFL/IELTS)</label><input type="text" value={item.certifications || ''} onChange={e => update(idx, 'certifications', e.target.value)} /></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// 10. Certifications & Professional Training
// ============================================================
export const Certifications = ({ profile, onSave }) => {
  const [items, setItems] = useState(profile?.certifications || []);
  const add = () => setItems([...items, { id: Date.now().toString(), title: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', verificationUrl: '' }]);
  const update = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setItems(newItems);
    onSave({ ...profile, certifications: newItems });
  };
  const remove = (idx) => {
    const newItems = items.filter((_, i) => i !== idx);
    setItems(newItems);
    onSave({ ...profile, certifications: newItems });
  };
  return (
    <div className="section-container">
      <h2>📜 Certifications & Professional Training</h2>
      <button className="btn btn-secondary" onClick={add}>+ Add Certification</button>
      {items.map((item, idx) => (
        <div key={item.id} className="form-card">
          <div className="form-card-header"><h4>Certification #{idx+1}</h4><button className="btn btn-danger" onClick={() => remove(idx)}>✕</button></div>
          <div className="form-grid">
            <div className="form-group full-width"><label>Course/Certification Title</label><input type="text" value={item.title || ''} onChange={e => update(idx, 'title', e.target.value)} /></div>
            <div className="form-group"><label>Issuing Organization</label><input type="text" value={item.issuer || ''} onChange={e => update(idx, 'issuer', e.target.value)} /></div>
            <div className="form-group"><label>Issue Date</label><input type="date" value={item.issueDate || ''} onChange={e => update(idx, 'issueDate', e.target.value)} /></div>
            <div className="form-group"><label>Expiry Date</label><input type="date" value={item.expiryDate || ''} onChange={e => update(idx, 'expiryDate', e.target.value)} /></div>
            <div className="form-group"><label>License/Credential ID</label><input type="text" value={item.credentialId || ''} onChange={e => update(idx, 'credentialId', e.target.value)} /></div>
            <div className="form-group full-width"><label>Verification URL</label><input type="url" value={item.verificationUrl || ''} onChange={e => update(idx, 'verificationUrl', e.target.value)} /></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// 11. Conferences, Awards & Memberships
// ============================================================
export const Conferences = ({ profile, onSave }) => {
  const [data, setData] = useState(profile?.conferences || {});
  const handleChange = (field, value) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onSave({ ...profile, conferences: newData });
  };
  return (
    <div className="section-container">
      <h2>🎯 Conferences, Awards & Memberships</h2>
      <div className="form-grid">
        <div className="form-group full-width"><label>Conferences Attended</label><textarea rows="2" value={data.conferencesAttended || ''} onChange={e => handleChange('conferencesAttended', e.target.value)} /></div>
        <div className="form-group full-width"><label>Workshops</label><textarea rows="2" value={data.workshops || ''} onChange={e => handleChange('workshops', e.target.value)} /></div>
        <div className="form-group full-width"><label>Academic Awards & Honors</label><textarea rows="2" value={data.awards || ''} onChange={e => handleChange('awards', e.target.value)} /></div>
        <div className="form-group full-width"><label>Professional Memberships</label><textarea rows="2" value={data.memberships || ''} onChange={e => handleChange('memberships', e.target.value)} /></div>
        <div className="form-group full-width"><label>Scientific Societies</label><textarea rows="2" value={data.societies || ''} onChange={e => handleChange('societies', e.target.value)} /></div>
      </div>
    </div>
  );
};

// ============================================================
// 12. Employment Preferences
// ============================================================
export const EmploymentPreferences = ({ profile, onSave }) => {
  const [data, setData] = useState(profile?.preferences || {});
  const handleChange = (field, value) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onSave({ ...profile, preferences: newData });
  };
  return (
    <div className="section-container">
      <h2>💼 Employment Preferences</h2>
      <div className="form-grid">
        <div className="form-group"><label>Target Job Title</label><input type="text" value={data.targetJobTitle || ''} onChange={e => handleChange('targetJobTitle', e.target.value)} /></div>
        <div className="form-group"><label>Preferred Employment Type</label>
          <select value={data.preferredEmploymentType || ''} onChange={e => handleChange('preferredEmploymentType', e.target.value)}>
            <option value="">Select</option><option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option><option value="remote">Remote</option>
          </select>
        </div>
        <div className="form-group"><label>Availability</label>
          <select value={data.availability || ''} onChange={e => handleChange('availability', e.target.value)}>
            <option value="">Select</option><option value="immediate">Immediate</option>
            <option value="one-week">1 Week</option><option value="two-weeks">2 Weeks</option>
            <option value="one-month">1 Month</option>
          </select>
        </div>
        <div className="form-group"><label>Expected Compensation</label><input type="text" value={data.expectedCompensation || ''} onChange={e => handleChange('expectedCompensation', e.target.value)} /></div>
        <div className="form-group"><label>Willingness to Travel</label>
          <select value={data.willingToTravel || ''} onChange={e => handleChange('willingToTravel', e.target.value)}>
            <option value="">Select</option><option value="yes">Yes</option><option value="no">No</option>
            <option value="sometimes">Sometimes</option>
          </select>
        </div>
        <div className="form-group"><label>Willingness to Relocate</label>
          <select value={data.willingToRelocate || ''} onChange={e => handleChange('willingToRelocate', e.target.value)}>
            <option value="">Select</option><option value="yes">Yes</option><option value="no">No</option>
            <option value="consider">Consider</option>
          </select>
        </div>
        <div className="form-group"><label>Work Permit Status</label><input type="text" value={data.workPermit || ''} onChange={e => handleChange('workPermit', e.target.value)} /></div>
        <div className="form-group"><label>Visa Status</label><input type="text" value={data.visaStatus || ''} onChange={e => handleChange('visaStatus', e.target.value)} /></div>
        <div className="form-group"><label>Target Start Date</label><input type="date" value={data.targetStartDate || ''} onChange={e => handleChange('targetStartDate', e.target.value)} /></div>
      </div>
    </div>
  );
};

// ============================================================
// 13. Professional References
// ============================================================
export const ProfessionalReferences = ({ profile, onSave }) => {
  const [items, setItems] = useState(profile?.references || []);
  const add = () => setItems([...items, { id: Date.now().toString(), name: '', jobTitle: '', organization: '', email: '', phone: '', relationship: '' }]);
  const update = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setItems(newItems);
    onSave({ ...profile, references: newItems });
  };
  const remove = (idx) => {
    const newItems = items.filter((_, i) => i !== idx);
    setItems(newItems);
    onSave({ ...profile, references: newItems });
  };
  return (
    <div className="section-container">
      <h2>👥 Professional References</h2>
      <button className="btn btn-secondary" onClick={add}>+ Add Reference</button>
      {items.map((item, idx) => (
        <div key={item.id} className="form-card">
          <div className="form-card-header"><h4>Reference #{idx+1}</h4><button className="btn btn-danger" onClick={() => remove(idx)}>✕</button></div>
          <div className="form-grid">
            <div className="form-group"><label>Full Name</label><input type="text" value={item.name || ''} onChange={e => update(idx, 'name', e.target.value)} /></div>
            <div className="form-group"><label>Job Title/Designation</label><input type="text" value={item.jobTitle || ''} onChange={e => update(idx, 'jobTitle', e.target.value)} /></div>
            <div className="form-group"><label>Organization</label><input type="text" value={item.organization || ''} onChange={e => update(idx, 'organization', e.target.value)} /></div>
            <div className="form-group"><label>Professional Email</label><input type="email" value={item.email || ''} onChange={e => update(idx, 'email', e.target.value)} /></div>
            <div className="form-group"><label>Phone Number</label><input type="tel" value={item.phone || ''} onChange={e => update(idx, 'phone', e.target.value)} /></div>
            <div className="form-group"><label>Relationship</label><input type="text" value={item.relationship || ''} onChange={e => update(idx, 'relationship', e.target.value)} /></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// 14. Document Management System (DMS)
// ============================================================
export const DocumentManagement = ({ profile, onSave }) => {
  const [docs, setDocs] = useState(profile?.documents || []);
  
  const handleUpload = (e) => {
    const files = e.target.files;
    if (!files) return;
    const newDocs = Array.from(files).map(f => ({
      id: Date.now().toString() + Math.random(),
      name: f.name,
      size: f.size,
      type: f.type,
      uploadedAt: new Date().toISOString()
    }));
    const allDocs = [...docs, ...newDocs];
    setDocs(allDocs);
    onSave({ ...profile, documents: allDocs });
  };

  const removeDoc = (id) => {
    const newDocs = docs.filter(d => d.id !== id);
    setDocs(newDocs);
    onSave({ ...profile, documents: newDocs });
  };

  const documentTypes = [
    'Profile Photo', 'Curriculum Vitae (CV)', 'Cover Letter', 'Personal Statement',
    'Motivation Letter', 'Research Statement', 'Teaching Statement', 'List of Publications',
    'Project Portfolios', 'Academic Transcripts & Degrees', 'National ID', 'Passport Pages'
  ];

  return (
    <div className="section-container">
      <h2>📁 Document Management System</h2>
      
      <div className="doc-categories">
        {documentTypes.map((type, i) => (
          <div key={i} className="doc-category">
            <span>{type}</span>
            <div className="upload-area-small">
              <span>📤 Upload</span>
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" onChange={handleUpload} style={{ display: 'none' }} />
            </div>
          </div>
        ))}
      </div>

      <div className="upload-area" onClick={() => document.getElementById('dmsInput')?.click()}>
        <div className="upload-icon">📤</div>
        <p>Click to upload documents (PDF, Word, Excel, Images)</p>
        <input id="dmsInput" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" onChange={handleUpload} style={{ display: 'none' }} />
      </div>

      <div className="document-grid">
        {docs.map(doc => (
          <div key={doc.id} className="document-card">
            <div className="doc-icon">📄</div>
            <div className="doc-info">
              <p className="doc-name">{doc.name}</p>
              <p className="doc-size">{(doc.size/1024).toFixed(1)} KB</p>
              <p className="doc-date">{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('en-US') : ''}</p>
            </div>
            <button className="doc-remove" onClick={() => removeDoc(doc.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};
