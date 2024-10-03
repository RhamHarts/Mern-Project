import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProfile = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    aboutMe: "",
    facebook: "",
    twitter: "",
    instagram: "",
    tiktok: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSocialMediaModal, setShowSocialMediaModal] = useState(false);
  const [profileData, setProfileData] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        console.error("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3001/profile/now", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.data && response.data.profile) {
          const profile = response.data.profile;

          // Log all profile data received from the server
          console.log("Fetched profile data:", profile); // Tambahkan log ini

          setProfileData(profile);
          setFormData((prevFormData) => ({
            ...prevFormData,
            username: profile.username,
            email: profile.email,
            imageProfile: profile.imageProfile, // Ambil dari database
            aboutMe: profile.aboutMe || "",
            facebook: profile.facebook,
            instagram: profile.instagram,
            tiktok: profile.tiktok, // Ambil dari database
            twitter: profile.twitter || "",
          }));
        } else {
          console.error(
            "Profile data not found in the response:",
            response.data
          );
        }
      } catch (error) {
        console.error(
          "Error fetching the profile:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e, actionType) => {
    e.preventDefault();

    const data = {
      username: formData.username || "", // Kirim string kosong jika tidak ada input
      email: formData.email || "",
      aboutMe: formData.aboutMe || "",
      facebook: formData.facebook || "",
      instagram: formData.instagram || "",
      twitter: formData.twitter || "",
      tiktok: formData.tiktok || "",
      actionType: actionType,
    };

    axios
      .post("http://localhost:3001/profile/create", data)
      .then((response) => {
        console.log("Profile updated:", response.data);
        // Reset form data setelah submit
        setFormData({
          username: "",
          email: "",
          aboutMe: "",
          facebook: "",
          instagram: "",
          twitter: "",
          tiktok: "",
        });
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });

    window.location.reload();
  };

  const handleEditProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    onClose();
  };

  const handleCloseModal1 = () => {
    setShowSocialMediaModal(false);
    onClose();
  };

  const handleSocialMediaClick = () => {
    setShowSocialMediaModal(true); // Tampilkan modal sosial media
  };

  const handleBackToEditProfile = () => {
    setShowSocialMediaModal(false); // Tutup modal sosial media
    setIsModalOpen(true); // Buka kembali modal Edit Profile
  };

  return (
    <div>
      <button
        className="cursor-pointer border-white border-opacity-80 bg-black rounded-xl box-border w-44 h-10 flex flex-col items-center justify-center transform transition-transform hover:scale-105"
        onClick={handleEditProfileClick}
      >
        <h3 className="text-xl font-inter text-white h-8 text-left">
          Edit Profile
        </h3>
      </button>

      {/* Modal utama */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 w-1/2 h-4/5 p-8 rounded-xl shadow-lg text-white overflow-y-auto relative transform transition-transform duration-300 ease-out">
            <div className="absolute top-0 right-0 m-4">
              <img
                src="/Icons/cross.png"
                alt="Close"
                className="w-8 h-8 cursor-pointer"
                onClick={handleCloseModal}
              />
            </div>
            <h2 className="text-3xl font-semibold text-center mb-8">
              Edit Profile
            </h2>
            <form onSubmit={(e) => handleSubmit(e, "basicInfo")}>
              <div className="mb-6">
                <label htmlFor="username" className="block text-lg font-medium">
                  Username:
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-lg font-medium">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="aboutMe " className="block text-lg font-medium">
                  About Me:
                </label>
                <textarea
                  name="aboutMe"
                  value={formData.aboutMe}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 resize-none"
                />
              </div>

              {/* Tombol Social Media */}
              <div className="mb-6">
                <button
                  type="button"
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 transition duration-200"
                  onClick={handleSocialMediaClick}
                >
                  Add Your Social Media
                </button>
              </div>

              {/* Tombol Simpan dan Cancel */}
              <div className="flex justify-between">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:from-green-600 hover:to-green-800 transition duration-200"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal untuk Social Media */}
      {showSocialMediaModal && (
        <div className="fixed inset-0  flex justify-center items-center z-50 transition-opacity duration-300">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 w-1/2 h-4/5 p-8 rounded-xl shadow-lg text-white overflow-y-auto relative transform transition-transform duration-300 ease-out">
            <div className="absolute top-0 left-0 m-4">
              <img
                src="/Icons/left.svg"
                alt="Back"
                className="w-8 h-8 cursor-pointer"
                onClick={handleBackToEditProfile}
              />
            </div>
            <div className="absolute top-0 right-0 m-4">
              <img
                src="/Icons/cross.png"
                alt="Close"
                className="w-8 h-8 cursor-pointer"
                onClick={handleCloseModal1}
              />
            </div>
            <h2 className="text-3xl font-semibold text-center mb-8">
              Social Media
            </h2>

            <form onSubmit={(e) => handleSubmit(e, "socialMedia")}>
              <div className="mb-6">
                <label htmlFor="facebook" className="block text-lg font-medium">
                  Facebook:
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="twitter" className="block text-lg font-medium">
                  Twitter:
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="instagram"
                  className="block text-lg font-medium"
                >
                  Instagram:
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="tiktok" className="block text-lg font-medium">
                  TikTok:
                </label>
                <input
                  type="text"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                />
              </div>

              {/* Tombol Simpan dan Cancel */}
              <div className="flex justify-between">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
                  onClick={handleCloseModal1}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:from-green-600 hover:to-green-800 transition duration-200"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
