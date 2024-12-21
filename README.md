# Todo Application

A full-stack todo application with authentication and task management capabilities.

## Live Demo

<a href="https://r2da.onrender.com/" target="_blank" rel="noopener noreferrer">Live Demo ↗</a>

### Demo Login

- **Email**: `demo@todo.app`
- **Password**: `Password@2doApp`
  _Or feel free to sign up with your own credentials_

## Features

- User Authentication (Signup/Login/Logout)
- Todo CRUD Operations (Create, Read, Update, Delete)
- Input Validation
- Error Handling
- Email Notifications
- Session Management
- Responsive UI Design

## Tech Stack

- **Backend**: Node.js & Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: EJS Templating with TailwindCSS
- **Testing**: Jest & Supertest
- **Logging**: Winston Logger

## Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

## Installation

```bash
# Clone the repository
git clone https://github.com/muhammadui/todo-app.git

# Navigate to the project directory
cd todo-app

# Install dependencies
npm install
```

## Environment Setup

Create a `.env` file in the root directory and add the following environment variables:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todo-app
MONGODB_TEST_URI=mongodb://localhost:27017/todo-app-test
SESSION_SECRET=your_session_secret
RESEND_API_KEY=your_resend_api_key
```

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## API Routes

### **Authentication**

- **POST /signup**: Create a new user.
- **POST /login**: User login.
- **GET /logout**: User logout.

### **Todos**

- **GET /todos**: Retrieve all todos.
- **POST /todos**: Create a new todo.
- **PUT /todos/:id**: Update an existing todo.
- **DELETE /todos/:id**: Delete a todo.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to your branch.
5. Open a pull request.

## License

This project is licensed under the MIT License.
