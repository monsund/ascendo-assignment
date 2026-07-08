# Ascendo - Kanban Board Management Application

A full-stack Trello-like kanban board management application built with Next.js, Express.js, and MongoDB.

## 🌐 Live Demo

- **Frontend**: https://ascendo-assignment.vercel.app/boards (Vercel)
- **Backend API**: https://ascendo-assignment.onrender.com/api (Render)

## 📚 Documentation

- **[Backend Documentation](./backend/README.md)** - Express API, MongoDB schemas, and all endpoints
- **[Frontend Documentation](./frontend/README.md)** - Next.js app, components, and setup guide

## � Features

### Core Features
- **Boards Management**: Create, edit, delete boards with PUBLIC/PRIVATE privacy settings
- **Team Collaboration**: Add members to boards for team collaboration
- **Lists Organization**: Create and manage lists (columns) within boards
- **Card Management**: Create, edit, delete cards with descriptions
- **Card Reordering**: Drag-and-drop cards to reorder within lists
- **Card Movement**: Move cards between lists within the same board
- **User Assignment**: Assign team members to specific cards
- **Users Management**: Create, edit, delete team members
- **Responsive Design**: Works seamlessly on desktop and tablet devices

### UI Features
- Clean Material-UI design system
- Real-time data loading with progress indicators
- Confirmation dialogs for destructive actions
- Error handling and validation
- Light mode with readable typography

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`
The backend API will be available at `http://localhost:4000/api`

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Material-UI, React Hooks
- **Backend**: Express.js, TypeScript, MongoDB, Mongoose
- **Runtime**: Node.js v20.9.0+
- **Deployment**: Vercel (Frontend), Render (Backend)
