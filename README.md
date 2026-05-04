
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

---

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

* Frontend → Vercel
* Backend → Railway

---

## 📝 Getting Started

### Prerequisites

* Node.js (v18+)
* MongoDB Atlas account



### 1️ Clone Repository

```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

---

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

* Connect GitHub repo
* Add environment variables
* Deploy

### Frontend (Vercel)

* Connect GitHub repo
* Add API URL
* Deploy

---

## 🔑 Environment Variables

### Backend

```env
MONGO_URI=
JWT_SECRET=
PORT=5000
```

### Frontend

```env
VITE_API_URL=https://your-backend-url/api
```



##  API Endpoints

### Auth

* POST `/api/auth/signup`
* POST `/api/auth/login`

### Projects

* POST `/api/projects`
* GET `/api/projects`

### Tasks

* POST `/api/tasks`
* GET `/api/tasks`
* PUT `/api/tasks/:id`

### Dashboard

* GET `/api/dashboard`




## Author

Nikhil Singh

