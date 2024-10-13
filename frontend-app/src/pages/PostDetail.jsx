import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostById, toggleLikePost } from "../services/PostServices"; // Import the toggleLikePost function
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify"; // Import DOMPurify
import { FaHeart, FaBookmark, FaShare } from "react-icons/fa"; // Import icons

const PostDetail = () => {
  const { postId } = useParams(); // Get postId from the route
  const [post, setPost] = useState(null); // State for storing post data
  const [likes, setLikes] = useState(0); // State for storing the likes count
  const [isLiked, setIsLiked] = useState(false); // State for checking if the post is liked
  const [isBookmarked, setIsBookmarked] = useState(false); // State for bookmark status
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    navigate(`/search?query=${encodeURIComponent(tag)}`);
  };

  const handleAuthorClick = () => {
    if (post && post.userId) {
      navigate(`/profile/${post.userId}`); // Navigate to the author's profile
    }
  };

  // Toggle the like status for the post
  const handleLikeClick = async () => {
    try {
      const response = await toggleLikePost(postId); // API call to toggle like
      console.log("Updated Likes Count:", response.likesCount);
      setLikes(response.likesCount);
      setIsLiked(!isLiked); // Toggle the isLiked state
    } catch (error) {
      console.error("Error toggling like:", error.message || error);
    }
  };

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked); // Toggle bookmark state
  };

  const handleShareClick = () => {
    // Simulate sharing (could be a modal or copy link)
    alert("Link copied to clipboard!");
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await fetchPostById(postId); // Fetch post data by ID
        setPost(postData);
        setLikes(postData.likesCount || 0); // Set the likes count from the fetched data
        setIsLiked(postData.isLiked); // Update the initial like state

        // Console log for likesCount and isLiked
        console.log("Likes Count:", postData.likesCount);
        console.log("User has liked this post:", postData.isLiked); // Log untuk mengecek apakah user sudah like
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const cleanDescription = DOMPurify.sanitize(post.description); // Sanitize post description for security

  return (
    <div className="container mx-auto px-96">
      <h1 className="text-4xl font-bold mb-4 mt-10">{post.title}</h1>

      <img
        className="w-full mb-4 mt-10"
        src={
          post.image
            ? `http://localhost:3001/uploads/post/${post.image}`
            : post.imageUrl
            ? post.imageUrl
            : "path/to/default/image.jpg"
        }
        alt={post.title}
      />

      {/* Flex container for author, date, and icons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <p
            className="text-lg font-semibold text-gray-900 mr-4 cursor-pointer"
            onClick={handleAuthorClick}
          >
            {post.author}
          </p>
          <h4 className="text-gray-900">
            {new Date(post.date).toLocaleDateString()}
          </h4>
        </div>

        {/* Icons section */}
        <div className="flex space-x-4">
          {/* Likes */}
          <div
            className="flex items-center cursor-pointer"
            onClick={handleLikeClick}
          >
            <FaHeart
              className={`text-2xl ${
                isLiked ? "text-red-500" : "text-gray-600"
              } hover:scale-110 transition-transform`}
            />
            <span className="text-gray-700 font-semibold ml-1">{likes}</span>
          </div>

          {/* Bookmark */}
          <div
            className="flex items-center cursor-pointer"
            onClick={handleBookmarkClick}
          >
            <FaBookmark
              className={`text-2xl ${
                isBookmarked ? "text-blue-600" : "text-gray-600"
              } hover:scale-110 transition-transform`}
            />
          </div>

          {/* Share */}
          <div
            className="flex items-center cursor-pointer"
            onClick={handleShareClick}
          >
            <FaShare className="text-green-500 text-2xl hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      <div
        className="text-gray-700 text-base leading-relaxed mb-4 text-left"
        dangerouslySetInnerHTML={{ __html: cleanDescription }}
      />

      <div className="flex flex-wrap mb-4">
        {post.tags.map((tag, index) => (
          <span
            key={index}
            onClick={() => handleTagClick(tag)}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer"
          >
            #{tag}
          </span>
        ))}
      </div>

      <Link
        to={`/post/edit/${post._id}`}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out"
      >
        Edit Post
      </Link>
    </div>
  );
};

export default PostDetail;
