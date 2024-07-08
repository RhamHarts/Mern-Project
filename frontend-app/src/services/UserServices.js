// src/services/UserService.js

const REGISTER_URL = 'http://localhost:3001/register';

export const registerUser = async (user) => {
  try {
    const response = await fetch(REGISTER_URL, {
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
    console.error('Error registering user:', error);
    throw error; // Propagate the error for handling in components
  }
};
