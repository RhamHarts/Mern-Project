import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { author } = useParams(); // Mengambil author dari URL
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch profile and posts by author
    const fetchProfileAndPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/profile/posts/${author}`
        );
        setProfile(response.data.user);
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching profile and posts", error);
      }
    };

    fetchProfileAndPosts();
  }, [author]);

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

  const handlePostClick = (post) => {
    if (!user) {
      setIsModalOpen(true);
    } else {
      navigate(`/post/${post._id}`);
    }
  };

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Profile Section */}
      <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6 mb-8">
        <img
          src={`http://localhost:3001/uploads/profile/${profile.imageProfile}`} // Tambahkan gambar profil
          alt={`${profile.username}`}
          className="w-32 h-32 rounded-full mb-4 object-cover"
        />
        <h1 className="text-3xl font-bold">{profile.username}</h1>
        <p className="text-gray-600">{profile.email}</p>
        <p className="text-gray-700 mt-4">
          {profile.aboutMe || "No bio available."}
        </p>
      </div>

      {/* Posts Section */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">My Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <div
              key={post._id} // Pastikan _id unik
              onClick={() => handlePostClick(post)}
              className="max-w-sm rounded overflow-hidden shadow-lg cursor-pointer"
            >
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
