import React, { useContext, useState } from "react";
import { AuthContext } from "../context/authcontext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search Term:", searchTerm);
  };

  const handlePostClick = () => {
    if (user) {
      navigate("/AddPostPage");
    } else {
      navigate("/LoginPage");
    }
  };

  return (
    <nav className="bg-black p-4 flex flex-wrap justify-between items-center overflow-hidden">
      <div className="text-white text-xl">
        <Link to="/">MyBlog</Link>
      </div>
      <div className="flex flex-grow justify-center mt-2 sm:mt-0">
        <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-5 py-2 rounded-md focus:outline-none focus:ring focus:ring-opacity-50"
          />
        </form>
      </div>
      <ul className="flex space-x-4 mt-2 sm:mt-0">
        <li>
          <Link to="/" className="text-white hover:underline text-xl">
            Home
          </Link>
        </li>
        <li>
          <button
            onClick={handlePostClick}
            className="text-white hover:underline text-xl"
          >
            Post
          </button>
        </li>
        {user ? (
          <>
            <li>
              <Link
                to="/ProfilePage"
                className="text-white hover:underline text-xl"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logout}
                className="text-white hover:underline text-xl"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/LoginPage"
                className="text-white hover:underline text-xl"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/RegisterPage"
                className="text-white hover:underline text-xl"
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
