import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar';
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage'; 
import AddPostPage from './pages/AddPostPage'; // Impor halaman baru
import PostDetail from './pages/PostDetail';
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from './context/authcontext';


function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/LoginPage" element={<LoginPage />} />
          <Route exact path="/RegisterPage" element={<RegisterPage />} />
          <Route exact path="/AddPostPage" element={<AddPostPage />} /> {/* Tambahkan route untuk AddPostPage */}
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
