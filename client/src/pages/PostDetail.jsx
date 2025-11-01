import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';
import Loading from '../components/Loading';
import Error from '../components/Error';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postService.getPost(id);
      setPost(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postService.deletePost(id);
      navigate('/posts');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete post');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await postService.addComment(id, { content: comment });
      setPost(response.data);
      setComment('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={fetchPost} />;
  }

  if (!post) {
    return <Error message="Post not found" />;
  }

  const isAuthor = user && (user.id === post.author?._id || user.role === 'admin');

  const [imageError, setImageError] = useState(false);

  const getImageUrl = (imageName) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}/uploads/${imageName}`;
  };

  return (
    <div className="post-detail">
      <div className="container">
        <div className="post-detail-content">
          {post.featuredImage && !imageError && (
            <div className="post-detail-image">
              <img
                src={getImageUrl(post.featuredImage)}
                alt={post.title}
                onError={() => setImageError(true)}
                onLoad={() => setImageError(false)}
              />
            </div>
          )}
          {imageError && post.featuredImage && (
            <div className="post-detail-image post-detail-image-placeholder">
              <span>Image not available</span>
            </div>
          )}

          <div className="post-detail-header">
            <div className="post-detail-meta">
              <span className="post-detail-category">{post.category?.name}</span>
              <span className="post-detail-date">{formatDate(post.createdAt)}</span>
              <span className="post-detail-views">{post.viewCount} views</span>
            </div>

            {isAuthor && (
              <div className="post-detail-actions">
                <Link to={`/posts/${id}/edit`} className="btn btn-secondary">
                  Edit
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                  Delete
                </button>
              </div>
            )}
          </div>

          <h1 className="post-detail-title">{post.title}</h1>

          <div className="post-detail-author">
            By {post.author?.name || 'Anonymous'}
          </div>

          <div className="post-detail-body">
            <p>{post.content}</p>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="post-detail-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="post-detail-comments">
            <h2>Comments ({post.comments?.length || 0})</h2>

            {user ? (
              <form onSubmit={handleAddComment} className="comment-form">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="comment-input"
                  rows="3"
                />
                <button
                  type="submit"
                  disabled={commentLoading || !comment.trim()}
                  className="btn btn-primary"
                >
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            ) : (
              <p className="login-prompt">
                <Link to="/login">Login</Link> to add a comment
              </p>
            )}

            <div className="comments-list">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <div className="comment-author">
                      {comment.user?.name || 'Anonymous'}
                    </div>
                    <div className="comment-date">
                      {formatDate(comment.createdAt)}
                    </div>
                    <div className="comment-content">{comment.content}</div>
                  </div>
                ))
              ) : (
                <p className="no-comments">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;

