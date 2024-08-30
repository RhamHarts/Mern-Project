import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import Footer from "../components/Footer";

const AddPostPage = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [useImageUrl, setUseImageUrl] = useState(false); // State baru untuk memilih input gambar atau URL
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("User ID:", user._id); // Log user ID menggunakan _id jika user tersedia
    } else {
      console.log("No user logged in"); // Log jika user belum login
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input gambar
    if (image && imageUrl) {
      setMessage("Only one of image file or image URL can be used.");
      return;
    }

    if (!image && !imageUrl) {
      setMessage("An image file or image URL is required.");
      return;
    }

    if (!user) {
      setMessage("User not authenticated.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("excerpt", excerpt);
    formData.append("tags", tags.join(","));
    formData.append("author", author);
    formData.append("userId", user.id); // Menambahkan userId

    if (image) {
      formData.append("image", image);
    } else if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    }

    try {
      const token = localStorage.getItem("token"); // Ambil token dari localStorage
      const response = await fetch("http://localhost:3001/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Tambahkan token ke header Authorization
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);

      // Reset form setelah berhasil disubmit
      setTitle("");
      setDescription("");
      setExcerpt("");
      setTags([]);
      setImage(null);
      setImageUrl("");
      setPreviewUrl("");
      setAuthor("");
      setTagInput("");
      setMessage("Berhasil diposting!");

      // Redirect ke homepage setelah 2 detik
      setTimeout(() => {
        setMessage("");
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Gagal diposting!");
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(""); // Bersihkan imageUrl jika file gambar dipilih
    setPreviewUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImage(null); // Bersihkan file gambar jika imageUrl disediakan
    setPreviewUrl(e.target.value);
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
    <div className="flex items-center justify-center bg-gray-100 mt-10">
      <div className="w-4/5 bg-gray-100 flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <textarea
              rows="1"
              placeholder="Enter Title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-14 text-5xl resize-none w-full bg-none focus:outline-none focus:border-transparent"
            ></textarea>
          </div>
          <div className="mb-4">
            <textarea
              rows="5"
              id="description"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="h-56 text-2xl resize-none w-full bg-none focus:outline-none focus:border-transparent"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="excerpt" className="block text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-transparent rounded-md"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between mb-4">
            <button
              type="button"
              onClick={() => setUseImageUrl(false)}
              className={`py-2 px-4 rounded-md ${
                !useImageUrl ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            >
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => setUseImageUrl(true)}
              className={`py-2 px-4 rounded-md ${
                useImageUrl ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            >
              Image URL
            </button>
          </div>
          {useImageUrl ? (
            <div className="mb-4">
              <input
                type="text"
                id="imageUrl"
                placeholder="Enter Image URL"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-transparent rounded-md"
                value={imageUrl}
                onChange={handleImageUrlChange}
              />
            </div>
          ) : (
            <div className="mb-4">
              <input
                type="file"
                id="image"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-transparent rounded-md"
                onChange={handleImageChange}
              />
            </div>
          )}
          {previewUrl && (
            <div className="mb-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-auto rounded-md"
              />
            </div>
          )}
          <div className="mb-4">
            <input
              type="text"
              id="tags"
              placeholder="Enter Tags"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-transparent rounded-md"
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
            <input
              type="text"
              id="author"
              placeholder="Author Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-transparent rounded-md"
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
