import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostsContext } from "../context/postcontext";
import { AuthContext } from "../context/authcontext";
import LoginModal from "../components/LoginModal";

const PostList = () => {
  const { visiblePosts, totalPosts, loadMorePosts } = useContext(PostsContext);
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const truncateText = (text, numWords) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= numWords) return text;
    return words.slice(0, numWords).join(" ") + "...";
  };

  const handleTagClick = (tag) => {
    if (!user) {
      setIsModalOpen(true);
    } else {
      navigate(`/search?query=${encodeURIComponent(tag)}`);
    }
  };

  const handleAuthorClick = (author) => {
    if (!user) {
      setIsModalOpen(true);
    } else {
      navigate(`/profile/${encodeURIComponent(author)}`); // Navigasi ke halaman profil author
    }
  };

  const handlePostClick = (post) => {
    if (!user) {
      setIsModalOpen(true);
    } else {
      navigate(`/post/${post._id}`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {visiblePosts.map((post) => (
          <div
            key={post._id} // Pastikan _id unik
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
            <div className="px-6 pt-4 pb-2 flex justify-between items-center">
              <div className="flex">
                <h4
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAuthorClick(post.author);
                  }}
                  className="mr-2 font-bold text-blue-500 cursor-pointer"
                >
                  {post.author}
                </h4>
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

      {/* See More Button */}
      {visiblePosts.length < totalPosts && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMorePosts}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            See More
          </button>
        </div>
      )}

      {/* Modal Login */}
      <LoginModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default PostList;
