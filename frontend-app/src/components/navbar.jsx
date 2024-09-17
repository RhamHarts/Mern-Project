import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authcontext";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false); // State untuk mengelola visibilitas dropdown
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Reset searchTerm when location changes (i.e., when user navigates or refreshes)
    setSearchTerm("");
  }, [location]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      // Redirect to login page if user is not logged in
      navigate("/LoginPage");
    } else if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handlePostClick = () => {
    if (user) {
      navigate("/AddPostPage");
    } else {
      navigate("/LoginPage");
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility
  };

  const handleLogout = () => {
    logout();
    navigate("/LoginPage");
  };

  return (
    <nav className="bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo dan Search Bar di Sebelah Kiri */}
          <div className="flex space-x-4 items-center">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center py-5 px-2 text-gray-700 hover:text-gray-900"
            >
              <svg
                className="h-6 w-6 mr-1 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span className="font-bold">MyBlog</span>
            </Link>

            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative text-gray-600"
            >
              <input
                className="border-2 border-gray-300 bg-white h-10 pl-2 pr-32 rounded-lg text-sm focus:outline-none"
                type="search"
                name="search"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </form>
          </div>

          {/* Sign in, Login, dan Profil di Sebelah Kanan */}
          {/* Post Button, Sign in, Login, dan Profil di Sebelah Kanan */}
          <div className="flex items-center space-x-4">
            {user && (
              <button
                onClick={handlePostClick}
                className="flex items-center space-x-2 text-blue-700 font-bold hover:text-white hover:bg-blue-700 px-4 py-2 rounded"
              >
                <span>Post</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5l4 4L7 21l-4 1 1-4L16.5 3.5z" />
                </svg>
              </button>
            )}

            {!user ? (
              <>
                <Link
                  to="/LoginPage"
                  className="block text-md px-4 py-2 rounded text-blue-700 font-bold hover:text-white hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/RegisterPage"
                  className="block text-md px-4 py-2 rounded text-blue-700 font-bold hover:text-white hover:bg-blue-700"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link
                      to="/MyProfilePage"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className="mobile-menu-button">
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
