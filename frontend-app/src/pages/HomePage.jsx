import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/authcontext";
import PostList from "../components/PostList";

const HomePage = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      console.log("User ID:", user._id); // Log user ID menggunakan _id jika user tersedia
    } else {
      console.log("No user logged in"); // Log jika user belum login
    }
  }, [user]);

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between">
      <header className="bg-black text-white py-4"></header>

      <main className="container mx-auto flex-grow">
        <section className="container px-5 py-5 ">
          {user ? (
            <div>
              <p>Welcome, {user.username}!</p>
              <p>User ID: {user._id}</p> {/* Tampilkan user ID di UI */}
            </div>
          ) : (
            "Welcome to MyBlog"
          )}
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
