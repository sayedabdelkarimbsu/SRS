const API_URL = "http://localhost:5500/api";

export const api = {
  async getHealth() {
    const res = await fetch(`${API_URL}/health`);
    return res.json();
  },
  
  async saveProfile(data) {
    const res = await fetch(`${API_URL}/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
