# 📋 Team Task Manager

A full-stack collaborative task management application with role-based access control, project management, and real-time task tracking — built with the MERN stack.



## 🚀 Features

✅ User Authentication (Signup/Login with JWT)
✅ Role-Based Access Control (Admin & Member)
✅ Project creation and team management
✅ Task creation, assignment, and tracking
✅ Dashboard with task statistics
✅ Protected routes and secure APIs
✅ Responsive UI with modern design



## Roles & Permissions

###  Admin

* Create projects
* Assign tasks to users
* View all tasks
* Monitor team progress

###  Member

* View assigned tasks
* Update task status
* Track personal progress



## Dashboard

* Total Tasks
* Completed Tasks
* Overdue Tasks
* Role-based data visibility


## Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcryptjs

### Deployment

* Frontend → Railway
* Backend → Railway



## 📝 Getting Started

### Prerequisites

* Node.js (v18+)
* MongoDB Atlas account



### 1️ Clone Repository

```bash
git clone https://github.com/nikhilnagarkoti/team-task-manager.git
cd team-task-manager
```



### 2️ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```bash
npm run dev
```



### 3️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```



## Deployment

### Backend (Railway)

* Connect GitHub repo to Railway
* Add environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`)
* Railway auto-detects Node.js and deploys

### Frontend (Railway)

* Connect GitHub repo to Railway
* Set root directory to `frontend`
* Add environment variable `VITE_API_URL`
* Railway builds and serves the Vite app



## 🔑 Environment Variables

### Backend

```env
MONGO_URI=
JWT_SECRET=
PORT=5000
```

### Frontend

```env
VITE_API_URL=https://your-backend-railway-url/api
```


## 📡 API Endpoints

### Auth

| Method | Endpoint            | Description       |
|--------|---------------------|-------------------|
| POST   | `/api/auth/signup`  | Register new user |
| POST   | `/api/auth/login`   | Login user        |

### Projects

| Method | Endpoint        | Description         |
|--------|-----------------|---------------------|
| POST   | `/api/projects` | Create a project    |
| GET    | `/api/projects` | Get all projects    |

### Tasks

| Method | Endpoint          | Description         |
|--------|-------------------|---------------------|
| POST   | `/api/tasks`      | Create a task       |
| GET    | `/api/tasks`      | Get all tasks       |
| PUT    | `/api/tasks/:id`  | Update a task       |

### Dashboard

| Method | Endpoint         | Description           |
|--------|------------------|-----------------------|
| GET    | `/api/dashboard` | Get dashboard stats   |



## 👨‍💻 Author

**Nikhil Singh**

* GitHub: [@nikhilnagarkoti](https://github.com/nikhilnagarkoti)


