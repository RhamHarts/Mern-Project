// src/services/PostService.js
const API_URL = 'http://localhost:3001/posts';

export const fetchPosts = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

export const fetchPostById = async (postId) => {
  const response = await fetch(`${API_URL}/${postId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // Menyertakan token untuk otentikasi
    },
  });
  return await response.json();
};

export const createPost = async (post) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // Menyertakan token untuk otentikasi
    },
    body: JSON.stringify(post),
  });
  return await response.json();
};

export const toggleLikePost = async (postId) => {
  console.log('Post ID:', postId);  // Log Post ID
  const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pastikan token valid
    },
  });

  if (!response.ok) {
    console.error('Response status:', response.status);  // Log response status
    throw new Error('Failed to toggle like');
  }

  return response.json();
};


