# Joisy Dashboard

A lightweight, client-only React dashboard for creating assignments and tracking student submissions. Supports two roles (admin and student) and persists data locally via MySql. Built with Create React App.

## Project Setup Instructions

### Prerequisites
- Node.js (v14 or higher recommended)
- npm (comes with Node.js) or yarn

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd joisy-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The application will open automatically at `http://localhost:3000` in your default browser.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

This creates a `build` folder with optimized static files ready for deployment.

### Available Scripts

- `npm start` - Starts the development server (runs on port 3000 by default)
- `npm run build` - Creates a production build in the `build` folder
- `npm test` - Runs tests (Create React App test harness)
- `npm run eject` - Ejects from Create React App (one-way operation, not recommended)

### Environment Setup

**No environment variables or backend setup required.** This is a fully client-side application that stores all data in the browser's `localStorage`.

To reset the application state, simply clear your browser's local storage or open the application in an incognito/private window.

---

## Folder Structure Overview

```
Joisy/
└── joisy-dashboard/              # Main application directory
    ├── build/                    # Production build output (generated)
    ├── node_modules/             # Dependencies (installed via npm)
    ├── public/                   # Static assets
    │   ├── favicon.ico
    │   ├── index.html           # HTML template
    │   └── manifest.json        # PWA manifest
    ├── src/                      # Source code
    │   ├── components/          # Reusable React components
    │   │   ├── AdminAssignmentRow.js    # Admin view: assignment progress & student toggles
    │   │   ├── AssignmentCard.js        # Student view: assignment card with confirm button
    │   │   ├── AssignmentForm.js        # Admin: form to create new assignments
    │   │   └── ProgressBar.js           # Visual progress indicator component
    │   ├── data/                # Seed data and initial state
    │   │   └── sampleData.js    # Sample users and assignments
    │   ├── utils/               # Utility functions
    │   │   └── localStorage.js # localStorage read/write helpers
    │   ├── App.js              # Main application component
    │   ├── App.css             # App-specific styles
    │   ├── index.js            # Application entry point
    │   ├── index.css           # Global styles
    │   ├── styles.css          # Custom CSS with design tokens
    │   ├── service-worker.js   # PWA service worker (disabled)
    │   └── serviceWorkerRegistration.js  # Service worker registration logic
    ├── package.json            # Project dependencies and scripts
    ├── package-lock.json       # Locked dependency versions
    ├── postcss.config.js       # PostCSS configuration
    └── README.md              # This file
```

### Key Directories

- **`src/components/`** - All React components organized by feature/functionality
- **`src/data/`** - Seed data used for initial application state
- **`src/utils/`** - Shared utility functions and helpers
- **`public/`** - Static files served directly (not processed by webpack)
- **`build/`** - Generated production build (git-ignored, created via `npm run build`)

---

## Component Structure and Design Decisions

### Architecture Overview

The application follows a **component-based architecture** with a single root component (`App.js`) managing global state and child components handling presentation and user interactions. State management is handled through React hooks (`useState`, `useEffect`) with data persistence via browser `localStorage`.

### Component Hierarchy

```
App (Root)
├── Header (user selector)
├── Main Content
│   ├── Student View
│   │   └── AssignmentCard[] (displays student's assignments)
│   └── Admin View
│       └── AdminAssignmentRow[] (displays admin's created assignments)
└── Sidebar
    ├── User Info Card
    ├── AssignmentForm (admin only)
    └── ProgressBar (student only)
```

### Core Components

#### 1. **App.js** (Root Component)
- **Purpose**: Main application container and state manager
- **Key Responsibilities**:
  - Manages global state (users, assignments, current user, confirmation state)
  - Handles data persistence via `localStorage`
  - Derives filtered views (studentAssignments, adminAssignments) based on current user role
  - Implements core business logic (createAssignment, toggleSubmission, handleStudentConfirmClick)
- **Design Decisions**:
  - Uses functional components with hooks (modern React patterns)
  - Lazy initialization of state from `localStorage` with fallback to seed data
  - Automatic persistence via `useEffect` when assignments change
  - Role-based view rendering (conditional rendering based on `currentUser.role`)

#### 2. **AssignmentForm.js**
- **Purpose**: Admin interface for creating new assignments
- **Key Features**:
  - Form fields: title, due date, optional Drive link
  - Multi-select checkboxes for student assignment
  - Form validation (title and due date required)
  - Resets form after successful submission
- **Design Decisions**:
  - Controlled components (all inputs tied to React state)
  - Local form state managed internally
  - Parent callback pattern (`onCreate`) for data flow
  - Simple alert-based validation (could be enhanced with better UX)

#### 3. **AssignmentCard.js**
- **Purpose**: Student-facing assignment display card
- **Key Features**:
  - Displays assignment details (title, due date, Drive link)
  - Shows submission status
  - Two-step confirmation flow with pending state
- **Design Decisions**:
  - Presentational component (receives data and callbacks as props)
  - Conditional rendering for student-specific actions (`isStudentView` prop)
  - Visual feedback for confirmation state (button styling changes)
  - External link handling for Drive links

#### 4. **AdminAssignmentRow.js**
- **Purpose**: Admin view of individual assignment with progress tracking
- **Key Features**:
  - Progress bar showing submission completion percentage
  - Per-student submission status grid
  - Toggle buttons to override student submission state
- **Design Decisions**:
  - Combines assignment metadata with progress visualization
  - Grid layout for student list (scalable for many students)
  - Admin override functionality (can mark submissions on behalf of students)
  - Calculates progress percentage from submissions object

#### 5. **ProgressBar.js**
- **Purpose**: Reusable visual progress indicator
- **Key Features**:
  - Accepts percentage value (0-100)
  - Clamps values to valid range
  - Accessible styling with semantic HTML structure
- **Design Decisions**:
  - Simple, reusable component (used in both student and admin views)
  - Value clamping prevents invalid percentages
  - Minimal props interface (just `value`)
  - Inline style for dynamic width (React pattern)

### Utility Functions

#### **localStorage.js**
- **Purpose**: Safe wrapper around browser `localStorage` API
- **Functions**:
  - `readLS(key, fallback)`: Safely reads and parses JSON from localStorage with error handling
  - `writeLS(key, val)`: Safely writes JSON to localStorage with error handling
- **Design Decisions**:
  - Try-catch error handling prevents crashes from corrupted data
  - Fallback values ensure app always has initial data
  - Silent error handling (graceful degradation)

### Data Flow

1. **Initialization**: App loads users and assignments from `localStorage`, falling back to `sampleData.js` if not found
2. **State Updates**: User interactions trigger state updates in `App.js`
3. **Persistence**: Changes to assignments automatically save to `localStorage` via `useEffect`
4. **View Derivation**: Filtered assignment lists (`studentAssignments`, `adminAssignments`) computed from global state based on current user role
5. **Prop Drilling**: Data and callbacks passed down to child components as props

### Design Patterns Used

- **Controlled Components**: All form inputs are controlled by React state
- **Lifting State Up**: Global state managed in root component, passed down as props
- **Callback Props**: Child components communicate with parent via callback functions
- **Conditional Rendering**: Role-based UI using ternary operators and logical AND
- **Derived State**: Computed values (filtered lists, percentages) derived from primary state
- **Local State**: Component-specific UI state (form inputs, pending confirmations) managed locally

### Styling Approach

- **Custom CSS**: Plain CSS with design tokens and utility-like classes
- **No CSS-in-JS**: Traditional stylesheet approach for simplicity
- **Responsive Layout**: Two-column grid (main + sidebar) adapts to screen size
- **Class-based Styling**: Semantic class names (`.card`, `.btn-primary`, `.muted`) for consistency

### State Management Strategy

- **React Hooks**: `useState` for state, `useEffect` for side effects
- **No External State Library**: Pure React solution for simplicity
- **localStorage Sync**: Automatic persistence on state changes
- **Optimistic Updates**: UI updates immediately, persistence happens asynchronously

### Key Limitations and Trade-offs

- **No Global State Management**: Prop drilling used instead of Context/Redux (acceptable for small app)
- **Client-Side Only**: No backend means no multi-device sync or true authentication
- **Basic Validation**: Simple alert-based validation (could use form libraries)
- **No Error Boundaries**: Errors could crash entire app (could add error boundaries for production)
- **Service Worker Disabled**: No offline support currently (can be enabled)

---

## Features

### Admin Features
- Create assignments with title, due date, and optional Drive link
- Assign assignments to one or more students
- View progress percentage per assignment
- View per-student submission status
- Toggle student submission state (admin override)

### Student Features
- View all assignments assigned to the logged-in student
- See submission status for each assignment
- Two-step confirmation flow for submissions (prevents accidental clicks)
- View overall completion progress in sidebar
- Access Drive links for assignment resources

### General Features
- Role-based user interface (UI changes based on logged-in user)
- User switching via dropdown selector
- Responsive two-column layout (main content + sidebar)
- Data persistence across page refreshes
- Sample data included for immediate testing

---

## Tech Stack

- **React 19** - UI library
- **Database** - MySQL
- **Create React App** - Build tooling and development server
- **React Scripts 5.0.1** - Build configuration
- **CSS** - Custom styling (no CSS frameworks)
- **localStorage API** - Client-side data persistence
- **PostCSS** - CSS processing (configured but minimal usage)

---

## Data Model

### User Object
```json
{
  "id": "string",
  "name": "string",
  "role": "admin" | "student"
}
```

### Assignment Object
```json
{
  "id": "string",
  "title": "string",
  "dueDate": "YYYY-MM-DD",
  "driveLink": "string | null",
  "creatorId": "userId",
  "assignedTo": ["studentId", "..."],
  "submissions": {
    "studentId": true | false
  }
}
```

### localStorage Keys
- `joineazy_users_v1` - Stored user data
- `joineazy_assignments_v1` - Stored assignment data

---

## Limitations and Future Enhancements

### Current Limitations
- No authentication system (demo only)
- No backend or API (all data local to browser)
- Basic form validation
- No timezone handling for dates
- No audit trail for admin actions
- Service worker disabled (no offline support)

### Potential Enhancements
- Add backend API (REST/GraphQL) with real authentication
- Replace localStorage with API calls + optimistic updates
- Implement file upload functionality
- Add sorting, filtering, and search capabilities
- Enable service worker for offline functionality
- Add notifications/email alerts
- Implement proper error boundaries
- Add comprehensive test coverage
- Set up CI/CD pipeline



