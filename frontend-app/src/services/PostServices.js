// src/services/PostService.js
const API_URL = 'http://localhost:3000/api/posts';

export const fetchPosts = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

export const fetchPostById = async (postId) => {
  const response = await fetch(`${API_URL}/${postId}`);
  return await response.json();
};

export const createPost = async (post) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });
  return await response.json();
};
