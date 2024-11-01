// components/Posts.js
import React from "react";
import { useNavigate } from "react-router-dom";

const Posts = ({ posts, handlePostClick, handleTagClick, truncateText }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map((post) => (
          <div
            key={post._id}
            onClick={() => handlePostClick(post)}
            className="max-w-sm rounded overflow-hidden shadow-lg cursor-pointer"
          >
            <img
              className="w-full h-80 object-cover"
              src={
                post.image
                  ? `http://localhost:3001/uploads/post/${post.image}`
                  : post.imageUrl
                  ? post.imageUrl
                  : "path/to/default/image.jpg"
              }
              alt={post.title}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{post.title}</div>
              <p className="text-gray-700 text-base">
                {truncateText(post.excerpt, 20)}
              </p>
            </div>
            <div className="px-6 py-4">
              <span className="text-gray-600 text-sm">
                {new Date(post.date).toLocaleDateString()}
              </span>
            </div>
            <div className="px-6 pt-4 pb-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTagClick(tag);
                  }}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
