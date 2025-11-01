// Category.js - Mongoose model for categories

const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot be more than 50 characters'],
    },
    slug: {
      type: String,
      unique: true,
      required: false,
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
  },
  { timestamps: true }
);

// Create slug from name before saving (runs before validation)
CategorySchema.pre('save', function (next) {
  // Always generate slug if it doesn't exist, is empty, or if name is modified
  if (!this.slug || this.slug === '' || this.isModified('name')) {
    if (this.name) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
    }
  }

  next();
});

// Also handle slug generation before validate (runs first)
CategorySchema.pre('validate', function (next) {
  // ALWAYS ensure slug is set before validation
  if (this.name) {
    if (!this.slug || this.slug === '') {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
    }
  }
  next();
});

module.exports = mongoose.model('Category', CategorySchema);

