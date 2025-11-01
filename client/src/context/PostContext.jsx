import { createContext, useState, useContext } from 'react';
import { postService, categoryService } from '../services/api';

const PostContext = createContext();

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const fetchPosts = async (page = 1, category = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.getAllPosts(page, 10, category);
      setPosts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const createPost = async (postData) => {
    try {
      const response = await postService.createPost(postData);
      setPosts((prev) => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to create post',
      };
    }
  };

  const updatePost = async (id, postData) => {
    try {
      const response = await postService.updatePost(id, postData);
      setPosts((prev) =>
        prev.map((post) => (post._id === id ? response.data : post))
      );
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to update post',
      };
    }
  };

  const deletePost = async (id) => {
    try {
      await postService.deletePost(id);
      setPosts((prev) => prev.filter((post) => post._id !== id));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to delete post',
      };
    }
  };

  const searchPosts = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.searchPosts(query);
      setPosts(response.data);
      setPagination({ page: 1, pages: 1, total: response.count });
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    posts,
    categories,
    loading,
    error,
    pagination,
    fetchPosts,
    fetchCategories,
    createPost,
    updatePost,
    deletePost,
    searchPosts,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

