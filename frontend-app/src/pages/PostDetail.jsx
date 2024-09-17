import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostById } from "../services/PostServices";
import { Link, useNavigate } from "react-router-dom";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    navigate(`/search?query=${encodeURIComponent(tag)}`);
  };

  const handleauthorClick = () => {
    alert("author diklik: " + post.author);
  };

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

  // Memecah deskripsi berdasarkan baris baru menjadi array paragraf
  const descriptionParagraphs = post.description.split("\n");

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

      {/* Bagian author dan tanggal di bawah gambar dan bersebelahan */}
      <div className="flex justify-start items-center mb-6">
        <p
          className="text-lg font-semibold text-gray-900 mr-4 cursor-pointer"
          onClick={handleauthorClick}
        >
          {post.author}
        </p>
        <h4 className="text-gray-900">
          {new Date(post.date).toLocaleDateString()}
        </h4>
      </div>

      {/* Render deskripsi sebagai paragraf dengan rata kiri */}
      <div className="text-gray-700 text-base leading-relaxed mb-4">
        {descriptionParagraphs.map((paragraph, index) => (
          <p key={index} className="mb-4 text-left">
            {paragraph}
          </p>
        ))}
      </div>

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
