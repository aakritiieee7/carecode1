# Mental Pulse Backend API

A comprehensive Next.js backend API for the Mental Pulse student wellness platform, featuring authentication, mood tracking, AI chatbot integration, peer mentorship, and admin analytics.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or use Prisma's local development database)
- Google Gemini API key

### Installation

1. **Clone and install dependencies**
```bash
cd mental-pulse-backend
npm install
```

2. **Environment Setup**
```bash
# Update the following variables in .env:
GEMINI_API_KEY="your-actual-gemini-api-key"
JWT_SECRET="your-super-secure-jwt-secret-make-it-long-and-random"
```

3. **Database Setup**
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Start Prisma Studio to view data
npm run db:studio
```

4. **Start Development Server**
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "securepassword123",
  "fullName": "John Doe",
  "userType": "student",
  "anonymityLevel": 50
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "fullName": "John Doe",
    "userType": "student",
    "anonymityLevel": 50,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-here"
}
```

### POST /api/auth/login
Authenticate and login a user.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "securepassword123"
}
```

### GET /api/users/me
Get current authenticated user profile. Requires authentication.

### PATCH /api/users/me/privacy
Update user privacy settings. Requires authentication.

**Request Body:**
```json
{
  "anonymityLevel": 75
}
```

---

## 📊 Mood Tracking Endpoints

### POST /api/check-ins
Create a new mood entry. Requires authentication.

**Request Body:**
```json
{
  "moodScore": 4,
  "notes": "Feeling good after my morning run",
  "location": "Campus Gym"
}
```

### GET /api/check-ins
Get paginated list of mood entries. Requires authentication.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

### GET /api/check-ins/history
Get mood history with statistics. Requires authentication.

**Query Parameters:**
- `days` (default: 30) - Number of days to include in history

**Response includes:**
- Historical mood entries
- Statistics (average mood, streak, total entries)
- Daily averages for trend analysis

---

## 🤖 AI Chatbot Endpoints

### POST /api/chatbot/chat
Send a message to the AI mental health assistant. Requires authentication.

**Request Body:**
```json
{
  "text": "I'm feeling stressed about my upcoming exams"
}
```

**Response:**
```json
{
  "sessionId": "uuid",
  "userMessage": {
    "id": "uuid",
    "text": "I'm feeling stressed about my upcoming exams",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "senderType": "user"
  },
  "botMessage": {
    "id": "uuid", 
    "text": "I understand exam stress can feel overwhelming...",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "senderType": "bot"
  }
}
```

### GET /api/chatbot/chat
Get chat session history. Requires authentication.

**Query Parameters:**
- `sessionId` (optional) - Get specific session, otherwise get recent sessions

### DELETE /api/chatbot/chat
Clear chat history. Requires authentication.

**Query Parameters:**
- `sessionId` (optional) - Delete specific session, otherwise delete all

---

## 🤝 Peer Mentorship Endpoints

### POST /api/mentors/profile
Create or update mentor profile. Requires mentor or admin authentication.

**Request Body:**
```json
{
  "department": "Computer Science",
  "year": "Senior",
  "specialties": ["Anxiety", "Academic Stress", "Time Management"],
  "bio": "Experienced in helping students manage academic pressure..."
}
```

### GET /api/mentors
Get list of available mentors with filtering options.

**Query Parameters:**
- `department` (optional) - Filter by department
- `specialty` (optional) - Filter by specialty
- `available` (optional) - Filter by availability
- `page`, `limit` - Pagination

### GET /api/mentors/:mentorId
Get detailed mentor profile with connection status.

### POST /api/connections
Request a connection with a mentor. Student-only endpoint.

**Request Body:**
```json
{
  "mentorId": "uuid-of-mentor"
}
```

### GET /api/connections
Get user's connections (different view for students vs mentors).

**Query Parameters:**
- `status` (optional) - Filter by connection status

### PATCH /api/connections/:requestId
Accept or reject connection requests. Mentor-only endpoint.

**Request Body:**
```json
{
  "action": "accept" // or "reject"
}
```

---

## 📊 Admin Analytics & Crisis Management

### GET /api/admin/overview
Comprehensive dashboard metrics. Admin-only endpoint.

**Response includes:**
- Student and mentor counts
- Daily active users
- Average mood scores
- Crisis alert statistics
- Weekly trends

### GET /api/admin/heatmap
Campus stress level heatmap data. Admin-only endpoint.

**Query Parameters:**
- `days` (default: 7) - Number of days to analyze

**Response includes:**
- Location-based stress levels
- Trending stress areas
- Campus-wide statistics

### POST /api/crisis/alert
Create a crisis alert. Any authenticated user can create alerts.

**Request Body:**
```json
{
  "areaOfConcern": "Library Study Area",
  "description": "Observed distressed student, may need immediate assistance"
}
```

### GET /api/admin/crisis-alerts
Manage crisis alerts. Admin-only endpoint.

**Query Parameters:**
- `status` - Filter by 'active', 'resolved', or all

### PATCH /api/admin/crisis-alerts
Resolve or reopen crisis alerts. Admin-only endpoint.

**Request Body:**
```json
{
  "alertId": "uuid",
  "isResolved": true
}
```

### POST /api/campaigns
Create wellness campaigns. Admin-only endpoint.

**Request Body:**
```json
{
  "title": "Mental Health Awareness Week",
  "date": "2024-03-15T00:00:00Z",
  "department": "Campus-wide",
  "description": "Week-long series of wellness activities...",
  "status": "scheduled"
}
```

### GET /api/campaigns
Get campaigns with filtering. All authenticated users can view.

**Query Parameters:**
- `status` - Filter by campaign status
- `department` - Filter by department

### GET /api/resources
Get wellness resources categorized by type.

**Query Parameters:**
- `category` - Filter by resource category

---

## 🔧 Utility Endpoints

### GET /api/health
Health check endpoint to verify API and database status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "version": "1.0.0",
  "environment": "development"
}
```

---

## 🛠️ Development Commands

```bash
# Start development server (runs on port 3001)
npm run dev

# Build for production
npm run build

# Start production server  
npm start

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:push        # Push schema changes
npm run db:studio      # Open Prisma Studio

# Linting
npm run lint
```

---

## ⚡ Current Status

✅ **Phase 1: Authentication & User Management** - Complete
- User registration and login
- JWT-based authentication 
- Privacy settings management

✅ **Phase 2: Student & AI Services** - Complete
- Mood tracking with statistics
- AI chatbot with Google Gemini integration
- Chat session management

✅ **Phase 3: Peer Mentorship Platform** - Complete
- Mentor profile creation and management
- Student-mentor connection requests
- Connection approval/rejection system
- Real-time messaging with WebSocket support
- Privacy-aware mentor discovery

✅ **Phase 4: Admin Analytics & Crisis Management** - Complete
- Comprehensive admin dashboard with key metrics
- Campus-wide mood heatmap analysis
- Crisis alert system with real-time notifications
- Wellness campaign management
- Resource management system
- Priority-based alert handling

---

## 📝 Notes

- This backend is designed to work with the React frontend located in `../mental-pulse-scaffold-00`
- CORS is configured to allow requests from `http://localhost:5173` by default
- All passwords are hashed using bcrypt
- JWT tokens expire after 7 days by default
- AI responses use Google's Gemini Pro model for mental health support
- Database uses UUID primary keys for better security
- Privacy settings respect user anonymity preferences
