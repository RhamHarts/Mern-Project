import React, { useContext } from "react";
import { AuthContext } from "../context/authcontext";
import PostList from "../components/PostList";
import NewestPost from "../components/NewestPost";

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col justify-between">
      {/* Hero Section */}
      <main className="container mx-auto flex-grow">
        <section className="container px-6 py-16 mx-auto text-center">
          <div className="max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
              Building Your Next App with our Awesome components
            </h1>
            <p className="mt-6 text-gray-500 dark:text-gray-300">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero
              similique obcaecati illum mollitia.
            </p>
          </div>
          <NewestPost />
        </section>

        {/* Post List Section */}
        <section className="container px-5 py-5">
          {/* Welcome message or post list */}
          {user ? (
            <div>
              <p>Welcome, {user.username}!</p>
            </div>
          ) : (
            "Welcome to MyBlog"
          )}
          <PostList />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
