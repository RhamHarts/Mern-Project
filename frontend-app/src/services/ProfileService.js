// src/services/UserService.js

const PROFILE_URL = 'http://localhost:3001/profile';

export const profileUser = async (user) => {
  try {
    const response = await fetch(PROFILE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error update profile user:', error);
    throw error; // Propagate the error for handling in components
  }
};
