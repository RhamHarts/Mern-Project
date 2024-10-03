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
  const [isFollowing, setIsFollowing] = useState(false);

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

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="min-h-screen flex">
      <div className="w-1/3 p-4 bg-gray-100">
        <div className="w-full flex flex-col items-center justify-start">
          <div className="w-52 relative group">
            <div className="flex flex-col items-center mb-4">
              <label htmlFor="imageProfile" className="flex items-center">
                {/* Wrapper for image with hover effect */}
                <div className="relative w-52 ">
                  <img
                    src={`http://localhost:3001/uploads/profile/${profile.imageProfile}`}
                    className="w-52 h-52 mb-4 object-cover rounded-full  "
                  />
                  {/* Camera icon shown on hover */}
                </div>
              </label>
            </div>

            <div className="w-full text-center mb-4">
              <h4 className="text-black font-semibold text-xl">
                {profile.username}
              </h4>
              <h2 className="text-gray-400 text-base">{profile.email}</h2>
              <button
                className={`mt-4 px-4 py-2 rounded ${
                  isFollowing ? "bg-red-500" : "bg-blue-500"
                } text-white font-semibold`}
                onClick={handleFollowClick}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
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
    </div>
  );
};

export default ProfilePage;
