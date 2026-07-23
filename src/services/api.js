const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500/api";

export const api = {
  async register(email, password, name) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name })
    });
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async verify(token) {
    const res = await fetch(`${API_URL}/auth/verify`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  async getProfile(token) {
    const res = await fetch(`${API_URL}/profile`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  async updateProfile(token, profile) {
    const res = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ profile })
    });
    return res.json();
  },

  async getDocuments(token) {
    const res = await fetch(`${API_URL}/documents`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  async getOpportunities(token) {
    const res = await fetch(`${API_URL}/opportunities`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  async createOpportunity(token, data) {
    const res = await fetch(`${API_URL}/opportunities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateOpportunity(token, id, data) {
    const res = await fetch(`${API_URL}/opportunities/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteOpportunity(token, id) {
    const res = await fetch(`${API_URL}/opportunities/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  async uploadFile(token, file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });
    return res.json();
  }
};

export default api;
