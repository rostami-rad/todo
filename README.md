# Trello Clone - Demo Board

A fully functional Trello-like Kanban board application built with Next.js, TypeScript, and SCSS.

## 🎯 Features

### Core Functionality

- **Board Management**
  - ✅ Pre-initialized "Demo Board" with default lists
  - ✅ Editable board title (double-click to edit)

- **List Management**
  - ✅ Create new lists with custom titles
  - ✅ Edit list titles (double-click to edit)
  - ✅ Delete lists (via options menu)
  - ✅ Horizontal drag & drop to reorder lists

- **Card Management**
  - ✅ Create cards within lists
  - ✅ Edit card titles (double-click to edit)
  - ✅ Vertical drag & drop within lists
  - ✅ Cross-list drag & drop to move cards between lists

- **Comments System**
  - ✅ View comments for each card
  - ✅ Add new comments with author and timestamp
  - ✅ Dedicated modal interface for comment management

- **Data Persistence**
  - ✅ All data saved to localStorage
  - ✅ Board state persists across page reloads

## 🛠️ Technologies Used

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: SCSS (with variables, mixins, and nesting)
- **Drag & Drop**: @dnd-kit/core and @dnd-kit/sortable
- **State Management**: React hooks (useState, useEffect, useContext pattern)
- **Data Persistence**: localStorage

## 📁 Project Structure

```
trello2/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global CSS (minimal)
├── components/
│   ├── Board.tsx           # Main board container
│   ├── List.tsx            # List component with drag & drop
│   ├── Card.tsx            # Card component with drag & drop
│   └── CommentsModal.tsx   # Comments modal component
├── hooks/
│   └── useBoard.ts         # Custom hook for board state management
├── services/
│   └── storage.service.ts  # localStorage service
├── styles/
│   ├── main.scss           # Main stylesheet
│   ├── variables.scss      # SCSS variables
│   └── mixins.scss         # SCSS mixins
└── types/
    └── index.ts            # TypeScript type definitions
```

## 🏗️ Architecture

### Design Principles

The project follows **SOLID principles**:

- **Single Responsibility**: Each component has one clear purpose
- **Open/Closed**: Components are extensible without modification
- **Liskov Substitution**: Components are substitutable
- **Interface Segregation**: Small, focused interfaces
- **Dependency Inversion**: Depend on abstractions (types/interfaces)

### Separation of Concerns

- **Components**: UI presentation only
- **Hooks**: Business logic and state management
- **Services**: Data persistence and external operations
- **Types**: Type definitions for type safety
- **Styles**: SCSS organized with partials

### Code Quality

- ✅ TypeScript for type safety
- ✅ Clean and readable code
- ✅ Meaningful naming conventions
- ✅ Proper error handling
- ✅ No code duplication (DRY principle)

## 🎨 Styling

### SCSS Structure

- **Variables**: Colors, spacing, border radius, shadows, transitions
- **Mixins**: Reusable style patterns (flex-center, card-style, button-style)
- **Nesting**: Logical component structure
- **Responsive**: Mobile-first approach with media queries

### Design Features

- Blue background matching Trello aesthetic
- White cards with rounded corners
- Smooth drag & drop animations
- Hover effects and transitions
- Responsive layout for mobile and desktop

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 Usage

1. **Edit Board Title**: Double-click the "Demo Board" title to edit
2. **Create List**: Click "+ Add another list" button
3. **Edit List Title**: Double-click any list title
4. **Delete List**: Click the "⋯" menu and select "Delete List"
5. **Move Lists**: Drag lists horizontally to reorder
6. **Create Card**: Click "+ Add another card" at the bottom of any list
7. **Edit Card**: Double-click any card title
8. **Move Cards**: Drag cards vertically within a list or to another list
9. **View/Add Comments**: Click "Comments (X)" button on any card

## 🔒 Type Safety

All components and functions are fully typed with TypeScript:
- Board, List, Card, and Comment interfaces
- Proper event typing (React.KeyboardEvent, React.MouseEvent)
- Strict TypeScript configuration enabled

## 💾 Data Persistence

All board data is automatically saved to localStorage:
- Board title and structure
- All lists and their order
- All cards and their positions
- All comments with timestamps

Data persists across browser sessions.

## 🎯 Project Requirements Met

✅ Next.js with App Router  
✅ TypeScript (Mandatory)  
✅ SCSS only for styling  
✅ Drag & Drop (Lists and Cards)  
✅ Comments Modal  
✅ localStorage Persistence  
✅ Responsive Design  
✅ Clean Code Architecture  
✅ SOLID Principles  
✅ Type Safety  
✅ Similar UI/UX to Reference  

## 📄 License

This project is created for demonstration purposes.
