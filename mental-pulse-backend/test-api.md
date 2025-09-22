# Mental Pulse API Testing Guide

This guide provides curl commands to test all the implemented API endpoints.

## Prerequisites

1. Start the backend server: `npm run dev`
2. The API will be available at `http://localhost:3001`
3. You'll need to register users and get JWT tokens for authenticated endpoints

---

## 1. Health Check

```bash
curl -X GET http://localhost:3001/api/health
```

---

## 2. Authentication & User Management

### Register a Student
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "fullName": "John Student",
    "userType": "student",
    "anonymityLevel": 30
  }'
```

### Register a Mentor
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mentor@example.com",
    "password": "password123",
    "fullName": "Jane Mentor",
    "userType": "mentor",
    "anonymityLevel": 20
  }'
```

### Register an Admin
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "fullName": "Admin User",
    "userType": "admin",
    "anonymityLevel": 0
  }'
```

### Login (save the token for subsequent requests)
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

### Get User Profile
```bash
curl -X GET http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Privacy Settings
```bash
curl -X PATCH http://localhost:3001/api/users/me/privacy \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"anonymityLevel": 75}'
```

---

## 3. Mood Tracking

### Create Mood Entry
```bash
curl -X POST http://localhost:3001/api/check-ins \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "moodScore": 4,
    "notes": "Feeling good after morning exercise",
    "location": "Campus Gym"
  }'
```

### Get Mood Entries
```bash
curl -X GET "http://localhost:3001/api/check-ins?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

### Get Mood History
```bash
curl -X GET "http://localhost:3001/api/check-ins/history?days=30" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

---

## 4. AI Chatbot

### Send Message to Chatbot
```bash
curl -X POST http://localhost:3001/api/chatbot/chat \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am feeling stressed about my upcoming exams. Can you help me?"
  }'
```

### Get Chat Sessions
```bash
curl -X GET http://localhost:3001/api/chatbot/chat \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

### Clear Chat History
```bash
curl -X DELETE http://localhost:3001/api/chatbot/chat \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

---

## 5. Peer Mentorship

### Create Mentor Profile (as mentor)
```bash
curl -X POST http://localhost:3001/api/mentors/profile \
  -H "Authorization: Bearer YOUR_MENTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "department": "Computer Science",
    "year": "Senior",
    "specialties": ["Anxiety", "Academic Stress", "Time Management"],
    "bio": "Experienced in helping students manage academic pressure and develop healthy study habits."
  }'
```

### Get Available Mentors
```bash
curl -X GET "http://localhost:3001/api/mentors?department=Computer&page=1" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

### Get Specific Mentor Details
```bash
curl -X GET http://localhost:3001/api/mentors/MENTOR_ID_HERE \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

### Request Connection (as student)
```bash
curl -X POST http://localhost:3001/api/connections \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mentorId": "MENTOR_USER_ID_HERE"
  }'
```

### Get Connections
```bash
curl -X GET "http://localhost:3001/api/connections?status=pending" \
  -H "Authorization: Bearer YOUR_MENTOR_TOKEN"
```

### Accept Connection Request (as mentor)
```bash
curl -X PATCH http://localhost:3001/api/connections/CONNECTION_ID_HERE \
  -H "Authorization: Bearer YOUR_MENTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "accept"}'
```

---

## 6. Crisis Management

### Create Crisis Alert
```bash
curl -X POST http://localhost:3001/api/crisis/alert \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "areaOfConcern": "Library Study Area",
    "description": "Observed a student who appears to be in distress and may need assistance"
  }'
```

---

## 7. Admin Analytics & Management

### Get Admin Overview
```bash
curl -X GET http://localhost:3001/api/admin/overview \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get Campus Heatmap Data
```bash
curl -X GET "http://localhost:3001/api/admin/heatmap?days=7" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get Crisis Alerts (Admin)
```bash
curl -X GET "http://localhost:3001/api/admin/crisis-alerts?status=active" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Resolve Crisis Alert
```bash
curl -X PATCH http://localhost:3001/api/admin/crisis-alerts \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "alertId": "ALERT_ID_HERE",
    "isResolved": true
  }'
```

### Create Campaign
```bash
curl -X POST http://localhost:3001/api/campaigns \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mental Health Awareness Week",
    "date": "2024-03-15T00:00:00Z",
    "department": "Campus-wide",
    "description": "A week-long series of workshops and activities focused on mental health awareness",
    "status": "scheduled"
  }'
```

### Get Campaigns
```bash
curl -X GET "http://localhost:3001/api/campaigns?status=active" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Create Resource
```bash
curl -X POST http://localhost:3001/api/resources \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Campus Counseling Services",
    "description": "Professional counseling services available to all students",
    "url": "https://campus.edu/counseling",
    "category": "Professional Help",
    "isPublic": true
  }'
```

### Get Resources
```bash
curl -X GET "http://localhost:3001/api/resources?category=Professional" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

---

## WebSocket Testing

For real-time messaging between mentors and students, you can use a WebSocket client or the browser's WebSocket API:

```javascript
// Connect with JWT token
const socket = io('http://localhost:3001', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});

// Join a connection room
socket.emit('join-connection', 'CONNECTION_ID');

// Send a message
socket.emit('send-message', {
  connectionId: 'CONNECTION_ID',
  message: 'Hello, how can I help you today?'
});

// Listen for messages
socket.on('new-message', (data) => {
  console.log('New message:', data);
});

// Listen for notifications
socket.on('message-notification', (data) => {
  console.log('Message notification:', data);
});
```

---

## Testing Tips

1. **Save tokens**: After login, save the JWT tokens for different user types
2. **Test flows**: Try complete user journeys (register → login → create profile → connect)
3. **Test privacy**: Verify that high anonymity users show as "Anonymous"
4. **Test permissions**: Ensure admin-only endpoints reject non-admin users
5. **Test real-time**: Use multiple browser tabs to test WebSocket messaging

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": [] // Validation errors if applicable
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error