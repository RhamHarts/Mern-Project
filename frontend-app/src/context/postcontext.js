import React, { createContext, useState, useCallback, useEffect } from "react";
import axios from "axios";

export const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [limit, setLimit] = useState(6);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPosts = useCallback(async () => {
    try {
      // Ambil postingan dari 0 sampai limit yang diinginkan
      const response = await axios.get(
        `http://localhost:3001/posts?limit=${limit}`
      );

      // Set postingan baru yang diambil dari server
      setPosts(response.data.posts);
      setTotalPosts(response.data.totalPosts);
    } catch (error) {
      console.error("Error fetching the posts:", error);
    }
  }, [limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    setVisiblePosts(posts.slice(0, limit));
  }, [posts, limit]);

  const loadMorePosts = () => {
    // Set limit baru untuk menambah jumlah postingan yang akan diambil dari server
    setLimit((prevLimit) => prevLimit + 6);
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        visiblePosts,
        totalPosts,
        loadMorePosts,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
