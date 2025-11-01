import { useEffect, useState } from 'react';
import { usePosts } from '../context/PostContext';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import Error from '../components/Error';
import './Posts.css';

const Posts = () => {
  const {
    posts,
    categories,
    loading,
    error,
    fetchPosts,
    fetchCategories,
    searchPosts,
    pagination,
  } = usePosts();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts(1);
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchPosts(1, selectedCategory);
    } else {
      fetchPosts(1);
    }
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchPosts(searchQuery);
    } else {
      fetchPosts(1, selectedCategory);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchPosts(1, selectedCategory);
  };

  if (loading && posts.length === 0) {
    return <Loading />;
  }

  return (
    <div className="posts-page">
      <div className="container">
        <div className="posts-header">
          <h1>All Posts</h1>
        </div>

        <div className="posts-filters">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="btn btn-secondary"
              >
                Clear
              </button>
            )}
          </form>

          <div className="category-filter">
            <label htmlFor="category">Filter by Category:</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && posts.length === 0 && (
          <Error message={error} onRetry={() => fetchPosts(1)} />
        )}

        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts found.</p>
          </div>
        ) : (
          <>
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {pagination.page < pagination.pages && (
              <div className="load-more">
                <button
                  onClick={() => fetchPosts(pagination.page + 1, selectedCategory)}
                  className="btn btn-secondary"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Posts;

