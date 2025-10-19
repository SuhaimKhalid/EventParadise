# EventParadise

EventParadise is a modern, full-featured event management platform built as a React-based frontend application. It allows users to discover, create, manage, and attend events seamlessly. The platform supports two primary user roles: **Staff** (event organizers) and **Members** (attendees), with robust authentication, payment integration, and calendar functionality.

**Backend Repository**: [EventParadise-Backend](https://github.com/SuhaimKhalid/EventParadise-Backend)

## 🚀 Features

### Core Functionality

- **User Authentication**: Secure login and registration for Staff and Member users using JWT tokens and Supabase integration.
- **Event Management**: Create, edit, view, and delete events with detailed information including title, description, dates, location, pricing, and images.
- **Event Discovery**: Browse and search for events on the main events page with filtering and pagination.
- **Attendee Management**: Staff users can view and manage event attendees.
- **Payment Integration**: Secure payment processing for paid events with success confirmation pages.
- **Calendar Integration**: Add events to personal calendars (Google Calendar or .ics download).
- **Responsive Design**: Mobile-friendly interface using Bootstrap and Tailwind CSS.

### User Roles

- **Staff Users**: Can create and manage their own events, view attendees, and access staff-specific dashboards.
- **Member Users**: Can browse events, join events, view their joined events, and manage their accounts.

### Additional Features

- **Image Uploads**: Support for event poster images.
- **Movie API Integration**: Auto-fill event details by searching movies from The Movie Database (TMDb) API.
- **Real-time Updates**: Context-based state management for user sessions.
- **Error Handling**: Comprehensive error handling and loading states.
- **SEO-Friendly**: Optimized routing and meta tags for better discoverability.

## 🛠 Tech Stack

### Frontend

- **React 19**: Modern React with hooks and functional components.
- **TypeScript**: Type-safe development for better code quality.
- **Vite**: Fast build tool and development server.
- **React Router DOM**: Client-side routing for single-page application.
- **Bootstrap 5**: Responsive UI components.
- **Tailwind CSS**: Utility-first CSS framework for custom styling.
- **Axios**: HTTP client for API requests.

### Authentication & Backend Integration

- **Supabase**: Authentication helpers for React.
- **JWT**: Token-based authentication.

### Development Tools

- **ESLint**: Code linting and formatting.
- **PostCSS**: CSS processing with Autoprefixer.
- **Vite Plugins**: React plugin with SWC for fast refresh.
- **TypeScript ESLint**: Type-aware linting rules.

### APIs

- **Custom Backend API**: Hosted on Render (https://eventparadise.onrender.com/api/).
- **The Movie Database (TMDb) API**: For movie search and auto-fill event details (https://api.themoviedb.org/3).
- **Google Calendar API**: For calendar integration.

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd EventParadise
   ```

2. **Install Dependencies**

   ```bash
   cd frontend
   npm install
   ```

3. **Environment Configuration**

   - The backend API URL is hardcoded in `api.ts` as `https://eventparadise.onrender.com/api/`.

4. **Start Development Server**

   ```bash
   npm run dev
   ```

   - Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

## 📖 Usage

### For Users

1. **Register/Login**: Choose between Staff or Member role during registration.
2. **Browse Events**: Visit the Events page to discover upcoming events.
3. **View Event Details**: Click on any event to see full details, pricing, and join options.
4. **Join Events**: Members can join free or paid events.
5. **Create Events (Staff Only)**: Use the movie search feature to auto-fill event details from The Movie Database API, then customize location, dates, and pricing.
6. **Manage Account**: Access personal dashboards to view joined events or created events (for Staff).

### For Developers

- **Component Structure**: Modular components in `src/Components/` for reusability.
- **Routing**: All routes defined in `App.tsx` with protected routes based on user roles.
- **State Management**: Global state handled via React Context in `AppProvider.tsx`.
- **API Integration**: Centralized API calls in `src/Components/Api's/api.ts`.

## 🏗 Project Structure

```
EventParadise/
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Api's/          # API functions and types
│   │   │   │   ├── api.ts       # Main API definitions
│   │   │   │   └── movieApi.ts  # Additional API (possibly for external services)
│   │   │   ├── Pages/           # Page components
│   │   │   │   ├── Main Pages/  # Public pages (Home, Events, etc.)
│   │   │   │   ├── Staff User Pages/  # Staff-specific pages
│   │   │   │   └── Member User Pages/ # Member-specific pages
│   │   │   ├── Stlying/         # CSS files for components
│   │   │   └── Utilities/       # Reusable utilities and providers
│   │   ├── assets/              # Images and icons
│   │   ├── App.tsx              # Main app component with routing
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── package.json             # Dependencies and scripts
│   ├── vite.config.ts           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   └── tsconfig.json            # TypeScript config
├── .gitignore                   # Git ignore rules
├── LICENSE                      # Project license
└── README.md                    # This file
```

## 🔌 API Overview

The frontend integrates with a custom backend API hosted on Render. Key endpoints include:

- **Events**: `GET /api/events`, `POST /api/events`, `GET /api/events/:id`
- **Authentication**: `POST /api/auth/register`, `POST /api/auth/login`
- **Users**: `GET /api/users/:id/events`, `GET /api/users/:id/created-events`
- **Payments**: `GET /api/users/:id/payments`

Refer to `src/Components/Api's/api.ts` for detailed API function definitions and TypeScript interfaces.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request.

### Development Guidelines

- Follow TypeScript best practices.
- Use ESLint for code quality.
- Write descriptive commit messages.
- Test components thoroughly before submitting PRs.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or issues, please open an issue on the GitHub repository or contact the development team.

---

**EventParadise** - Bringing events to life, one click at a time! 🎉
