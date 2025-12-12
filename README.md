# 📰 News Portal

A modern, full-stack news portal application with authentication, built with Vue.js, Express, and SQLite.

## ✨ Features

### 🌍 Public Features
- **Browse News Feed** - View all published news articles without authentication
- **Read Articles** - View full article details and comments
- **Responsive Design** - Beautiful UI that works on all devices
- **Modern UI** - Built with Tailwind CSS for a sleek, professional look

### 🔐 Authenticated Features
- **User Authentication** - Secure login and signup with email/password
- **Create Articles** - Write and publish news articles (minimum 20 characters)
- **Edit Articles** - Update your own articles
- **Delete Articles** - Remove your own articles
- **Comment System** - Add comments to any article
- **User Dashboard** - Personalized experience for logged-in users

### 🎨 Design Highlights
- Dark theme with gradient backgrounds
- Smooth animations and transitions
- Loading states and error handling
- Intuitive navigation
- Mobile-responsive grid layouts
- Modal confirmations for destructive actions

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install Frontend Dependencies**
   ```powershell
   npm install
   ```

2. **Install Backend Dependencies**
   ```powershell
   cd backend
   npm install
   cd ..
   ```

### Running the Application

1. **Start the Backend Server** (in one terminal)
   ```powershell
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:3000`

2. **Start the Frontend Development Server** (in another terminal)
   ```powershell
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or similar)

3. **Open your browser** and navigate to the frontend URL

## 📁 Project Structure

```
ffar/
├── backend/
│   ├── server.js          # Express server with REST API
│   ├── package.json       # Backend dependencies
│   └── portal.db          # SQLite database (auto-created)
├── src/
│   ├── components/
│   │   ├── Login.vue      # Login & Signup component
│   │   ├── NewsFeed.vue   # Homepage news grid
│   │   ├── NewsDetail.vue # Article detail with comments
│   │   ├── NewsCreate.vue # Create article form
│   │   └── NewsEdit.vue   # Edit article form
│   ├── App.vue            # Main app layout with navigation
│   ├── main.js            # Vue app initialization & routing
│   ├── app.js             # API utilities & auth helpers
│   └── style.css          # Tailwind CSS imports
├── index.html             # HTML entry point
├── package.json           # Frontend dependencies
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── vite.config.js         # Vite configuration
```

## 🔑 Default Test Accounts

The database comes pre-seeded with test users:

| Email | Password | Name |
|-------|----------|------|
| alice@example.com | password123 | Alice Writer |
| bob@example.com | password123 | Bob Commenter |
| charlie@example.com | password123 | Charlie Editor |

## 🛠️ API Endpoints

### Authentication
- `POST /login` - Login with email and password
- `POST /users` - Create new user account

### News
- `GET /news` - Get all news articles
- `GET /news/:id` - Get single article with comments
- `POST /news` - Create new article (requires auth)
- `PATCH /news/:id` - Update article or add comment (requires auth)
- `DELETE /news/:id` - Delete article (requires auth, owner only)

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get single user

## 🎯 Usage Guide

### For Public Users
1. Visit the homepage to browse all news articles
2. Click "Read More" to view full article details and comments
3. Click "Login" to create an account or sign in

### For Authenticated Users
1. **Sign Up**: Click "Login" → "Sign up" → Fill in your details
2. **Login**: Enter your email and password
3. **Create Article**: Click "Create News" → Write your article → "Publish Article"
4. **Edit Article**: On your articles, click "Edit" → Update content → "Update Article"
5. **Delete Article**: On your articles, click "Delete" → Confirm deletion
6. **Add Comment**: View any article → Scroll to comments → Type and submit

## 🔒 Security Features

- Password validation (minimum 6 characters)
- Email uniqueness validation
- User can only edit/delete their own articles
- Session management with localStorage
- Protected routes for authenticated features
- CORS enabled for API security

## 🎨 Customization

### Tailwind Configuration
Edit `tailwind.config.js` to customize colors, spacing, and animations.

### API URL
Update the `API_URL` in `src/app.js` if deploying to production.

## 🐛 Troubleshooting

**Backend won't start:**
- Ensure port 3000 is not in use
- Check Node.js version (v14+)

**Frontend won't start:**
- Run `npm install` to ensure all dependencies are installed
- Clear npm cache: `npm cache clean --force`

**Database issues:**
- Delete `backend/portal.db` to reset the database
- Restart the backend server to recreate tables
