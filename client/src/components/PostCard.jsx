import { Link } from 'react-router-dom';
import './PostCard.css';

const PostCard = ({ post }) => {
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

  return (
    <div className="post-card">
      {post.featuredImage && (
        <div className="post-card-image">
          <img
            src={`http://localhost:5000/uploads/${post.featuredImage}`}
            alt={post.title}
          />
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

