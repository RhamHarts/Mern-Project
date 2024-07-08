import React, { useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    author: "",
    dateBirth: "",
    email: "",
    imageProfile: null,
  });

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
      const response = await axios.post(
        "http://localhost:3001/profile",
        updatedFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Profile updated successfully");
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <form onSubmit={handleFormSubmit}>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg flex flex-col ml-96 justify-center content-center">
          <div className="flex flex-col">
            <label
              htmlFor="imageProfile"
              className="mb-1 text-gray-600 font-semibold"
            >
              Profile Image
            </label>
            <input
              type="file"
              id="imageProfile"
              name="imageProfile"
              accept=".png, .jpg, .jpeg"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            {formData.imageProfile && (
              <img
                src={URL.createObjectURL(formData.imageProfile)}
                alt="Profile Preview"
                className="w-full h-32 mt-2 bg-gray-500"
              />
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="author"
              className="mb-1 text-gray-600 font-semibold"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
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
              value={formData.dateBirth}
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
              value={formData.email}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
