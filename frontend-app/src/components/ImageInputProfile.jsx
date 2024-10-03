import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";

const ImageInputProfile = ({ imageSrc, onCancel, onSave }) => {
  const fileInputRef = useRef(null); // Ref untuk input file
  const editorRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal
  // eslint-disable-next-line no-unused-vars
  const [profileData, setProfileData] = useState(null);
  const [imagePreview, setImagePreview] = useState(imageSrc || null);
  // eslint-disable-next-line no-unused-vars
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [formData, setFormData] = useState({
    imageProfile: "",
  });

  // Fungsi untuk menangani perubahan file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsImageChanged(true);
        setIsModalOpen(true); // Buka modal saat file dipilih
      };
      reader.readAsDataURL(file);
    }
  };

  // Fungsi untuk menyimpan gambar yang di-crop dan dikirimkan ke server
  // Fungsi untuk menyimpan gambar yang di-crop dan dikirimkan ke server
  const handleSave = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImage().toDataURL();
      const blob = await (await fetch(canvas)).blob();

      // Pastikan file input ref memiliki file
      const fileInput = fileInputRef.current;
      const originalFileName =
        fileInput && fileInput.files[0]
          ? fileInput.files[0].name
          : "profile.png";

      const updatedFormData = new FormData();
      updatedFormData.append("imageProfile", blob, originalFileName); // Gunakan nama asli di sini

      try {
        const storedToken = localStorage.getItem("token");

        const response = await axios.post(
          "http://localhost:3001/profile/image",
          updatedFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (response.data && response.data.profile) {
          alert("Profile updated successfully");
          const updatedProfile = response.data.profile;
          setProfileData(updatedProfile);
          setFormData({
            ...formData,
            imageProfile: updatedProfile.imageProfile || "",
          });

          // Refresh halaman setelah profil berhasil diperbarui
          window.location.reload();
        } else {
          console.error("Response data:", response.data);
          alert("Failed to update profile: Unexpected response format");
        }
      } catch (error) {
        console.error(
          "Failed to update profile:",
          error.response ? error.response.data : error.message
        );
        alert("Failed to update profile");
      }
    }
  };

  // Fungsi untuk membatalkan perubahan gambar
  const cancelImageChange = () => {
    setImagePreview(null);
    setIsImageChanged(false);
    setIsModalOpen(false); // Tutup modal
  };

  return (
    <div>
      <label htmlFor="imageProfile" className="cursor-pointer">
        <img
          src={imagePreview || "default-profile.png"} // Gambar profil default
          alt="Profile"
          className="hidden"
        />
      </label>
      <input
        type="file"
        id="imageProfile"
        name="imageProfile"
        accept=".png, .jpg, .jpeg"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      {isModalOpen && ( // Tampilkan modal jika isModalOpen true
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white  p-8 rounded-lg shadow-lg">
            <h2 className="text-center text-2xl mb-4">Edit Profile Picture</h2>
            <div className="flex justify-center mb-6">
              {imagePreview && (
                <AvatarEditor
                  ref={editorRef}
                  image={imagePreview}
                  width={400}
                  height={400}
                  border={50}
                  borderRadius={200}
                  scale={1.4}
                />
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
                onClick={handleSave}
              >
                <FaCheck className="mr-2" /> Confirm
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center"
                onClick={cancelImageChange}
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageInputProfile;
