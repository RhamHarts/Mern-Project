import React, { useState, useEffect } from "react";
// import { AuthContext } from "../../public/ahok.jpg";

const ProfilePage = () => {
  // const { user, updateProfile } = useContext(AuthContext);
  const user = {
    username: "dummyUser",
    author: "Dummy Author",
    birthDate: "2000-01-01",
    email: "dummy@example.com",
    imageProfile: "https://via.placeholder.com/150",
  };

  const [formData, setFormData] = useState({
    author: "",
    birthDate: "",
    email: "",
    imageProfile: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        author: user.author || "",
        birthDate: user.birthDate || "",
        email: user.email || "",
        imageProfile: user.imageProfile || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: files[0],
    }));
  };

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();
  //   const updatedFormData = new FormData();
  //   updatedFormData.append("author", formData.author);
  //   updatedFormData.append("birthDate", formData.birthDate);
  //   updatedFormData.append("email", formData.email);
  //   if (formData.imageProfile) {
  //     updatedFormData.append("imageProfile", formData.imageProfile);
  //   }
  //   try {
  //     await updateProfile(updatedFormData);
  //     alert("Profile updated successfully");
  //   } catch (error) {
  //     alert("Failed to update profile");
  //   }
  // };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
      {/* <div className="">
        <img className="w-full h-32" alt="" src="./ahok.jpg" />
      </div> */}

      <label htmlFor="imageProfile">
        <img
          src={formData.imageProfile}
          alt="Profile"
          className="w-full h-32 cursor-pointer"
        />
        <input
          type="file"
          id="imageProfile"
          name="imageProfile"
          accept=".png, .jpg, .jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      <label htmlFor="imageProfile2">
        <img
          src={formData.imageProfile2}
          className="w-48 h-48 rounded-full bg-red-500  cursor-pointer absolute top-32 left-10"
        />
        <input
          type="file"
          id="imageProfile"
          name="imageProfile"
          accept=".png, .jpg, .jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg flex flex-col ml-96 justify-center content-center">
        <label htmlFor="username" className="mb-1 text-gray-600 font-semibold">
          UserName
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
        <form className="space-y-4 w-full">
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
              htmlFor="birthDate"
              className="mb-1 text-gray-600 font-semibold"
            >
              Birth Date
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
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
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
