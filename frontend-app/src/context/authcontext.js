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
      fetchUserProfile(storedToken);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get("http://localhost:3001/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.user) {
        setUser(response.data.user); // Memastikan bahwa objek user diterima
      } else {
        console.error("User data not found in response:", response.data);
      }
    } catch (error) {
      console.error("Profile fetch failed:", error);
      setUser(null);
    }
  };

  const fetchUserProfileNow = async (token) => {
    try {
      const response = await axios.get("http://localhost:3001/profile/now", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.profile) {
        setUser(response.data.profile); // Memastikan bahwa objek profile diterima
      } else {
        console.error("Profile data not found in response:", response.data);
      }
    } catch (error) {
      console.error("Profile fetch failed:", error);
      setUser(null);
    }
  };

  const register = async (username, password) => {
    try {
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
      fetchUserProfile(res.data.token);
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
      const response = await axios.post("http://localhost:3001/profile/now", formData, config);
      setUser(response.data.user);
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  const fetchUserPosts = async () => {
    try {
      if (!token) throw new Error("No token found");
      const response = await axios.get("http://localhost:3001/profile/posts", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.posts; // Pastikan response memiliki data.posts
    } catch (error) {
      console.error("Error fetching user posts:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile, fetchUserProfile, fetchUserProfileNow, fetchUserPosts }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
