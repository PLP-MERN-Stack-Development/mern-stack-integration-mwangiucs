// utils/fixCategorySlugs.js - Fix existing categories that don't have slugs

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

// Load environment variables
dotenv.config();

const fixCategorySlugs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all categories
    const categories = await Category.find({ $or: [{ slug: { $exists: false } }, { slug: '' }, { slug: null }] });
    
    console.log(`Found ${categories.length} categories without slugs`);

    // Update each category
    for (const category of categories) {
      if (category.name) {
        const slug = category.name
          .toLowerCase()
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '-');
        
        category.slug = slug;
        await category.save();
        console.log(`Fixed slug for category: ${category.name} -> ${slug}`);
      }
    }

    // Also check all categories and regenerate slugs if needed
    const allCategories = await Category.find();
    for (const category of allCategories) {
      if (category.name && (!category.slug || category.slug === '')) {
        const slug = category.name
          .toLowerCase()
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '-');
        
        category.slug = slug;
        await category.save();
        console.log(`Updated slug for category: ${category.name} -> ${slug}`);
      }
    }

    console.log('✅ Category slugs fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing category slugs:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  fixCategorySlugs();
}

module.exports = fixCategorySlugs;

