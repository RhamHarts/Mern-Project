import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import axios from "axios";
import LoginModal from "./LoginModal"; // Import LoginModal

const NewestPost = () => {
  const [newestPost, setNewestPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch post terbaru
  useEffect(() => {
    const fetchNewestPost = async () => {
      try {
        const response = await axios.get("http://localhost:3001/posts?limit=1");
        setNewestPost(response.data.posts[0]);
      } catch (error) {
        console.error("Error fetching newest post:", error);
      }
    };

    fetchNewestPost();
  }, []);

  const handlePostClick = () => {
    if (!user) {
      // Jika user belum login, buka modal
      setIsModalOpen(true);
    } else if (newestPost) {
      // Jika user sudah login dan ada post terbaru, redirect ke halaman post
      navigate(`/post/${newestPost._id}`);
    }
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

  const handleCloseModal = () => {
    setIsModalOpen(false); // Tutup modal saat tombol "Close" diklik
  };

  // Fungsi untuk memformat tanggal menjadi format YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Ambil bagian tanggal dari ISO string
  };

  if (!newestPost) return null; // Jika tidak ada postingan terbaru, jangan render apa-apa

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="relative w-full max-w-[1300px] border-4 border-gray-300 rounded-xl overflow-hidden">
        {/* Gambar */}
        <img
          className="object-cover w-full h-[600px] cursor-pointer"
          src={
            newestPost.image
              ? `http://localhost:3001/uploads/post/${newestPost.image}`
              : newestPost.imageUrl
              ? newestPost.imageUrl
              : "path/to/default/image.jpg"
          }
          alt={newestPost.title || "Newest Post Image"}
          onClick={handlePostClick}
        />
        {/* Kontainer untuk teks di bawah gambar */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-black bg-opacity-50 text-white text-left">
          <div className="flex items-center mb-4">
            <h4
              onClick={(e) => {
                e.stopPropagation();
                handleAuthorClick(newestPost.author);
              }}
              className="mr-2 font-bold text-blue-500 cursor-pointer"
            >
              {newestPost.author}
            </h4>
            <span className="text-sm">{formatDate(newestPost.date)}</span>
          </div>
          {/* Tambahkan onClick pada judul */}
          <h1
            className="text-3xl font-bold mb-2 cursor-pointer"
            onClick={handlePostClick}
          >
            {newestPost.title}
          </h1>
          {/* Tambahkan onClick pada excerpt */}
          <p className="text-lg mb-2 cursor-pointer" onClick={handlePostClick}>
            {newestPost.excerpt}
          </p>
          <div className="px-1 pt-4 pb-2">
            {newestPost.tags.map((tag, index) => (
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
      </div>
      {/* Komponen modal login */}
      <LoginModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default NewestPost;
