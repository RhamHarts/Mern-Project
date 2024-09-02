import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import LoginModal from "../components/LoginModal";

const PostList = () => {
  const [posts, setPosts] = useState([]); // Data mentah dari server
  const [visiblePosts, setVisiblePosts] = useState([]); // Postingan yang ditampilkan di UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [limit, setLimit] = useState(6); // Jumlah postingan yang ditampilkan
  const [totalPosts, setTotalPosts] = useState(0);
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    console.log("Fetching posts...");
    try {
      const response = await axios.get(
        `http://localhost:3001/posts?limit=${limit}`
      );
      console.log("Fetched posts:", response.data.posts);

      setPosts((prevPosts) => {
        // Filter postingan baru untuk menghindari duplikasi berdasarkan _id
        const newPosts = response.data.posts.filter(
          (post) => !prevPosts.some((prevPost) => prevPost._id === post._id)
        );
        return [...prevPosts, ...newPosts];
      });

      setTotalPosts(response.data.totalPosts);
    } catch (error) {
      console.error("Error fetching the posts:", error);
    }
  }, [limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSeeMoreClick = () => {
    setLimit((prevLimit) => prevLimit + 6); // Naikkan limit untuk memuat lebih banyak postingan
  };

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
      navigate(`/search?query=${encodeURIComponent(author)}`);
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

  useEffect(() => {
    if (posts.length > 0) {
      setVisiblePosts(posts.slice(0, limit));
    }
  }, [posts, limit]);

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
                  key={index} // Pastikan key pada tag unik di dalam map
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
            onClick={handleSeeMoreClick}
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
