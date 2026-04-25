# Course Recommendation System

A full-stack web application for course management and personalized recommendations. Built with React, Express, MongoDB, and JWT authentication.

## Features

### For Students
- Browse and search courses by title, category, or tags
- View detailed course information
- Add courses to favorites
- Get personalized course recommendations based on favorites
- User authentication and profile management

### For Admins
- Create, update, and delete courses
- Manage course categories and tags
- Admin dashboard for course management
- Full CRUD operations on courses

## Tech Stack

### Frontend
- **React 19** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── .env             # Environment variables
│   └── server.js        # Entry point
│
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── assets/      # Images and icons
│   │   ├── components/  # React components
│   │   ├── context/     # Context providers
│   │   ├── pages/       # Page components
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── vite.config.js   # Vite configuration
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd course-recommendation-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB=Course_recommendation
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The API will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The app will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Users
- `GET /api/users/profile` - Get user profile (Protected)
- `GET /api/users/favorites` - Get user's favorite courses (Protected)
- `POST /api/users/favorites/:courseId` - Add course to favorites (Protected)
- `DELETE /api/users/favorites/:courseId` - Remove course from favorites (Protected)

### Courses
- `GET /api/courses` - Get all courses (with search/filter)
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create a course (Admin only)
- `PUT /api/courses/:id` - Update a course (Admin only)
- `DELETE /api/courses/:id` - Delete a course (Admin only)
- `GET /api/courses/recommendations` - Get personalized recommendations (Protected)

## User Roles

- **Student**: Can browse courses, add favorites, and get recommendations
- **Admin**: Has all student permissions plus course management capabilities

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are generated upon login/registration
- Protected routes require a valid token in the Authorization header
- Token format: `Bearer <token>`

## Development

### Backend Scripts
```bash
npm start          # Start the server
npm run dev        # Start with nodemon (auto-reload)
```

### Frontend Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Security Notes

⚠️ **Important**: The `.env` file contains sensitive credentials. In production:
- Never commit `.env` files to version control
- Use environment-specific configurations
- Rotate secrets regularly
- Use strong JWT secrets

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For questions or support, please open an issue in the repository.
