/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import EditProfile from "../components/EditProfileModal";
import ImageInputProfile from "../components/ImageInputProfile";
import { FaEllipsisV } from "react-icons/fa"; // Import ikon titik tiga dari react-icons

const MyProfilePage = () => {
  const [formData, setFormData] = useState({
    imageProfile: "", // Store profile image URL here
  });

  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [activeTab, setActiveTab] = useState("posts"); // Tab state
  const [likedPosts, setLikedPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  const fetchLikedPosts = async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:3001/posts/post/likedpost",
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      setLikedPosts(response.data.likedPosts);
      console.log("Liked Posts:", response.data.likedPosts);
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    }
  };

  const fetchBookmarkedPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/posts/post/bookmarkpost"
      );
      setBookmarkedPosts(response.data.bookmarkPosts);
      console.log("Bookmarked Posts:", response.data.bookmarkPosts);
    } catch (error) {
      console.error("Error fetching bookmarked posts:", error);
    }
  };

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

          setProfileData(profile);
          setFormData((prevFormData) => ({
            ...prevFormData,
            username: profile.username,
            email: profile.email,
            imageProfile: profile.imageProfile,
            aboutMe: profile.aboutMe,
            facebook: profile.facebook,
            instagram: profile.instagram,
            tiktok: profile.tiktok,
            twitter: profile.twitter || "",
          }));

          setIsImageChanged(false);

          fetchUserPosts(profile._id);
          fetchCurrentUserFollowersAndFollowing();
          fetchTotalLikes();
          fetchLikedPosts(); // Fetch liked posts
          fetchBookmarkedPosts(); // Fetch bookmarked posts
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

  // Fungsi untuk mengubah tab aktif
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Fetch user's posts
  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/profile/posts`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  // Fetch current user's followers and following count
  const fetchCurrentUserFollowersAndFollowing = async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/followers-following`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      setFollowersCount(response.data.followersCount);
      setFollowingCount(response.data.followingCount);
    } catch (error) {
      console.error("Error fetching followers and following counts:", error);
    }
  };

  // Fetch current user's followers and following count
  const fetchTotalLikes = async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/likes`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      setTotalLikes(response.data.totalLikes);
    } catch (error) {
      console.error("Error fetching followers and following counts:", error);
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

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus postingan ini?"
    );
    if (!confirmDelete) {
      return; // Jika pengguna memilih "No", hentikan proses penghapusan
    }

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      // Hapus postingan dari state
      setPosts(posts.filter((post) => post._id !== postId));
      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEditPost = (postId) => {
    navigate(`/post/edit/${postId}`); // Arahkan ke halaman edit postingan
  };

  const toggleMenu = (postId) => {
    setOpenMenu(openMenu === postId ? null : postId);
  };

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex">
      <div className="w-1/3 p-4 bg-gray-100">
        {/* Profile Content */}
        <div className="w-full flex flex-col items-center justify-start">
          <div className="w-52 relative group">
            <div className="flex flex-col items-center mb-4">
              <ImageInputProfile />
              <label htmlFor="imageProfile" className="flex items-center">
                {/* Wrapper for image with hover effect */}
                <div className="relative w-52 h-52">
                  <img
                    alt=""
                    src={`http://localhost:3001/uploads/profile/${formData.imageProfile}`}
                    className="w-52 h-52 mb-4 object-cover rounded-full transition duration-300 ease-in-out hover:blur-sm hover:brightness-50"
                  />
                  {/* Camera icon shown on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300 ease-in-out cursor-pointer">
                    <FaCamera className="text-white text-4xl" />
                  </div>
                </div>
              </label>
            </div>

            <div className="w-full text-center mb-4">
              <h4 className="text-black font-semibold text-xl">
                {formData.username}
              </h4>
              <h2 className="text-gray-400 text-base"> {formData.email}</h2>
            </div>

            <div className="p-2 text-center mb-4">
              <p className="text-sm text-gray-500 leading-5 text-justify">
                {formData.aboutMe}
              </p>
            </div>

            <div className="w-full text-center mb-4">
              <div className="ml-5">
                <EditProfile onClose={() => setIsModalOpen(false)} />
              </div>
              <div className="grid grid-cols-2 gap-4 justify-center items-center mt-4">
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold">{followersCount}</h3>
                  <span className="text-xs">Followers</span>
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold">{followingCount}</h3>
                  <span className="text-xs">Following</span>
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold">{posts.length}</h3>
                  <span className="text-xs">Posts</span>
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold">{totalLikes}</h3>
                  <span className="text-xs">Likes</span>
                </div>
              </div>
            </div>
            <div className="mt-5 text-center">
              <h3 className="text-base mb-4">Social Media:</h3>
              <div className="flex flex-col space-y-4 items-start">
                {formData.facebook && (
                  <div className="flex items-center">
                    <img
                      className="w-8 h-7"
                      alt="Facebook"
                      src="/icons/facebook.svg"
                    />
                    <a className="ml-3" href="https://www.facebook.com/">
                      {formData.facebook}
                    </a>
                  </div>
                )}
                {!formData.facebook && (
                  <div className="flex items-center">
                    <img
                      className="w-8 h-7"
                      alt="Facebook"
                      src="/icons/facebook.svg"
                    />
                    <span className="ml-3">Facebook</span>
                  </div>
                )}

                {formData.instagram && (
                  <div className="flex items-center">
                    <img
                      className="w-8 h-7"
                      alt="Instagram"
                      src="/icons/instagram.svg"
                    />
                    <a className="ml-3" href="https://www.instagram.com/">
                      {formData.instagram}
                    </a>
                  </div>
                )}
                {!formData.instagram && (
                  <div className="flex items-center">
                    <img
                      className="w-8 h-7"
                      alt="Instagram"
                      src="/icons/instagram.svg"
                    />
                    <span className="ml-3">Instagram</span>
                  </div>
                )}

                {formData.tiktok && (
                  <div className="flex items-center">
                    <img
                      className="w-8 h-7"
                      alt="Tiktok"
                      src="/icons/tiktok.svg"
                    />
                    <a className="ml-3" href="https://www.tiktok.com/">
                      {formData.tiktok}
                    </a>
                  </div>
                )}
                {!formData.tiktok && (
                  <div className="flex items-center">
                    <img
                      className="w-8 h-7"
                      alt="Tiktok"
                      src="/icons/tiktok.svg"
                    />
                    <span className="ml-3">Tiktok</span>
                  </div>
                )}

                {formData.twitter && (
                  <div className="flex items-center">
                    <img
                      className="w-8 h-7"
                      alt="Twitter"
                      src="/icons/twitter.svg"
                    />
                    <a className="ml-3" href="https://www.twitter.com/">
                      {formData.twitter}
                    </a>
                  </div>
                )}
                {!formData.twitter && (
                  <div className="flex items-center">
                    <img
                      className="w-8 h-7"
                      alt="Twitter"
                      src="/icons/twitter.svg"
                    />
                    <span className="ml-3">Twitter</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tab Navigation */}
      <div className="w-2/3 p-4">
        <div className="flex justify-around border-b mb-4">
          <button
            onClick={() => handleTabClick("posts")}
            className={`p-2 w-full ${
              activeTab === "posts"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => handleTabClick("liked")}
            className={`p-2 w-full ${
              activeTab === "liked"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Liked Posts
          </button>
          <button
            onClick={() => handleTabClick("bookmarks")}
            className={`p-2 w-full ${
              activeTab === "bookmarks"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Bookmarks
          </button>
        </div>

        {/* Content for each section */}
        <div className="mt-4">
          {activeTab === "posts" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => {
                    if (!openMenu) handlePostClick(post); // Hanya panggil jika menu tidak terbuka
                  }}
                  className="max-w-sm rounded overflow-hidden shadow-lg relative"
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
                  <div
                    className="absolute top-0 right-0 mt-2 mr-2"
                    ref={menuRef}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Hentikan propagasi event klik
                        toggleMenu(post._id);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaEllipsisV size={20} />{" "}
                      {/* Gunakan ikon dari react-icons */}
                    </button>
                    {openMenu === post._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                        <button
                          onClick={() => handleEditPost(post._id)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "liked" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {likedPosts
                .filter((post) => post)
                .map((post) => (
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
          )}
          {activeTab === "bookmarks" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {bookmarkedPosts
                .filter((post) => post)
                .map((post) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
