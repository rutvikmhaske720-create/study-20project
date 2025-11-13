# LearnConnect

A modern collaborative learning platform that helps users discover educational resources (YouTube videos and articles) and connect with fellow learners through topic-based communities.

## Features

- 🔐 **User Authentication** - Secure JWT-based authentication with signup and login
- 🎓 **Resource Discovery** - Search YouTube videos and articles on any topic
- 👥 **Study Groups** - Create, join, and participate in topic-based study communities
- 📊 **Dashboard** - Personalized dashboard with recent searches and joined groups
- ❓ **Doubts Section** - Ask questions and help the community learn together
- 🌓 **Dark Mode** - Beautiful dark and light theme support
- 📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS
- **React Router v6** - Client-side routing
- **TypeScript** - Type safety

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Database (can be upgraded to PostgreSQL)
- **JWT** - JSON Web Tokens for authentication
- **Pydantic** - Data validation

## Project Structure

```
.
├── client/                    # React frontend
│   ├── pages/                # Route pages (Index, Login, Signup, etc.)
│   ├── components/           # Reusable components
│   │   ├── layout/          # Layout components (Header, Layout)
│   │   └── ui/              # Pre-built UI components
│   ├── lib/                 # Utility functions
│   ├── App.tsx              # App entry point and routing
│   └── global.css           # Global styles and theme
│
├── backend/                   # FastAPI backend
│   ├── api/                 # API routes
│   │   ├── auth.py         # Authentication routes
│   │   ├── groups.py       # Groups CRUD endpoints
│   │   ├── search.py       # Search functionality
│   │   ├── dashboard.py    # Dashboard endpoint
│   │   └── doubts.py       # Doubts Q&A endpoint
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── database.py         # Database configuration
│   ├── auth.py             # Authentication utilities
│   ├── config.py           # Configuration and settings
│   ├── dependencies.py     # Dependency injection
│   ├── main.py             # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Example environment variables
│
├── shared/                   # Shared types (if any)
├── package.json            # Frontend dependencies
├── tailwind.config.ts      # TailwindCSS configuration
└── README.md              # This file
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm/pnpm
- Python 3.8+
- Git

### Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create `.env` file from example:**
   ```bash
   cp .env.example .env
   ```

6. **Update `.env` with your settings** (optional for local development):
   ```
   SECRET_KEY=your-super-secret-key
   YOUTUBE_API_KEY=your-youtube-api-key
   BING_SEARCH_API_KEY=your-bing-search-api-key
   ```

7. **Run the FastAPI server:**
   ```bash
   python main.py
   ```

   The backend will be running on `http://localhost:8000`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or npm install
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   # or npm run dev
   ```

   The frontend will be running on `http://localhost:5173`

## Development Workflow

### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
```

### Terminal 2 - Frontend
```bash
pnpm dev
```

The frontend will automatically proxy requests to the backend at `http://localhost:8000`.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Search
- `GET /api/search/{topic}` - Search for YouTube videos and articles

### Groups
- `GET /api/groups` - List all groups
- `POST /api/groups` - Create a new group
- `GET /api/groups/{id}` - Get group details
- `POST /api/groups/{id}/join` - Join a group
- `POST /api/groups/{id}/leave` - Leave a group
- `POST /api/groups/{id}/resources` - Share a resource in a group

### Dashboard
- `GET /api/dashboard` - Get personalized dashboard data

### Doubts
- `GET /api/doubts` - List all doubts
- `POST /api/doubts` - Create a new doubt
- `GET /api/doubts/{id}` - Get doubt details
- `DELETE /api/doubts/{id}` - Delete a doubt

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=sqlite:///./learnconnect.db

# JWT
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Keys
YOUTUBE_API_KEY=your-youtube-api-key-here
BING_SEARCH_API_KEY=your-bing-search-api-key-here

# CORS
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

## Getting API Keys

### YouTube Data API v3
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "YouTube Data API v3"
4. Create an API key in credentials
5. Add the key to your `.env` file

### Bing Web Search API
1. Go to [Azure Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/)
2. Create a Bing Search resource
3. Get your API key from the resource
4. Add the key to your `.env` file

## Building for Production

### Frontend
```bash
pnpm build
# Output will be in dist/spa/
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
# Or use a production server like Gunicorn:
# gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

## Database Migration

If you need to change the database (e.g., from SQLite to PostgreSQL):

1. Update `DATABASE_URL` in `.env`:
   ```env
   # For PostgreSQL:
   DATABASE_URL=postgresql://user:password@localhost/learnconnect
   ```

2. Install the PostgreSQL driver:
   ```bash
   pip install psycopg2-binary
   ```

3. Restart the FastAPI server - tables will be created automatically

## Features in Detail

### User Authentication
- Secure password hashing with bcrypt
- JWT token-based authentication
- User profiles with name, email, and profile picture

### Topic Search
- Real-time search for YouTube videos
- Article search using Bing Web Search API
- Search history tracking for personalized recommendations

### Study Groups
- Create topic-based study communities
- Join groups to collaborate with other learners
- Share learning resources (videos, articles, courses)
- View group members and shared resources

### Dashboard
- Personalized learning dashboard
- Recent search history
- Joined groups overview
- Recommended topics based on interests

### Doubts & Questions
- Post questions on any topic
- View all community questions
- Filter questions by topic
- Community-driven learning

### Theme Support
- Light and dark mode toggle
- Persistent theme preference
- Beautiful gradient UI elements

## Troubleshooting

### CORS Errors
If you get CORS errors, make sure:
1. Backend is running on `http://localhost:8000`
2. Frontend is running on `http://localhost:5173`
3. CORS is properly configured in backend config

### Database Issues
- SQLite database is created automatically on first run
- Delete `learnconnect.db` to reset the database
- For PostgreSQL, ensure the database exists before running

### API Key Issues
- YouTube and Bing API keys are optional for development
- The app will show placeholder results if keys are not configured
- See "Getting API Keys" section above

## Support and Contributions

For issues or contributions, please refer to the main project repository.

## License

MIT License - Feel free to use this project for learning and development.

## Summary

LearnConnect is a complete, production-ready learning platform that combines:
- Modern frontend with React and TailwindCSS
- Powerful FastAPI backend
- Beautiful UI with dark mode support
- Full-featured learning community platform

Start learning and connecting with fellow learners today! 🚀
