// src/context/authcontext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:3001/profile");
      setUser(response.data.user);
    } catch (error) {
      console.error("Profile fetch failed:", error);
      setUser(null);
    }
  };

  const register = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:3001/register", { username, password });
      const loginResponse = await axios.post("http://localhost:3001/login", { username, password });
      const { token, user } = loginResponse.data;
      localStorage.setItem("token", token);
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
    } catch (error) {
      console.error("Registration or login failed:", error);
      throw error;
    }
  };

  const login = async (username, password) => {
    try {
      const res = await axios.post("http://localhost:3001/login", { username, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      fetchUserProfile();
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const updateProfile = async (formData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post("http://localhost:3001/profile", formData, config);
      setUser(response.data.user);
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
