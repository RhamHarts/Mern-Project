import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewestPost = ({ post, user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      console.log("Newest post data:", post); // Melakukan console.log untuk post yang diambil
    }
  }, [post]); // Gunakan useEffect agar console.log hanya dipanggil saat post berubah

  const handlePostClick = () => {
    if (!user) {
      alert("Please log in to view the post details.");
    } else {
      navigate(`/post/${post._id}`);
    }
  };

  if (!post) return null; // Jika tidak ada post, jangan render apa-apa

  return (
    <div className="flex justify-center mt-10">
      <img
        className="object-cover w-full h-96 rounded-xl lg:w-4/5 cursor-pointer"
        src={
          post.image
            ? `http://localhost:3001/uploads/post/${post.image}`
            : "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80" // Default image
        }
        alt={post.title || "Newest Post Image"}
        onClick={handlePostClick}
      />
    </div>
  );
};

export default NewestPost;
