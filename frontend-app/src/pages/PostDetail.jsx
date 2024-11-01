/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchPostById,
  toggleLikePost,
  toggleUnlikePost, // Import the unlikePost function
  toggleBookmarkPost,
  toggleUnbookmarkPost,
} from "../services/PostServices"; // Import services
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { FaHeart, FaBookmark, FaShare } from "react-icons/fa"; // Import icons
import { marked } from "marked";

const PostDetail = () => {
  const { postId } = useParams(); // Get postId from the route
  const [post, setPost] = useState(null); // State for storing post data
  const [likes, setLikes] = useState(0); // State for storing the likes count
  const [bookmark, setBookmark] = useState(0); // State for storing the likes count
  const [isLiked, setIsLiked] = useState(false); // State for checking if the post is liked
  const [isBookmarked, setIsBookmarked] = useState(false); // State for bookmark status
  const [relatedPosts, setRelatedPosts] = useState([]); // State untuk menyimpan related posts
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await fetchPostById(postId);
        setPost(postData);
        setLikes(postData.likesCount || 0);
        setIsLiked(postData.isLiked);
        setBookmark(postData.bookmarksCount || 0);
        setIsBookmarked(postData.isBookmarked);

        // Fetch related posts
        const relatedResponse = await axios.get(
          `http://localhost:3001/posts/${postId}/related`
        );
        setRelatedPosts(relatedResponse.data.relatedPosts);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleTagClick = (tag) => {
    navigate(`/search?query=${encodeURIComponent(tag)}`);
  };

  const handleAuthorClick = () => {
    if (post && post.userId) {
      navigate(`/profile/${post.userId}`); // Navigate to the author's profile
    }
  };

  // Toggle the like/unlike status for the post
  const handleLikeClick = async () => {
    try {
      if (isLiked) {
        // If already liked, unlike the post
        const response = await toggleUnlikePost(postId); // Call API to unlike post
        console.log(
          "Unlike successful. Updated Likes Count:",
          response.likesCount
        );
        setLikes(response.likesCount);
        setIsLiked(false); // Update state to reflect that the post is now unliked
      } else {
        // If not liked, like the post
        const response = await toggleLikePost(postId); // API call to toggle like
        console.log(
          "Like successful. Updated Likes Count:",
          response.likesCount
        );
        setLikes(response.likesCount);
        setIsLiked(true); // Update state to reflect that the post is now liked
      }
    } catch (error) {
      console.error("Error toggling like:", error.message || error);
    }
  };

  const handleBookmarkClick = async () => {
    try {
      if (isBookmarked) {
        // If already unbookmarked, unbookmark the post
        const response = await toggleUnbookmarkPost(postId); // Call API to unlike post
        console.log(
          "Unbookmark successful. Updated bookmarks Count:",
          response.bookmarksCount
        );
        setBookmark(response.bookmarksCount);
        setIsBookmarked(false); // Update state to reflect that the post is now unliked
      } else {
        // If not liked, like the post
        const response = await toggleBookmarkPost(postId); // API call to toggle like
        console.log(
          "Bookmark successful. Updated Bookmarks Count:",
          response.bookmarksCount
        );
        setBookmark(response.bookmarksCount);
        setIsBookmarked(true); // Update state to reflect that the post is now liked
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error.message || error);
    }
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
        setBookmark(postData.bookmarksCount || 0);
        setIsBookmarked(postData.isBookmarked); // Update the initial bookmark state

        // Console log for likesCount, isLiked, and isBookmarked
        console.log("Likes Count:", postData.likesCount);
        console.log("Bookmarks Count:", postData.bookmarksCount);
        console.log("User has liked this post:", postData.isLiked);
        console.log("User has bookmarked this post:", postData.isBookmarked); // Log untuk bookmark
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center">
        {/* <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full mb-2">
          Popular Articles
        </span> */}
        <h1 className="text-4xl font-bold mb-5">{post.title}</h1>
      </div>

      <img
        className="w-full mb-8"
        src={
          post.image
            ? `http://localhost:3001/uploads/post/${post.image}`
            : post.imageUrl || "path/to/default/image.jpg"
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

      <div dangerouslySetInnerHTML={{ __html: marked(post.description) }} />

      <div className="flex flex-wrap mt-10 mb-10">
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

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relatedPosts.map((relatedPost) => (
            <div
              key={relatedPost._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
              onClick={() => navigate(`/post/${relatedPost._id}`)}
            >
              <img
                src={
                  relatedPost.image
                    ? `http://localhost:3001/uploads/post/${relatedPost.image}`
                    : relatedPost.imageUrl || "path/to/default/image.jpg"
                }
                alt={relatedPost.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {relatedPost.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {new Date(relatedPost.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700 mt-2 text-sm">
                  {relatedPost.excerpt || "No excerpt available."}
                </p>
                <div className="flex flex-wrap mt-4">
                  {relatedPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation(); // Mencegah event klik pada div
                        navigate(`/search?query=${encodeURIComponent(tag)}`); // Mengarahkan ke pencarian berdasarkan tag
                      }}
                      className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 cursor-pointer hover:bg-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default PostDetail;
