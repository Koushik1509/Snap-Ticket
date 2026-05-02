# 🎬 Movie Booking System

A full-stack **Movie Ticket Booking System** that allows users to browse movies, view show timings, and book tickets online. The system also includes authentication and admin functionalities.

---

## 🚀 Features

- 🔐 User Registration & Login (JWT Authentication)
- 🎥 View Movies
- 🏢 Theater & Show Management
- 🎟️ Ticket Booking System
- 🛡️ Protected Routes using Middleware
- 👨‍💼 Admin Controls (Add Movies, Shows)

---

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB

**Authentication:**
- JWT (JSON Web Token)
- bcrypt

---

## 📁 Project Structure

```
FSD/
│── config/
│   └── db.js
│
│── models/
│   ├── User.js
│   ├── Movie.js
│   ├── Theater.js
│   ├── Show.js
│   └── Booking.js
│
│── controllers/
│   ├── authController.js
│   ├── movieController.js
│   ├── theaterController.js
│   ├── showController.js
│   └── bookingController.js
│
│── middleware/
│   └── authMiddleware.js
│
│── routes/
│   └── (API routes)
│
│── .env
│── server.js
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/movie-booking-system.git
cd movie-booking-system
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the server
```bash
npm start
```

Server will run at:
```
http://localhost:5000
```

---

## 🔐 Authentication Flow

1. User registers → password is hashed using bcrypt  
2. User logs in → JWT token is generated  
3. Token is sent in Authorization header  
4. Middleware verifies token for protected routes  

---

## 🔁 API Flow

- Register/Login user  
- Fetch movies  
- Create theaters and shows  
- Book tickets  
- Store booking details in database  

---

## 🧪 API Testing

Use tools like:
- Postman  

Example endpoints:
- `/api/auth/register`
- `/api/auth/login`
- `/api/movies`
- `/api/shows`
- `/api/bookings`

---

## 📌 Future Improvements

- 💳 Payment Gateway Integration  
- 📊 Real-time Seat Selection  
- 📧 Email Notifications  
- ⚡ Caching (Redis)  
- 🌐 Cloud Deployment  

---

## 👨‍💻 Contributors

- Member 1 – Frontend (UI)
- Member 2 – Frontend (API Integration)
- Member 3 – Backend (Authentication)
- Member 4 – Backend (Core Logic)
- Member 5 – Integration & Testing

---

## 📜 License

This project is for educational purposes.

---

## ⭐ Acknowledgment

This project helped in understanding:
- Full Stack Development  
- REST APIs  
- Authentication using JWT  
- Database Design  

---

⭐ If you like this project, give it a star!
