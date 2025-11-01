import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { postService, categoryService } from '../services/api';
import Loading from '../components/Loading';
import './PostForm.css';

const PostForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { categories, fetchCategories } = usePosts();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    isPublished: false,
    featuredImage: null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchCategories();

    if (id) {
      fetchPost();
    }
  }, [id, isAuthenticated]);

  const fetchPost = async () => {
    try {
      setFetching(true);
      const response = await postService.getPost(id);
      const post = response.data;
      
      // Check if user is author or admin
      if (post.author._id !== JSON.parse(localStorage.getItem('user')).id && 
          JSON.parse(localStorage.getItem('user')).role !== 'admin') {
        navigate('/posts');
        return;
      }

      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        category: post.category._id,
        tags: post.tags?.join(', ') || '',
        isPublished: post.isPublished || false,
        featuredImage: null,
      });

      if (post.featuredImage) {
        setImagePreview(`http://localhost:5000/uploads/${post.featuredImage}`);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to fetch post');
      navigate('/posts');
    } finally {
      setFetching(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    setCreatingCategory(true);
    try {
      const response = await categoryService.createCategory({ name: newCategoryName.trim() });
      
      // Refresh categories list
      await fetchCategories();
      
      // Set the newly created category as selected
      setFormData({
        ...formData,
        category: response.data._id,
      });
      
      // Reset new category form
      setShowNewCategory(false);
      setNewCategoryName('');
      
      // Clear any category errors
      if (errors.category) {
        setErrors({
          ...errors,
          category: '',
        });
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create category');
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file,
      });

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('category', formData.category);
      submitData.append('isPublished', formData.isPublished);

      if (formData.excerpt) {
        submitData.append('excerpt', formData.excerpt);
      }

      if (formData.tags) {
        submitData.append('tags', formData.tags);
      }

      if (formData.featuredImage) {
        submitData.append('featuredImage', formData.featuredImage);
      }

      if (id) {
        await postService.updatePost(id, submitData);
      } else {
        await postService.createPost(submitData);
      }

      navigate('/posts');
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const newErrors = {};
        errorData.errors.forEach((error) => {
          newErrors[error.param] = error.msg;
        });
        setErrors(newErrors);
      } else {
        alert(errorData?.error || 'Failed to save post');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loading />;
  }

  return (
    <div className="post-form-page">
      <div className="container">
        <div className="post-form-container">
          <h1>{id ? 'Edit Post' : 'Create New Post'}</h1>

          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <div className="error">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="content">Content *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className={errors.content ? 'error' : ''}
              />
              {errors.content && <div className="error">{errors.content}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="excerpt">Excerpt</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <label htmlFor="category">Category *</label>
                {!showNewCategory && (
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(true)}
                    className="btn btn-secondary"
                    style={{ fontSize: '12px', padding: '5px 10px' }}
                  >
                    + Add Category
                  </button>
                )}
              </div>
              {showNewCategory ? (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <input
                    type="text"
                    placeholder="Enter category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={creatingCategory || !newCategoryName.trim()}
                    className="btn btn-success"
                    style={{ fontSize: '14px', padding: '10px 15px' }}
                  >
                    {creatingCategory ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategoryName('');
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: '14px', padding: '10px 15px' }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.category && <div className="error">{errors.category}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., react, javascript, web"
              />
            </div>

            <div className="form-group">
              <label htmlFor="featuredImage">Featured Image</label>
              <input
                type="file"
                id="featuredImage"
                name="featuredImage"
                accept="image/*"
                onChange={handleChange}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                />
                Publish immediately
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/posts')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Saving...' : id ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostForm;

