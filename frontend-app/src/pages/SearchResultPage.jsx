import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchPostList from "../components/SearchPostList";

const SearchResultsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const searchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/posts/search?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        console.log("Search Results Data:", data.posts); // Log data to verify
        setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    searchPosts();
  }, [query]);

  return (
    <div className="search-results-page">
      <h1 className="text-2xl font-bold mb-4">Search Results for: "{query}"</h1>
      {loading ? <p>Loading...</p> : <SearchPostList posts={posts} />}
    </div>
  );
};

export default SearchResultsPage;
