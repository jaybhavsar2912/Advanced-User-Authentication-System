# Authentication System

This is a full-stack authentication system with a React frontend and a Node.js/Express backend. It supports user registration, login, logout, session management, and role-based access (user/admin). The frontend uses Redux Toolkit for state management and Tailwind CSS for styling, while the backend uses MongoDB with Mongoose for data storage and JWT for authentication.

## Repository Structure
- **`frontend/`**: React-based frontend with user interface for authentication and session management.
- **`backend/`**: Node.js/Express backend with RESTful APIs for user and session operations.

## Features
- **User Authentication**: Register, login, and logout with email and password.
- **Session Management**: View and terminate active sessions with IP address tracking.
- **Role-Based Access**: Admin dashboard and user profile pages.
- **Toast Notifications**: User-friendly feedback using `react-toastify`.
- **Secure Backend**: JWT, bcrypt, and HTTP-only cookies for authentication.

## Getting Started
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/auth-system.git
   cd auth-system
   ```

2. **Set Up Frontend**:
   See [frontend/README.md](frontend/README.md) for setup instructions, including installing dependencies and setting `VITE_API_URL`.

3. **Set Up Backend**:
   See [backend/README.md](backend/README.md) for setup instructions, including MongoDB configuration and setting `MONGO_URI` and `JWT_SECRET`.

4. **Run the Application**:
   - Start the backend: `cd backend && npm start`
   - Start the frontend: `cd frontend && npm run dev`
   - Access the app at `http://localhost:3000`.

## Prerequisites
- **Node.js**: Version 16.x or higher.
- **npm**: Version 8.x or higher.
- **MongoDB**: Local or cloud instance (e.g., MongoDB Atlas).

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License
MIT License. See [LICENSE](LICENSE) for details.