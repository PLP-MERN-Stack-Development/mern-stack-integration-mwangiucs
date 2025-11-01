import { Link } from 'react-router-dom';
import { useState } from 'react';
import './PostCard.css';

const PostCard = ({ post }) => {
  const [imageError, setImageError] = useState(false);

  const truncateContent = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getImageUrl = (imageName) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}/uploads/${imageName}`;
  };

  return (
    <div className="post-card">
      {post.featuredImage && !imageError && (
        <div className="post-card-image">
          <img
            src={getImageUrl(post.featuredImage)}
            alt={post.title}
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        </div>
      )}
      {imageError && post.featuredImage && (
        <div className="post-card-image post-card-image-placeholder">
          <span>Image not available</span>
        </div>
      )}
      <div className="post-card-content">
        <div className="post-card-meta">
          <span className="post-card-category">
            {post.category?.name || 'Uncategorized'}
          </span>
          <span className="post-card-date">
            {formatDate(post.createdAt)}
          </span>
        </div>
        <h2 className="post-card-title">
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h2>
        <p className="post-card-excerpt">
          {post.excerpt || truncateContent(post.content)}
        </p>
        <div className="post-card-footer">
          <span className="post-card-author">By {post.author?.name || 'Anonymous'}</span>
          <Link to={`/posts/${post._id}`} className="post-card-read-more">
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

