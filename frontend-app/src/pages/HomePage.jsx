// src/pages/HomePage.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/authcontext";
import PostList from "../components/PostList";

const HomePage = () => {
  const { user, profile } = useContext(AuthContext);

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between">
      <header className="bg-black text-white py-4"></header>

      <main className="container mx-auto flex-grow">
        <section className="container px-5 py-5 ">
          {user ? `Welcome, ${user.username}!` : "Welcome to MyBlog"}
          {profile ? `Welcome, ${profile.author}!` : "Welcome to MyBlog"}
          <PostList />
        </section>
      </main>

      <footer className="bg-black text-white py-4">
        <div className="container mx-auto text-center">
          &copy; 2024 Minimalist Blog. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
