import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import { Editor } from "@tinymce/tinymce-react";

const EditPostPage = () => {
  const { user } = useContext(AuthContext);
  const { postId } = useParams(); // Ambil ID postingan dari URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [useImageUrl, setUseImageUrl] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("User ID:", user._id);
    } else {
      console.log("No user logged in");
    }

    // Ambil data postingan dari server
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3001/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description);
        setExcerpt(data.excerpt);
        setTags(data.tags || []); // Ensure tags is set to an empty array if undefined
        setImageUrl(data.imageUrl || "");
        setPreviewUrl(data.imageUrl || "");
        setUseImageUrl(!!data.imageUrl);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchPost();
  }, [user, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (tags.length === 0) {
      setMessage("At least one tag is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("excerpt", excerpt);
    formData.append("tags", tags.join(",")); // Convert tags array to comma-separated string
    formData.append("userId", user.id);

    if (image) {
      formData.append("image", image);
    } else if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);

      setMessage("Post updated successfully!");

      setTimeout(() => {
        setMessage("");
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error updating post:", error);
      setMessage("Failed to update post!");
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImageUrl("");
    setPreviewUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImage(null);
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

          {/* Mengganti textarea deskripsi dengan TinyMCE Editor */}
          <div className="mb-4">
            <Editor
              apiKey="9j7zq09rqgctd6t77u673k8jwu23ikix068j3aoaj3u2x49s"
              initialValue=""
              value={description}
              init={{
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                  "image",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | image ",
                image_title: true,
                automatic_uploads: true,
                file_picker_types: "image",
                file_picker_callback: (cb, value, meta) => {
                  const input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/*");

                  input.onchange = async function () {
                    const file = this.files[0];
                    const formData = new FormData();
                    formData.append("image", file); // Make sure to match the key 'image'

                    // Upload image to the server
                    try {
                      const response = await fetch(
                        "http://localhost:3001/posts/upload-image",
                        {
                          method: "POST",
                          body: formData,
                        }
                      );

                      if (!response.ok) {
                        throw new Error("Upload failed");
                      }

                      const data = await response.json();

                      // Provide the image URL to TinyMCE
                      cb(data.location, { title: file.name });
                    } catch (error) {
                      console.error("Error uploading image:", error);
                    }
                  };

                  input.click();
                },

                placeholder: "Write Your Post...",
              }}
              onEditorChange={(newContent) => setDescription(newContent)}
            />
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
              placeholder="Enter Tags (press space to add)"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 rounded-md"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
            />
            <div className="mt-4 flex flex-wrap justify-center items-center">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-blue-500 text-white text-sm px-2 py-1 rounded-full mr-2 mb-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-2 text-xs text-gray-200 hover:text-gray-100"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {message && <p className="text-red-500 mb-4">{message}</p>}
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white rounded-md"
          >
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;
