# 📍 Natours API

Natours is a RESTful backend application for a tour booking platform.  
It is built using **Node.js, Express, and MongoDB**, and follows REST API best practices with **JWT-based authentication**.

This README is based on the Postman API documentation you shared.

---

## 🧠 Overview

The Natours API provides endpoints to:

- Manage users and authentication
- Create, read, update, and delete tours
- Add and manage reviews for tours
- Secure routes using JWT authorization

---

## 🚀 Features

- 🔐 User signup and login
- 👤 User profile management
- 🗺️ Tour management (CRUD)
- ⭐ Tour reviews
- 🔒 Role-based and token-based authorization
- 🌍 Geo-spatial queries (tours within a radius)

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **API Testing:** Postman

---

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB (Local or Atlas)

### Steps

```bash
# Clone the repository
git clone <your-repository-url>

# Navigate to the project folder
cd natours

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
⚙️ Environment Variables
Create a .env file in the root directory and add:

PORT=3000
DATABASE=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=90d
📍 Base URL
http://localhost:3000/api/v1
🔐 Authentication
Protected routes require a Bearer Token.

Add the token to request headers:

Authorization: Bearer <JWT_TOKEN>
You receive the token after logging in or signing up.

📘 API Endpoints
🧑 Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /users/signup | Register a new user |
| POST | /users/login | Login user |
| GET | /users/me | Get logged-in user details |
| PATCH | /users/updateMe | Update user profile |
| DELETE | /users/deleteMe | Deactivate user account |
🗺️ Tours
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tours | Get all tours |
| GET | /tours/:id | Get a single tour |
| POST | /tours | Create a tour |
| PATCH | /tours/:id | Update a tour |
| DELETE | /tours/:id | Delete a tour |
| GET | /tours/tours-within/:distance/center/:latlng/unit/:unit | Get tours within radius |
⭐ Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tours/:tourId/reviews | Get reviews for a tour |
| POST | /tours/:tourId/reviews | Create a review |
| PATCH | /reviews/:id | Update a review |
| DELETE | /reviews/:id | Delete a review |
🧪 Testing with Postman
Import the Postman collection from the provided documentation link.

Set the base URL as an environment variable.

Authenticate using /users/login.

Use the returned JWT token for protected routes.

🗂️ Project Structure
natours/
│
├── controllers/
├── models/
├── routes/
├── utils/
├── app.js
├── server.js
├── .env
└── package.json
⚠️ Error Handling
Uses global error handling middleware

Returns proper HTTP status codes

Provides meaningful error messages

📜 License
This project is licensed under the MIT License.

👨‍💻 Author
Maheshwaran G
Backend Developer | Node.js | MongoDB | REST APIs

📌 Note
This API serves as the backend for the Natours application and is documented using Postman for easy testing and collaboration.
```
