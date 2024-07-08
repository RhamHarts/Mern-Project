import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from React Router

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching the posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map((post) => (
          <Link key={post._id} to={`/post/${post._id}`}>
            <div className="max-w-sm rounded overflow-hidden shadow-lg cursor-pointer">
              <img
                className="w-full h-80 object-cover"
                src={
                  post.image // Check for image first
                    ? `http://localhost:3001/uploads/post/${post.image}`
                    : post.imageUrl // If no image, check for imageUrl
                    ? post.imageUrl
                    : "path/to/default/image.jpg" // Provide a default image in case both are missing
                }
                alt={post.title}
              />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{post.title}</div>
                <p className="text-gray-700 text-base">{post.excerpt}</p>
              </div>
              <div className="px-6 pt-4 pb-2 flex justify-between items-center">
                <div className="flex">
                  <h4 className="mr-2 font-bold">{post.author}</h4>
                </div>
                <div>
                  <h4 className="text-gray-400">
                    {new Date(post.date).toLocaleDateString()}
                  </h4>
                </div>
              </div>
              <div className="px-6 pt-4 pb-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PostList;
