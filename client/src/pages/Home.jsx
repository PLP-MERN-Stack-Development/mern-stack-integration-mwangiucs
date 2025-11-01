import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../context/PostContext';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import Error from '../components/Error';
import './Home.css';

const Home = () => {
  const { posts, loading, error, fetchPosts, pagination } = usePosts();

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages) {
      fetchPosts(pagination.page + 1);
    }
  };

  if (loading && posts.length === 0) {
    return <Loading />;
  }

  if (error && posts.length === 0) {
    return <Error message={error} onRetry={() => fetchPosts(1)} />;
  }

  return (
    <div className="home">
      <div className="container">
        <div className="home-header">
          <h1>Welcome to MERN Blog</h1>
          <p>Discover amazing articles and stories</p>
        </div>

        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet. Be the first to create one!</p>
            <Link to="/posts/new" className="btn btn-primary">
              Create Post
            </Link>
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
                <button onClick={handleLoadMore} className="btn btn-secondary">
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

export default Home;

