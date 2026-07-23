import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const request = async (fn, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn(...args);
      return result;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const result = await request(api.login, email, password);
    if (result.success && result.token) {
      localStorage.setItem("token", result.token);
      setToken(result.token);
    }
    return result;
  };

  const register = async (email, password, name) => {
    return await request(api.register, email, password, name);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success("Logged out");
  };

  const getProfile = async () => {
    if (!token) return { success: false, error: "No token" };
    return await request(api.getProfile, token);
  };

  const updateProfile = async (profile) => {
    if (!token) return { success: false, error: "No token" };
    return await request(api.updateProfile, token, profile);
  };

  return {
    loading,
    error,
    token,
    login,
    register,
    logout,
    getProfile,
    updateProfile,
    api
  };
};

export default useApi;
