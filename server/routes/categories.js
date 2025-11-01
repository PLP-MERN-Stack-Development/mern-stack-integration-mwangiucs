// routes/categories.js - Category routes

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
];

// Routes
router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', protect, categoryValidation, createCategory); // Allow authenticated users to create categories
router.put('/:id', protect, authorize('admin'), categoryValidation, updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;

