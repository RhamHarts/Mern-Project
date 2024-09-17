import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage'; 
import AddPostPage from './pages/AddPostPage'; // Impor halaman baru
import PostDetail from './pages/PostDetail';
import MyProfilePage from "./pages/MyProfilePage";
import EditPostPage from './pages/EditPostPage';
import { AuthProvider } from './context/authcontext';
import SearchResultsPage from './pages/SearchResultPage'; // Import SearchResultsPage
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { PostsProvider } from "./context/postcontext";
import PostList from './components/PostList';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
       <PostsProvider>
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/LoginPage" element={<LoginPage />} />
          <Route exact path="/RegisterPage" element={<RegisterPage />} />
          <Route exact path="/AddPostPage" element={<AddPostPage />} /> {/* Tambahkan route untuk AddPostPage */}
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/MyProfilePage" element={<MyProfilePage />} />
          <Route path="/post/edit/:postId" element={<EditPostPage />} />
          <Route path="/search" element={<SearchResultsPage />} /> {/* Add SearchResultsPage route */}
          <Route path="/About" element={<About />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Terms" element={<Terms />} />
          <Route path="/Privacy" element={<Privacy />} />
          <Route path="/" element={<PostList />} />
          <Route path="/profile/:author" element={<ProfilePage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
    </PostsProvider>
    </AuthProvider>
  );
}

export default App;
