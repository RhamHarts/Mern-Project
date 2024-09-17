import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";

const MyProfilePage = () => {
  const [formData, setFormData] = useState({
    dateBirth: "",
    email: "",
    imageProfile: "", // Simpan URL gambar profil di sini
    aboutMe: "", // Added "aboutMe" field
  });

  const [profileData, setProfileData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3001/profile/now");
        const profile = response.data.profile;

        // Convert the date to yyyy-MM-dd format
        const dateBirth = new Date(profile.dateBirth)
          .toISOString()
          .split("T")[0];

        setProfileData(profile);
        setFormData((prevFormData) => ({
          ...prevFormData,
          dateBirth: dateBirth,
          email: profile.email,
          imageProfile: isEditMode ? null : profile.imageProfile || "", // Set null only in edit mode
          aboutMe: profile.aboutMe || "", // Set "aboutMe" from profile
        }));
        console.log(profile);

        // Fetch user's posts
        fetchUserPosts(profile._id);
      } catch (error) {
        console.error("Error fetching the profile:", error);
      }
    };

    fetchProfile();
  }, [isEditMode]);

  const fetchUserPosts = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/profile/posts`);
      setPosts(response.data.posts); // Update the posts state
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      imageProfile: file,
    }));

    // Preview the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();
    updatedFormData.append("dateBirth", formData.dateBirth);
    updatedFormData.append("email", formData.email);
    updatedFormData.append("aboutMe", formData.aboutMe); // Append "aboutMe" to form data
    if (formData.imageProfile) {
      updatedFormData.append("imageProfile", formData.imageProfile);
    }

    try {
      const response = await axios.put(
        "http://localhost:3001/profile/update",
        updatedFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Profile updated successfully");
      const updatedProfile = response.data.profile;

      // Convert the date to yyyy-MM-dd format
      const dateBirth = new Date(updatedProfile.dateBirth)
        .toISOString()
        .split("T")[0];

      setProfileData(updatedProfile);
      console.log("Updated profile data:", updatedProfile); // Log data to console
      // Update the form data with the response data
      setFormData({
        dateBirth: dateBirth,
        email: updatedProfile.email,
        imageProfile: updatedProfile.imageProfile || "", // Update URL gambar profil
        aboutMe: updatedProfile.aboutMe || "", // Update "aboutMe"
      });

      // Exit edit mode after successful update
      setIsEditMode(false);
    } catch (error) {
      alert("Failed to update profile");
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Profile Section */}
      <div className="w-full max-w-md p-8 bg-gray-200 rounded-lg shadow-lg mb-8 mt-10">
        <form onSubmit={handleFormSubmit} className="flex flex-col">
          {profileData && (
            <div className="flex flex-col items-center mb-4">
              {isEditMode ? (
                <>
                  <input
                    type="file"
                    id="imageProfile"
                    name="imageProfile"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="imageProfile"
                    className="flex items-center cursor-pointer"
                  >
                    <img
                      src={
                        imagePreview ||
                        `http://localhost:3001/uploads/profile/${formData.imageProfile}`
                      }
                      alt="Profile"
                      className="w-full h-32 mb-4 cursor-pointer"
                    />
                  </label>
                </>
              ) : (
                <img
                  src={`http://localhost:3001/uploads/profile/${formData.imageProfile}`}
                  alt="Profile"
                  className="w-full h-32 mb-4"
                />
              )}
            </div>
          )}
          <div className="flex flex-col mb-4">
            <label
              htmlFor="dateBirth"
              className="mb-1 text-gray-600 font-semibold"
            >
              Birth Date
            </label>
            <input
              type="date"
              id="dateBirth"
              name="dateBirth"
              value={formData.dateBirth}
              onChange={handleInputChange}
              disabled={!isEditMode} // Disable input in read mode
              className={`border border-gray-300 rounded-lg px-3 py-2 ${
                !isEditMode ? "bg-gray-200" : ""
              }`}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="mb-1 text-gray-600 font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditMode} // Disable input in read mode
              className={`border border-gray-300 rounded-lg px-3 py-2 ${
                !isEditMode ? "bg-gray-200" : ""
              }`}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="aboutMe"
              className="mb-1 text-gray-600 font-semibold"
            >
              About Me
            </label>
            <textarea
              id="aboutMe"
              name="aboutMe"
              value={formData.aboutMe}
              onChange={handleInputChange}
              disabled={!isEditMode} // Disable input in read mode
              rows="4"
              className={`border border-gray-300 rounded-lg px-3 py-2 ${
                !isEditMode ? "bg-gray-200" : ""
              }`}
              placeholder="Tell something about yourself..."
            />
          </div>
          {isEditMode && (
            <button
              type="submit"
              className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600 transition duration-200 mb-4"
            >
              Update Profile
            </button>
          )}
          <button
            type="button"
            onClick={toggleEditMode}
            className={`${
              isEditMode ? "bg-gray-500" : "bg-blue-500"
            } text-white w-full py-2 rounded-lg hover:bg-blue-600 transition duration-200`}
          >
            {isEditMode ? "Cancel" : "Edit Profile"}
          </button>
        </form>
      </div>

      {/* Posts Section */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">My Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <div
              key={post._id} // Pastikan _id unik
              onClick={() => handlePostClick(post)}
              className="max-w-sm rounded overflow-hidden shadow-lg cursor-pointer"
            >
              <div className="max-w-sm rounded overflow-hidden shadow-lg cursor-pointer">
                <img
                  className="w-full h-80 object-cover"
                  src={
                    post.image // Check for image first
                      ? `http://localhost:3001/uploads/post/${post.image}`
                      : post.imageUrl // If no image, check for imageUrl
                      ? post.imageUrl
                      : "path/to/default/image.jpg" // Provide a default image in case both are missing
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
