# Ascendo Backend

A Trello-like kanban board management API built with Express.js, TypeScript, and MongoDB.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Database Schema](#database-schema)
- [Features](#features)

---

## Project Overview

Ascendo Backend is a RESTful API that manages kanban boards with the following entities:
- **Users**: Team members who can be assigned to boards and cards
- **Boards**: Kanban boards with privacy settings (PUBLIC/PRIVATE) and member management
- **Lists**: Columns within boards that organize cards
- **Cards**: Individual tasks within lists that can be assigned to users

---

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Port**: 4000 (default)

---

## Installation

### Prerequisites
- Node.js (v20.9.0 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Steps

1. Clone the repository:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend folder (see [Environment Variables](#environment-variables))

4. Build TypeScript:
```bash
npm run build
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
MONGODB_URI=mongodb+srv://monsoon:mongopwd@cluster0.z3j0b.mongodb.net/ascendo?retryWrites=true&w=majority

# Server
PORT=4000
```

### Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://monsoon:mongopwd@cluster0.z3j0b.mongodb.net/ascendo?retryWrites=true&w=majority` (Atlas) or `mongodb://localhost:27017/ascendo` (Local) |
| `PORT` | Server port | `4000` |

**Note**: The `.env` file is typically excluded from version control (see `.gitignore`), but for this assignment, it has been provided with the connection URI for MongoDB Atlas.

---

## Running the Server

### Development
```bash
npm run dev
```
The server will start on `http://localhost:4000` (Local) or `https://ascendo-assignment.onrender.com` (Cloud)

### Production Build
```bash
npm run build
npm start
```

### Health Check

**Local:**
```bash
GET http://localhost:4000/health
```

**Cloud:**
```bash
GET https://ascendo-assignment.onrender.com/health
```

Response:
```json
{
  "success": true,
  "message": "Server health is ok"
}
```

---

## API Endpoints

### Base URL

**Local Development:**
```
http://localhost:4000/api
```

**Cloud/Production:**
```
https://ascendo-assignment.onrender.com/api
```

**For this assignment:** 
- Local development uses `http://localhost:4000` with all API endpoints prefixed with `/api`
- Cloud deployment uses `https://ascendo-assignment.onrender.com/api`
- Ensure your frontend `.env` file points to the correct URL (NEXT_PUBLIC_API_URL)

---

## Users Endpoints

### Create User
```
POST /users
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "6789abcdef123456",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-07-02T10:00:00Z",
    "updatedAt": "2026-07-02T10:00:00Z"
  }
}
```

**Error Cases:**
- `500`: User with this email already exists
- `500`: Invalid name or email format

---

### Get All Users
```
GET /users
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6789abcdef123456",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-07-02T10:00:00Z",
      "updatedAt": "2026-07-02T10:00:00Z"
    }
  ]
}
```

---

### Get User by ID
```
GET /users/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "6789abcdef123456",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-07-02T10:00:00Z",
    "updatedAt": "2026-07-02T10:00:00Z"
  }
}
```

**Error Cases:**
- `404`: User not found
- `500`: Invalid user ID format

---

### Update User
```
PUT /users/:id
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "6789abcdef123456",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2026-07-02T10:00:00Z",
    "updatedAt": "2026-07-02T10:30:00Z"
  }
}
```

**Error Cases:**
- `404`: User not found
- `500`: Invalid user ID format or validation error

---

### Delete User
```
DELETE /users/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Note:** Deleting a user will:
- Remove the user from all boards' member lists
- Unassign the user from all cards (set to null)
- Delete the user document

**Error Cases:**
- `404`: User not found
- `500`: Invalid user ID format

---

## Boards Endpoints

### Create Board
```
POST /boards
```

**Request Body:**
```json
{
  "name": "Q3 Planning",
  "privacy": "PUBLIC",
  "members": ["6789abcdef123456", "6789abcdef123457"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Board created successfully",
  "data": {
    "_id": "5678abcdef123456",
    "name": "Q3 Planning",
    "privacy": "PUBLIC",
    "members": [
      {
        "_id": "6789abcdef123456",
        "name": "John Doe",
        "email": "john@example.com"
      }
    ],
    "createdAt": "2026-07-02T10:00:00Z",
    "updatedAt": "2026-07-02T10:00:00Z"
  }
}
```

**Error Cases:**
- `500`: Invalid member ID format
- `500`: One or more members do not exist

---

### Get All Boards
```
GET /boards
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "5678abcdef123456",
      "name": "Q3 Planning",
      "privacy": "PUBLIC",
      "members": [...],
      "createdAt": "2026-07-02T10:00:00Z",
      "updatedAt": "2026-07-02T10:00:00Z"
    }
  ]
}
```

---

### Get Board by ID
```
GET /boards/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "5678abcdef123456",
    "name": "Q3 Planning",
    "privacy": "PUBLIC",
    "members": [...],
    "createdAt": "2026-07-02T10:00:00Z",
    "updatedAt": "2026-07-02T10:00:00Z"
  }
}
```

**Error Cases:**
- `404`: Board not found
- `500`: Invalid board ID format

---

### Update Board
```
PUT /boards/:id
```

**Request Body:**
```json
{
  "name": "Q4 Planning",
  "privacy": "PRIVATE",
  "members": ["6789abcdef123456"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "5678abcdef123456",
    "name": "Q4 Planning",
    "privacy": "PRIVATE",
    "members": [...],
    "createdAt": "2026-07-02T10:00:00Z",
    "updatedAt": "2026-07-02T11:00:00Z"
  }
}
```

**Error Cases:**
- `404`: Board not found
- `500`: Invalid board/member ID format

---

### Delete Board
```
DELETE /boards/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Board deleted successfully"
}
```

**Note:** Deleting a board will cascade delete all associated lists and cards.

**Error Cases:**
- `404`: Board not found
- `500`: Invalid board ID format

---

### Get Board's Lists
```
GET /boards/:boardId/lists
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "4567abcdef123456",
      "title": "To Do",
      "boardId": "5678abcdef123456",
      "createdAt": "2026-07-02T10:00:00Z",
      "updatedAt": "2026-07-02T10:00:00Z"
    }
  ]
}
```

---

## Lists Endpoints

### Create List
```
POST /lists
```

**Request Body:**
```json
{
  "title": "To Do",
  "boardId": "5678abcdef123456"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "List created successfully",
  "data": {
    "_id": "4567abcdef123456",
    "title": "To Do",
    "boardId": "5678abcdef123456",
    "createdAt": "2026-07-02T10:00:00Z",
    "updatedAt": "2026-07-02T10:00:00Z"
  }
}
```

---

### Get All Lists
```
GET /lists
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [...]
}
```

---

### Get List by ID
```
GET /lists/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "4567abcdef123456",
    "title": "To Do",
    "boardId": "5678abcdef123456",
    "createdAt": "2026-07-02T10:00:00Z",
    "updatedAt": "2026-07-02T10:00:00Z"
  }
}
```

---

### Update List
```
PUT /lists/:id
```

**Request Body:**
```json
{
  "title": "In Progress"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "4567abcdef123456",
    "title": "In Progress",
    "boardId": "5678abcdef123456",
    "createdAt": "2026-07-02T10:00:00Z",
    "updatedAt": "2026-07-02T11:00:00Z"
  }
}
```

---

### Delete List
```
DELETE /lists/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "List deleted successfully"
}
```

**Note:** Deleting a list will cascade delete all cards in that list.

---

## Cards Endpoints

### Create Card
```
POST /cards
```

**Request Body:**
```json
{
  "name": "Implement user authentication",
  "description": "Add JWT-based authentication to the API",
  "listId": "4567abcdef123456",
  "boardId": "5678abcdef123456"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Card created successfully.",
  "data": {
    "_id": "3456abcdef123456",
    "name": "Implement user authentication",
    "description": "Add JWT-based authentication to the API",
    "listId": "4567abcdef123456",
    "boardId": "5678abcdef123456",
    "assignedUserId": null,
    "createdAt": "2026-07-02T10:00:00Z",
    "updatedAt": "2026-07-02T10:00:00Z"
  }
}
```

---

### Get All Cards
```
GET /cards
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [...]
}
```

---

### Get Card by ID
```
GET /cards/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "3456abcdef123456",
    "name": "Implement user authentication",
    "description": "Add JWT-based authentication to the API",
    "listId": "4567abcdef123456",
    "boardId": "5678abcdef123456",
    "assignedUserId": "6789abcdef123456",
    "createdAt": "2026-07-02T10:00:00Z",
    "updatedAt": "2026-07-02T10:00:00Z"
  }
}
```

---

### Update Card
```
PUT /cards/:id
```

**Request Body:**
```json
{
  "name": "Add JWT authentication",
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {...}
}
```

---

### Assign User to Card
```
PUT /cards/:id/assign
```

**Request Body:**
```json
{
  "userId": "6789abcdef123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User assigned successfully.",
  "data": {
    "_id": "3456abcdef123456",
    "name": "Implement user authentication",
    "description": "Add JWT-based authentication to the API",
    "listId": "4567abcdef123456",
    "boardId": "5678abcdef123456",
    "assignedUserId": {
      "_id": "6789abcdef123456",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2026-07-02T10:00:00Z",
    "updatedAt": "2026-07-02T10:30:00Z"
  }
}
}
```

**Note:** Pass `null` as `userId` to unassign a user.

---

### Move Card
```
PATCH /cards/:id/move
```

**Request Body:**
```json
{
  "listId": "4567abcdef123457"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Card moved successfully.",
  "data": {
    "_id": "3456abcdef123456",
    "name": "Implement user authentication",
    "description": "Add JWT-based authentication to the API",
    "listId": "4567abcdef123457",
    "boardId": "5678abcdef123456",
    "assignedUserId": "6789abcdef123456",
    "createdAt": "2026-07-02T10:00:00Z",
    "updatedAt": "2026-07-02T10:45:00Z"
  }
}
```

**Note:** The destination list must belong to the same board as the current card's board.

**Error Cases:**
- `404`: Card not found
- `404`: List not found
- `400`: Card is already in this list
- `400`: Destination list belongs to a different board
- `500`: Invalid card ID or list ID format

---

### Delete Card
```
DELETE /cards/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Card deleted successfully."
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK - Request successful |
| `201` | Created - Resource created successfully |
| `400` | Bad Request - Invalid input |
| `404` | Not Found - Resource doesn't exist |
| `500` | Internal Server Error - Server error |

### Common Error Messages

- `"User with this email already exists"` - Duplicate email
- `"User not found"` - User ID doesn't exist
- `"Board not found"` - Board ID doesn't exist
- `"Invalid board id."` - Invalid ObjectId format
- `"One or more members do not exist."` - Member ID doesn't point to valid user
- `"List not found"` - List ID doesn't exist
- `"Card not found"` - Card ID doesn't exist

---

## Database Schema

### User
```typescript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  createdAt: Date,
  updatedAt: Date
}
```

### Board
```typescript
{
  _id: ObjectId,
  name: String (required),
  privacy: String ("PUBLIC" | "PRIVATE", default: "PUBLIC"),
  members: [ObjectId (ref: User)],
  createdAt: Date,
  updatedAt: Date
}
```

### List
```typescript
{
  _id: ObjectId,
  title: String (required),
  boardId: ObjectId (ref: Board, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Card
```typescript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  listId: ObjectId (ref: List, required),
  boardId: ObjectId (ref: Board, required),
  assignedUserId: ObjectId (ref: User, nullable),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Features

### ✅ Core Features
- User management (CRUD)
- Board management with privacy settings
- Member assignment to boards
- List management within boards
- Card management within lists
- User assignment to cards
- Cascade deletion (deleting a board deletes all lists and cards)
- Cascade user deletion (removes user from boards and unassigns from cards)

### 🔒 Data Integrity
- Transaction-based deletions using MongoDB sessions
- Proper error handling and validation
- Reference population for nested data

### 📊 API Response Format
- Consistent JSON response structure
- Populated references (e.g., board members show full user objects)
- Timestamps for all entities

---

## Folder Structure

```
backend/
├── src/
│   ├── models/          # MongoDB schemas
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── routes/          # API routes
│   ├── middlewares/      # Express middlewares
│   ├── config/          # Configuration files
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── package.json
├── tsconfig.json
└── README.md
```

---

## Support

For issues or questions, please refer to the project documentation or contact the development team.
