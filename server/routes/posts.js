// routes/posts.js - Post routes

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  searchPosts,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../utils/upload');

// Validation rules
const postValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').notEmpty().withMessage('Category is required'),
];

const commentValidation = [
  body('content').trim().notEmpty().withMessage('Comment content is required'),
];

// Routes
router.get('/search', searchPosts);
router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', protect, upload.single('featuredImage'), postValidation, createPost);
router.put('/:id', protect, upload.single('featuredImage'), postValidation, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/comments', protect, commentValidation, addComment);

module.exports = router;

