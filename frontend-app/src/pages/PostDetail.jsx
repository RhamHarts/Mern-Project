import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostById } from "../services/PostServices";

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
          post.image.startsWith("http")
            ? post.image
            : `http://localhost:3001/uploads/${post.image}`
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
    </div>
  );
};

export default PostDetail;