# Week 4 Assignment Checklist

## ✅ COMPLETED TASKS

### Task 1: Project Setup ✅
- ✅ Clear directory structure for client and server
- ✅ MongoDB connection using Mongoose
- ✅ Express.js server with middleware
- ✅ React front-end using Vite with proxy configuration
- ⚠️ Environment variables (need .env.example files)

### Task 2: Back-End Development ✅
- ✅ GET /api/posts - Get all blog posts
- ✅ GET /api/posts/:id - Get specific blog post
- ✅ POST /api/posts - Create new blog post
- ✅ PUT /api/posts/:id - Update blog post
- ✅ DELETE /api/posts/:id - Delete blog post
- ✅ GET /api/categories - Get all categories
- ✅ POST /api/categories - Create new category
- ✅ Mongoose models for Post and Category with relationships
- ✅ Input validation using express-validator
- ✅ Error handling middleware

### Task 3: Front-End Development ✅
- ✅ Post list view (Posts.jsx, Home.jsx)
- ✅ Single post view (PostDetail.jsx)
- ✅ Create/edit post form (PostForm.jsx)
- ✅ Navigation and layout (Navbar.jsx)
- ✅ React Router for navigation
- ✅ React hooks (useState, useEffect, useContext)
- ✅ Custom hook for API calls (useApi.js)

### Task 4: Integration and Data Flow ✅
- ✅ API service in React
- ✅ State management for posts and categories
- ✅ Forms with proper validation
- ⚠️ Optimistic UI updates (partially implemented - state updates after API calls)
- ✅ Loading and error states

### Task 5: Advanced Features ✅
- ✅ User authentication (register, login, protected routes)
- ✅ Image uploads for featured images
- ✅ Pagination for post list
- ✅ Searching and filtering functionality
- ✅ Comments feature for blog posts

## ⚠️ REMAINING ITEMS

### 1. Environment Example Files
- [ ] Create `server/.env.example` file
- [ ] Create `client/.env.example` file
- These are blocked by .gitignore but we need to create them manually

### 2. README Screenshots
- [ ] Add screenshots of the application to README.md
  - Homepage
  - Post list page
  - Post detail page
  - Create/Edit post form
  - Login/Register pages
  - Search and filter functionality

### 3. Enhanced Optimistic UI (Optional Enhancement)
- Currently: UI updates after successful API calls
- Could enhance: Update UI immediately before API call, then rollback on error

