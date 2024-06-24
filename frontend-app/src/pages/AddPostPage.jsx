import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPostPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [author, setAuthor] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("excerpt", excerpt);
    formData.append("tags", tags.join(","));
    formData.append("author", author);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);

      setTitle("");
      setDescription("");
      setExcerpt("");
      setTags([]);
      setImage(null);
      setAuthor("");
      setTagInput("");
      setMessage("Berhasil diposting!");

      setTimeout(() => {
        setMessage("");
        navigate("/");
      }, 2000); // Mengarahkan ke homepage setelah 2 detik
    } catch (error) {
      console.error("Error:", error);
      setMessage("Gagal diposting!");
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      const tagsCopy = [...tags];
      tagsCopy.pop();
      setTags(tagsCopy);
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Create New Post
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 mb-2">
              Image
            </label>
            <input
              type="file"
              id="image"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 rounded-md"
              onChange={handleImageChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="excerpt" className="block text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 rounded-md"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 rounded-md"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
            />
            <div className="mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer"
                  onClick={() => removeTag(index)}
                >
                  #{tag} &times;
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="author" className="block text-gray-700 mb-2">
              Author
            </label>
            <input
              type="text"
              id="author"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 rounded-md"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
            >
              Add Post
            </button>
          </div>
        </form>
        {message && (
          <div className="mt-4 p-2 text-center text-white bg-green-500 rounded">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPostPage;
