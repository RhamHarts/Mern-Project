import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    author: "",
    dateBirth: "",
    email: "",
    imageProfile: null,
  });

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3001/profile");
        setProfileData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching the posts:", error);
      }
    };

    fetchProfile();
  }, []);

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
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();
    updatedFormData.append("author", formData.author);
    updatedFormData.append("dateBirth", formData.dateBirth);
    updatedFormData.append("email", formData.email);
    if (formData.imageProfile) {
      updatedFormData.append("imageProfile", formData.imageProfile);
    }

    try {
      await axios.post("http://localhost:3001/profile", updatedFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated successfully");
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <form
        onSubmit={handleFormSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col"
      >
        <label
          htmlFor="imageProfile"
          className="flex justify-center mb-4 relative cursor-pointer"
        >
          {formData.imageProfile ? (
            <img
              src={URL.createObjectURL(formData.imageProfile)}
              alt="Profile Preview"
              className="w-32 h-32 object-cover rounded-full"
            />
          ) : (
            <div className="w-32 h-32 flex justify-center items-center border-2 border-dashed border-gray-400 rounded-full">
              <span className="text-gray-400">Upload Image</span>
            </div>
          )}
          <input
            type="file"
            id="imageProfile"
            name="imageProfile"
            accept=".png, .jpg, .jpeg"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
        <div className="flex flex-col">
          <label htmlFor="author" className="mb-1 text-gray-600 font-semibold">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={profileData ? profileData.author : formData.author} // Use profile data if available
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex flex-col">
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
            value={profileData ? profileData.dateBirth : formData.dateBirth} // Use profile data if available
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 text-gray-600 font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profileData ? profileData.email : formData.email} // Use profile data if available
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600 transition duration-200 mt-10"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
