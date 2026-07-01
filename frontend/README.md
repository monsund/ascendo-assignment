# Ascendo Frontend

A Trello-like kanban board management interface built with Next.js, TypeScript, React, and Material-UI.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Features](#features)
- [Pages](#pages)

---

## Project Overview

Ascendo Frontend is a modern web application that provides a user-friendly interface for managing kanban boards with teams. Users can create boards, organize tasks into lists, manage cards, and collaborate with team members.

---

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Library**: Material-UI v5
- **HTTP Client**: Axios
- **Styling**: MUI sx prop system
- **Port**: 3000 (default)

---

## Installation

### Prerequisites
- Node.js (v20.9.0 or higher)
- npm or yarn
- Backend API running on `http://localhost:4000` (Local) or `https://ascendo-assignment.onrender.com` (Cloud)

### Setup Steps

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (see [Environment Variables](#environment-variables))

---

## Environment Variables

Create a `.env.local` file in the `frontend/` directory:

**For Local Development:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**For Cloud/Production:**
```env
NEXT_PUBLIC_API_URL=https://ascendo-assignment.onrender.com/api
```

### Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (must start with `NEXT_PUBLIC_` to be accessible in browser) | `http://localhost:4000/api` (Local) or `https://ascendo-assignment.onrender.com/api` (Cloud) |

**Notes:** 
- The `NEXT_PUBLIC_` prefix makes this variable accessible in the browser. Never include sensitive data (like API keys) in public environment variables.
- The `.env` file is typically excluded from version control, but for this assignment it has been provided for convenience.

---

## Running the Application

### Development
```bash
npm run dev
```
The application will start on `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

### Build Only
```bash
npm run build
```

---

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── boards/             # Boards page
│   │   │   ├── page.tsx        # Boards list
│   │   │   └── [id]/           # Board details
│   │   │       └── page.tsx    # Dynamic board page
│   │   └── users/              # Users management
│   │       └── page.tsx        # Users list
│   ├── components/             # Reusable components
│   │   ├── Header.tsx          # Main header with navigation
│   │   ├── BoardCard.tsx       # Board card display
│   │   └── CardItem.tsx        # Card display in list
│   ├── dialogs/                # Modal dialogs
│   │   ├── CreateBoardDialog.tsx
│   │   ├── EditBoardDialog.tsx
│   │   ├── CreateListDialog.tsx
│   │   ├── EditListDialog.tsx
│   │   ├── CreateCardDialog.tsx
│   │   ├── EditCardDialog.tsx
│   │   ├── CreateUserDialog.tsx
│   │   ├── EditUserDialog.tsx
│   │   └── AssignUserDialog.tsx
│   ├── services/               # API service functions
│   │   ├── api.ts              # Axios configuration
│   │   ├── boardApi.ts         # Board API calls
│   │   ├── listApi.ts          # List API calls
│   │   ├── cardApi.ts          # Card API calls
│   │   └── userApi.ts          # User API calls
│   ├── types/                  # TypeScript type definitions
│   │   ├── board.ts
│   │   ├── list.ts
│   │   ├── card.ts
│   │   └── user.ts
│   └── globals.css             # Global styles
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## Features

### ✅ Core Features
- **Boards Management**: Create, edit, delete boards with PUBLIC/PRIVATE privacy settings
- **Team Collaboration**: Add members to boards for team collaboration
- **Lists Organization**: Create and manage lists (columns) within boards
- **Card Management**: Create, edit, delete cards with descriptions
- **User Assignment**: Assign team members to specific cards
- **Users Management**: Create, edit, delete team members
- **Responsive Design**: Works seamlessly on desktop and tablet devices

### 🎨 UI Features
- Clean Material-UI design system
- Navigation tabs (Boards, Users)
- Confirmation dialogs for destructive actions
- Loading states and error handling
- Truncated text with hover tooltips for long content
- Light mode with readable typography

---

## Pages

### Home Page (`/`)
- Automatically redirects to `/boards` page
- Clicking "Ascendo" logo navigates to "/" which then redirects to boards

### Boards Page (`/boards`)
- View all boards in a grid layout
- Create new board with member selection
- Edit board details and manage members
- Delete boards with confirmation
- Click board to view details

**Empty State**: "No boards found. Create one to get started!"

### Board Details Page (`/boards/[id]`)
- View board name, privacy, and member count
- Manage lists within the board
- View cards organized by lists
- Add/edit/delete lists
- Create/edit/delete cards
- Assign users to cards
- Light background with dark text for readability

### Users Page (`/users`)
- View all users in a table format
- Columns: Name, Email, Created At, Actions
- Create new user with email validation
- Edit user details
- Delete user with confirmation
- Shows error messages on failure

---

## API Integration

The frontend communicates with the backend API at the URL specified in `NEXT_PUBLIC_API_URL`.

### Service Layer Pattern

All API calls are organized in `/src/services/`:
- `boardApi.ts` - Board CRUD operations
- `listApi.ts` - List CRUD operations
- `cardApi.ts` - Card CRUD operations
- `userApi.ts` - User CRUD operations

Example usage:
```typescript
import { getBoards, createBoard } from "@/services/boardApi";

const boards = await getBoards();
const newBoard = await createBoard("Q3 Planning", "PUBLIC");
```

---

## Type Safety

All data structures are strongly typed in `/src/types/`:
- `Board` - Includes members as User objects or string IDs
- `List` - Includes boardId reference
- `Card` - Includes listId and optional assignedUser
- `User` - User profile information

---

## Component Architecture

### Custom Dialogs
- All dialogs follow a consistent pattern
- Accept `open`, `onClose`, `onSuccess` props
- Validate input before submission
- Show loading states during API calls
- Handle and display errors

### Services Pattern
- All API calls go through service layer
- Error handling at service level
- Automatic response parsing

### State Management
- React hooks (useState, useEffect, useCallback)
- Proper dependency arrays to prevent infinite loops
- Optimized re-renders with useCallback for event handlers

---

## Error Handling

- API errors display in dialogs or inline
- Loading spinners during async operations
- Proper error messages for user feedback
- Graceful fallbacks for missing data

---

## Performance Optimizations

- ✅ Truncated card titles and descriptions with hover tooltips
- ✅ useCallback for event handlers to prevent unnecessary re-renders
- ✅ Conditional rendering for empty states
- ✅ Material-UI optimizations built-in

---

## Development Guidelines

### Adding New Features
1. Create types in `/src/types/` if needed
2. Create API functions in `/src/services/`
3. Create components in `/src/components/`
4. Create dialogs in `/src/dialogs/` for user interactions
5. Create pages in `/src/app/` for routes

### Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use Material-UI for consistent styling
- Follow existing naming conventions

---

## Troubleshooting

### API Connection Issues
- Ensure backend is running on configured URL
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS is properly configured in backend
- Check browser console for detailed errors

### Build Issues
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

---

## Support

For issues or questions, please refer to the project documentation or contact the development team.
