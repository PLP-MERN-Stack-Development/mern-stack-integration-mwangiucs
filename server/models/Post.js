// Post.js - Mongoose model for blog posts

const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    featuredImage: {
      type: String,
      default: 'default-post.jpg',
    },
    slug: {
      type: String,
      unique: true,
      required: false,
    },
    excerpt: {
      type: String,
      maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Helper function to generate unique slug
async function generateUniqueSlug(PostModel, baseSlug, excludeId = null) {
  let slug = baseSlug;
  let counter = 1;
  
  // Check if slug exists (excluding current document if updating)
  let query = { slug: slug };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  let existingPost = await PostModel.findOne(query);
  
  // If slug exists, append a number to make it unique
  while (existingPost) {
    slug = `${baseSlug}-${counter}`;
    query.slug = slug;
    existingPost = await PostModel.findOne(query);
    counter++;
  }
  
  return slug;
}

// Create slug from title before validation (runs first)
PostSchema.pre('validate', async function (next) {
  // ALWAYS ensure slug is set before validation
  if (this.title) {
    if (!this.slug || this.slug === '' || this.isModified('title')) {
      const baseSlug = this.title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
      
      // Generate unique slug
      this.slug = await generateUniqueSlug(this.constructor, baseSlug, this._id);
    }
  }
  next();
});

// Also create slug before saving (backup)
PostSchema.pre('save', async function (next) {
  // Ensure slug is set if it's still missing
  if (this.title && (!this.slug || this.slug === '')) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
    
    // Generate unique slug
    this.slug = await generateUniqueSlug(this.constructor, baseSlug, this._id);
  }
  next();
});

// Virtual for post URL
PostSchema.virtual('url').get(function () {
  return `/posts/${this.slug}`;
});

// Method to add a comment
PostSchema.methods.addComment = function (userId, content) {
  this.comments.push({ user: userId, content });
  return this.save();
};

// Method to increment view count
PostSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

module.exports = mongoose.model('Post', PostSchema); 