# Todo Application

A full-stack todo application with authentication and task management capabilities.

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

## Author

**[Your Name]**  
GitHub: [muhammadui](https://github.com/muhammadui)

## Todo App Development Checklist

### **1. UI Interface**

- [✔] Create a task list with options to add, mark as completed, delete, and filter tasks (pending/completed).
- [✔] Use **EJS** as the templating engine.
- [✔] Style the interface with **TailwindCSS**.

### **2. Authentication**

- [✔] Implement **signup/login** with email and password.
- [✔] Ensure users only see their own tasks.
- [✔] Store passwords securely with **bcrypt**.

### **3. Database**

- [✔] Use **MongoDB** with **Mongoose**.
- [✔] Design tasks and users collections.
- [✔] Create an **ER diagram** to illustrate the relationship between users and tasks.

### **4. Testing**

- [ ] Write **unit** and **integration tests** for core functionality.

### **5. Error Handling**

- [✔] Implement global and local error handling with descriptive messages.

### **6. Logging**

- [✔] Set up structured logging with **Winston** to track actions and errors.

### **7. UI Design**

- [✔] Ensure a **simple**, **user-friendly**, and **responsive** design.

### **8. Hosting**

- [✔] Deploy the app on **Render**.
- [✔] Configure environment variables for secrets and database connections.

### **9. MongoDB Integration**

- [✔] Use **Mongoose** to interact with the MongoDB database.

This improved version maintains clarity, fixes errors, and provides a professional format for your project documentation.
