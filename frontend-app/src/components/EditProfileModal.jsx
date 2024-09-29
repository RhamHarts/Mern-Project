import React, { useState } from "react";

const EditProfile = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [Facebook, setFacebook] = useState("");
  const [Twitter, setTwitter] = useState("");
  const [Instagram, setInstagram] = useState("");
  const [Tiktok, setTiktok] = useState(""); // State untuk menyimpan data social media
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSocialMediaModal, setShowSocialMediaModal] = useState(false); // State untuk menampilkan modal sosial media

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleFacebookChange = (event) => {
    setFacebook(event.target.value);
  };

  const handleTwitterChange = (event) => {
    setTwitter(event.target.value);
  };

  const handleInstagramChange = (event) => {
    setInstagram(event.target.value);
  };

  const handleTiktokChange = (event) => {
    setTiktok(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Bio:", bio);
    console.log("Facebook:", Facebook);
    console.log("Twitter:", Twitter);
    console.log("Instagram:", Instagram);

    console.log("Tiktok:", Tiktok);
    setIsModalOpen(false);
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
    setShowSocialMediaModal(true); // Set state untuk menampilkan modal sosial media
  };

  const handleBackToEditProfile = () => {
    setShowSocialMediaModal(false); // Set state untuk menutup modal sosial media
    setIsModalOpen(true); // Tetapkan isModalOpen menjadi true untuk membuka kembali modal Edit Profile
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
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 w-1/2 h-4/5 p-5 rounded-lg shadow-md text-white overflow-y-auto">
            {/* Container untuk icon close di kanan atas */}
            <div className="relative mb-10 ">
              <h2 className="font-bold text-3xl absolute left-1/2 transform -translate-x-1/2">
                Edit Profile
              </h2>
              <img
                src="/Icons/cross.png"
                alt="Close"
                className="w-10 h-10 cursor-pointer absolute right-0 -top-2 m-2"
                onClick={handleCloseModal}
              />
            </div>

            <form className="flex flex-col mt-4" onSubmit={handleSubmit}>
              <div>
                <h2 className="mt-5">Name:</h2>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="p-3 border border-gray-300 rounded-lg text-lg w-11/12 bg-gray-700"
                />
              </div>
              <div>
                <h2 className="mt-5">Email:</h2>
                <input
                  type="text"
                  value={email}
                  onChange={handleEmailChange}
                  className="p-3 border border-gray-300 rounded-lg text-lg w-11/12 bg-gray-700"
                />
              </div>

              <div>
                <h2 className="mt-5">Bio:</h2>
                <textarea
                  value={bio}
                  onChange={handleBioChange}
                  className="p-3 border border-gray-300 rounded-lg text-lg w-11/12 bg-gray-700 resize-none"
                />
              </div>

              {/* Tombol Social Media */}
              <div className="mt-5">
                <button
                  className="bg-gray-800 text-white py-3 rounded-md cursor-pointer ease-in-out w-11/12 mt-2"
                  onClick={handleSocialMediaClick}
                >
                  Add Your Social Media
                </button>
              </div>

              {/* Tombol Simpan dan Cancel */}
              <div className="flex justify-end mt-5">
                <button
                  type="button"
                  className="p-2 bg-blue-600 text-white rounded-md text-lg transition duration-300 ease-in-out w-1/6 cursor-pointer hover:bg-blue-700 mr-5"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-md text-lg transition duration-300 ease-in-out w-1/6 cursor-pointer hover:bg-blue-700"
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
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 w-1/2 h-4/5 p-5 rounded-lg shadow-md text-white overflow-y-auto">
            {/* Konten modal */}
            <div>
              <div className="relative top-0 h-10 z-50">
                <h2 className="text-3xl font-bold relative bottom-1">
                  Social Media
                </h2>
                <img
                  src="/Icons/left.svg"
                  alt="Close"
                  className="absolute h-10 w-10 -left-2 bottom-2  text-white cursor-pointer"
                  onClick={handleBackToEditProfile}
                />
                <img
                  src="/Icons/cross.png"
                  alt="Close"
                  className="absolute h-10 w-10 -right-1 bottom-2 text-white cursor-pointer"
                  onClick={handleCloseModal1}
                />
              </div>
              <h2 className="mb-10 mt-5 relative">
                Add your link social media accounts :
              </h2>
              {/* Input forms untuk social media */}

              <h2 className="relative mt-5">Facebook</h2>
              <div className="flex items-center mt-2">
                <div className="bg-gray-800 rounded-l-md w-10 h-11 flex items-center justify-center mr-0">
                  <img
                    src="/Icons/facebook1.png"
                    alt="Facebook Icon"
                    className="w-4/5 h-auto"
                  />
                </div>
                <input
                  type="text"
                  value={Facebook}
                  onChange={handleFacebookChange}
                  className="text-white py-2 px-4 rounded-tr-lg rounded-br-lg border-none text-lg bg-gray-800 w-full"
                />
              </div>

              <h2 className="relative mt-5">Twitter</h2>
              <div className="flex items-center mt-2">
                <div className="bg-gray-800 rounded-l-md w-10 h-11 flex items-center justify-center mr-0">
                  <img
                    src="/Icons/twitter-x1.png"
                    alt="Twitter Icon"
                    className="w-4/5 h-auto"
                  />
                </div>
                <input
                  type="text"
                  value={Twitter}
                  onChange={handleTwitterChange}
                  className="text-white py-2 px-4 rounded-tr-lg rounded-br-lg border-none text-lg bg-gray-800 w-full"
                />
              </div>

              <h2 className="relative mt-5">Instagram</h2>
              <div className="flex items-center mt-2">
                <div className="bg-gray-800 rounded-l-md w-10 h-11 flex items-center justify-center mr-0">
                  <img
                    src="/Icons/instagram1.png"
                    alt="Instagram Icon"
                    className="w-4/5 h-auto"
                  />
                </div>
                <input
                  type="text"
                  value={Instagram}
                  onChange={handleInstagramChange}
                  className="text-white py-2 px-4 rounded-tr-lg rounded-br-lg border-none text-lg bg-gray-800 w-full"
                />
              </div>

              <h2 className="relative mt-5">Tiktok</h2>
              <div className="flex items-center mt-2">
                <div className="bg-gray-800 rounded-l-md w-10 h-11 flex items-center justify-center mr-0">
                  <img
                    src="/Icons/tiktok1.PNG"
                    alt="Tiktok Icon"
                    className="w-4/5 h-auto"
                  />
                </div>
                <input
                  type="text"
                  value={Tiktok}
                  onChange={handleTiktokChange}
                  className="text-white py-2 px-4 rounded-tr-lg rounded-br-lg border-none text-lg bg-gray-800 w-full"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end mr-4 mt-5">
                <button
                  type="button"
                  className="p-2 bg-blue-600 text-white rounded-md text-lg transition duration-300 ease-in-out cursor-pointer hover:bg-blue-700 mr-5"
                  onClick={handleCloseModal1}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-md text-lg transition duration-300 ease-in-out cursor-pointer hover:bg-blue-700 mr-5"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
