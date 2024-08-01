import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    author: "",
    dateBirth: "",
    email: "",
    imageProfile: "", // Simpan URL gambar profil di sini
  });

  const [profileData, setProfileData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

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
          author: profile.author,
          dateBirth: dateBirth,
          email: profile.email,
          imageProfile: isEditMode ? null : profile.imageProfile || "", // Set null only in edit mode
        }));
        console.log(profile);
      } catch (error) {
        console.error("Error fetching the profile:", error);
      }
    };

    fetchProfile();
  }, [isEditMode]);

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
    updatedFormData.append("author", formData.author);
    updatedFormData.append("dateBirth", formData.dateBirth);
    updatedFormData.append("email", formData.email);
    if (formData.imageProfile) {
      updatedFormData.append("imageProfile", formData.imageProfile);
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/profile/now",
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
        author: updatedProfile.author,
        dateBirth: dateBirth,
        email: updatedProfile.email,
        imageProfile: updatedProfile.imageProfile || "", // Update URL gambar profil
      });

      // Exit edit mode after successful update
      setIsEditMode(false);
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleFormSubmit}
        className="relative bottom-40 bg-gray-200 p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col"
      >
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
                    alt="Profile Image"
                    className="w-full h-32 mb-4 cursor-pointer"
                  />
                </label>
              </>
            ) : (
              <img
                src={`http://localhost:3001/uploads/profile/${formData.imageProfile}`}
                alt="Profile Image"
                className="w-full h-32 mb-4"
              />
            )}
          </div>
        )}
        <div className="flex flex-col">
          <label htmlFor="author" className="mb-1 text-gray-600 font-semibold">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            disabled={!isEditMode} // Disable input in read mode
            className={`border border-gray-300 rounded-lg px-3 py-2 ${
              !isEditMode ? "bg-gray-200" : ""
            }`}
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
            disabled={!isEditMode} // Disable input in read mode
            className={`border border-gray-300 rounded-lg px-3 py-2 ${
              !isEditMode ? "bg-gray-200" : ""
            }`}
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
            disabled={!isEditMode} // Disable input in read mode
            className={`border border-gray-300 rounded-lg px-3 py-2 ${
              !isEditMode ? "bg-gray-200" : ""
            }`}
          />
        </div>
        {isEditMode && (
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600 transition duration-200 mt-4"
          >
            Update Profile
          </button>
        )}
        <button
          type="button"
          onClick={toggleEditMode}
          className={`${
            isEditMode ? "bg-gray-500" : "bg-blue-500"
          } text-white w-full py-2 rounded-lg hover:bg-blue-600 transition duration-200 mt-4`}
        >
          {isEditMode ? "Cancel" : "Edit Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
