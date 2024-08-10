import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostById } from "../services/PostServices";
import { Link } from "react-router-dom";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await fetchPostById(postId);
        setPost(postData);
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
    <div className="container mx-auto px-96">
      <h1 className="text-3xl font-bold mb-4 mt-10">{post.title}</h1>
      <img
        className="w-full mb-4 mt-10"
        src={
          post.image // Check for image first
            ? `http://localhost:3001/uploads/post/${post.image}`
            : post.imageUrl // If no image, check for imageUrl
            ? post.imageUrl
            : "path/to/default/image.jpg" // Provide a default image in case both are missing
        }
        alt={post.title}
      />
      <div className="mb-6">
        <p className="text-lg font-semibold text-gray-900">{post.author}</p>
        <h4 className="text-gray-900">
          {new Date(post.date).toLocaleDateString()}
        </h4>
      </div>
      <div className="text-gray-700 text-base leading-relaxed mb-4">
        {post.description}
      </div>
      <div className="flex flex-wrap mb-4">
        {post.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
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
