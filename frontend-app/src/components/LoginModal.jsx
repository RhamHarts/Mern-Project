import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      // Setelah login berhasil, tutup modal dan navigasi ke halaman home
      onClose();
      navigate("/");
    } catch (error) {
      setLoginError("Login failed. Please try again.");
    }
  };

  // Klik di luar modal untuk menutupnya
  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-wrapper") {
      onClose();
    }
  };

  if (!isOpen) return null; // Jangan render modal jika isOpen false

  return (
    <div
      id="modal-wrapper"
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-center text-2xl font-bold mb-4">Login</h2>
        {loginError && <p className="text-red-500">{loginError}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-blue-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
