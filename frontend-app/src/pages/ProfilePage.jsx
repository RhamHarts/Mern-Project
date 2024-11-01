import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // Tab state

  const [likedPosts, setLikedPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/profile/posts/${id}` // Ensure this endpoint returns profile data
        );
        setProfile(response.data.user);
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching profile and posts", error);
      }
    };

    fetchProfileAndPosts();
  }, [id]);

  useEffect(() => {
    const fetchProfileIsFollowing = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/follow-status/${id}`
        );
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error fetching follow status", error);
      }
    };

    fetchProfileIsFollowing();
    fetchUserFollowersAndFollowing(); // Fetch followers and following counts
    fetchTotalLikes();
  }, [id]);

  const handleFollowClick = async () => {
    try {
      if (!isFollowing) {
        await axios.post(`http://localhost:3001/follow/${id}`);
        setProfile((prevProfile) => ({
          ...prevProfile,
          followers: prevProfile.followers + 1,
        }));
      } else {
        await axios.delete(`http://localhost:3001/unfollow/${id}`);
        setProfile((prevProfile) => ({
          ...prevProfile,
          followers: prevProfile.followers - 1,
        }));
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error handling follow/unfollow", error);
    }
  };

  // Fetch current user's followers and following count
  const fetchUserFollowersAndFollowing = async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/followers-following/${id}`,
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

  const fetchTotalLikes = async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/likes/${id}`, {
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

  // Fungsi untuk mengubah tab aktif
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="min-h-screen flex">
      <div className="w-1/3 p-4 bg-gray-100">
        <div className="w-full flex flex-col items-center justify-start">
          <div className="w-52 relative group">
            <img
              src={`http://localhost:3001/uploads/profile/${profile.imageProfile}`}
              className="w-52 h-52 mb-4 object-cover rounded-full"
            />

            <div className="w-full text-center mb-4">
              <h4 className="text-black font-semibold text-xl">
                {profile.username}
              </h4>
              <h2 className="text-gray-400 text-base">{profile.email}</h2>
            </div>

            <div className="p-2 text-center mb-4">
              <p className="text-sm text-gray-500 leading-5 text-justify">
                {profile.aboutMe}
              </p>
            </div>

            <button
              className={`cursor-pointer border-white border-opacity-80 bg-black rounded-xl box-border w-44 h-10 flex flex-col items-center justify-center transform transition-transform hover:scale-105 ${
                isFollowing ? "bg-red-500" : "bg-blue-500"
              } text-white text-xl font-semibold`}
              onClick={handleFollowClick}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>

            <div className="w-full text-center mb-4">
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

            <div className="p-2 text-center mb-4">
              <p className="text-sm text-gray-500 leading-5 text-justify">
                {profile.aboutMe}
              </p>
            </div>

            <div className="mt-5 text-center">
              <h3 className="text-base mb-4">Social Media:</h3>
              <div className="flex flex-col space-y-4 items-start">
                {profile.facebook && (
                  <div className="flex items-center">
                    <img
                      className="w-8 h-7"
                      alt="Facebook"
                      src="/icons/facebook.svg"
                    />
                    <a className="ml-3" href="https://www.facebook.com/">
                      {profile.facebook}
                    </a>
                  </div>
                )}
                {!profile.facebook && (
                  <div className="flex items-center">
                    <img
                      className="w-8 h-7"
                      alt="Facebook"
                      src="/icons/facebook.svg"
                    />
                    <span className="ml-3">Facebook</span>
                  </div>
                )}

                {profile.instagram && (
                  <div className="flex items-center">
                    <img
                      className="w-8 h-7"
                      alt="Instagram"
                      src="/icons/instagram.svg"
                    />
                    <a className="ml-3" href="https://www.instagram.com/">
                      {profile.instagram}
                    </a>
                  </div>
                )}
                {!profile.instagram && (
                  <div className="flex items-center">
                    <img
                      className="w-8 h-7"
                      alt="Instagram"
                      src="/icons/instagram.svg"
                    />
                    <span className="ml-3">Instagram</span>
                  </div>
                )}

                {profile.tiktok && (
                  <div className="flex items-center">
                    <img
                      className="w-8 h-7"
                      alt="Tiktok"
                      src="/icons/tiktok.svg"
                    />
                    <a className="ml-3" href="https://www.tiktok.com/">
                      {profile.tiktok}
                    </a>
                  </div>
                )}
                {!profile.tiktok && (
                  <div className="flex items-center">
                    <img
                      className="w-8 h-7"
                      alt="Tiktok"
                      src="/icons/tiktok.svg"
                    />
                    <span className="ml-3">Tiktok</span>
                  </div>
                )}

                {profile.twitter && (
                  <div className="flex items-center">
                    <img
                      className="w-8 h-7"
                      alt="Twitter"
                      src="/icons/twitter.svg"
                    />
                    <a className="ml-3" href="https://www.twitter.com/">
                      {profile.twitter}
                    </a>
                  </div>
                )}
                {!profile.twitter && (
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

export default ProfilePage;
