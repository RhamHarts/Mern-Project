import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaCheck, FaTimes } from "react-icons/fa";
import EditProfile from "../components/EditProfileModal";
import ImageInputProfile from "../components/ImageInputProfile";

const MyProfilePage = () => {
  const [formData, setFormData] = useState({
    imageProfile: "", // Store profile image URL here
  });

  const [profileData, setProfileData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isImageChanged, setIsImageChanged] = useState(false);
  const editorRef = useRef(null); // Reference for AvatarEditor

  useEffect(() => {
    const fetchProfile = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        console.error("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3001/profile/now", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.data && response.data.profile) {
          const profile = response.data.profile;

          // Log all profile data received from the server
          console.log("Fetched profile data:", profile); // Tambahkan log ini

          setProfileData(profile);
          setFormData((prevFormData) => ({
            ...prevFormData,
            username: profile.username,
            email: profile.email,
            imageProfile: profile.imageProfile, // Ambil dari database
            aboutMe: profile.aboutMe || "",
          }));

          setIsImageChanged(false);

          fetchUserPosts(profile._id);
        } else {
          console.error(
            "Profile data not found in the response:",
            response.data
          );
        }
      } catch (error) {
        console.error(
          "Error fetching the profile:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchProfile();
  }, []);

  const fetchUserPosts = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/profile/posts`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
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

  const handlePostClick = (post) => {
    if (!user) {
      setIsModalOpen(true);
    } else {
      navigate(`/post/${post._id}`);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/3 p-4 bg-gray-100">
        {/* Profile Content */}
        <div className="w-full flex flex-col items-center justify-start">
          <div className="w-52 relative">
            <div className="flex flex-col items-center mb-4">
              <ImageInputProfile />
              <label
                htmlFor="imageProfile"
                className="flex items-center cursor-pointer"
              >
                <img
                  src={`http://localhost:3001/uploads/profile/${formData.imageProfile}`}
                  alt="Profile"
                  className="w-52 h-52 mb-4 object-cover rounded-full cursor-pointer"
                />
              </label>
            </div>

            <div className="w-full text-center mb-4">
              <h4 className="text-black font-semibold text-xl">
                {formData.username}
              </h4>
              <h2 className="text-gray-400 text-base"> {formData.email}</h2>
            </div>

            <div className="w-full text-center mb-4">
              <div className="ml-5">
                <EditProfile onClose={() => setIsModalOpen(false)} />
              </div>
              <div className="grid grid-cols-2 gap-4 justify-center items-center mt-4">
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold">10,001</h3>
                  <span className="text-xs">Followers</span>
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold">0</h3>
                  <span className="text-xs">Following</span>
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold">{posts.length}</h3>
                  <span className="text-xs">Posts</span>
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold">500</h3>
                  <span className="text-xs">Likes</span>
                </div>
              </div>
            </div>

            <div className="p-2 text-center mb-4">
              <p className="text-sm text-gray-500 leading-5 text-justify">
                {formData.aboutMe}
              </p>
            </div>

            <div className="mt-5 text-center">
              <h3 className="text-base mb-4">Social Media:</h3>
              <div className="flex flex-col space-y-4 items-start">
                <div className="flex items-center">
                  <img
                    className="w-8 h-7"
                    alt="Facebook"
                    src="/icons/facebook.svg"
                  />
                  <a className="ml-3" href="https://www.facebook.com/">
                    Facebook
                  </a>
                </div>
                <div className="flex items-center">
                  <img
                    className="w-8 h-7"
                    alt="Instagram"
                    src="/icons/instagram.svg"
                  />
                  <a className="ml-3" href="https://www.instagram.com/">
                    Instagram
                  </a>
                </div>
                <div className="flex items-center">
                  <img
                    className="w-8 h-7"
                    alt="Tiktok"
                    src="/icons/tiktok.svg"
                  />
                  <a className="ml-3" href="https://www.tiktok.com/">
                    Tiktok
                  </a>
                </div>
                <div className="flex items-center">
                  <img
                    className="w-8 h-7"
                    alt="Twitter"
                    src="/icons/twitter.svg"
                  />
                  <a className="ml-3" href="https://www.twitter.com/">
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default MyProfilePage;
