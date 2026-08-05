# 📚 BookVerse

> A Full-Stack Book Publishing, Reading & Marketplace Platform built with Spring Boot, React, MongoDB, JWT Authentication, and Razorpay.

BookVerse is a modern platform where readers can discover books, writers can publish and monetize their work, and users can also buy and sell old books through a marketplace system. It supports secure authentication, role-based access control, digital publishing, creative writing, and integrated payments for premium content.

---

## 🌐 Live Demo

🔗 Live Project: https://book-verse-wine-one.vercel.app

---

## 🚀 Key Highlights

- 🔐 Secure Authentication (JWT + Google OAuth)
- 👤 Role-Based Access (Reader, Writer, Admin)
- 📖 Book Publishing Platform
- ✍️ Poems & Thoughts System (Public / Private)
- 🛒 Marketplace for Free, Paid & User-Sold Old Books
- 💳 Razorpay Payment Integration
- 📊 Writer Analytics Dashboard
- ⭐ Reviews & Ratings System
- 📚 Personal Library System

---

## ✨ Features

### 👤 Authentication & Security
- JWT Authentication
- Google OAuth Login
- Refresh Token Support
- Role-Based Access Control
- Password Reset Functionality

---

### 📖 Reader Features
- Browse books by category
- Search, filter, and sort books
- Read free books
- Purchase premium books
- Buy second-hand / user-listed old books
- Personal library management
- Reading progress tracking
- User profile management

---

### ✍️ Writer Features
- Become a writer instantly
- Create and publish books
- Add multiple chapters
- Edit and delete books
- Publish free or paid books
- Write poems and thoughts
- Save content as public or private
- Writer dashboard analytics
- Track views, followers, revenue

---

### 🛒 Marketplace
- Free & Paid books system
- **Users can list and sell old books**
- Secure Razorpay payment integration
- Purchase history tracking
- Premium content unlocking system
- Second-hand book trading support

---

### ⭐ Community Features
- Book reviews & ratings
- Writer profiles
- Public writing feed
- Poems & thoughts sharing
- Engagement system (views & followers)

---

### 🛠 Admin Features
- Admin dashboard
- User management system
- Book approval workflow (PENDING → APPROVED)
- Review moderation
- Marketplace control
- Ban / unban users
-  Notifications system 

---

## 📊 Writer Dashboard

- 📚 Total books published  
- 👥 Followers count  
- 👀 Book views analytics  
- 💰 Revenue tracking  
- 📦 Books sold  
- 📝 Pending approvals  
- 📈 Latest releases  

---

## 🏗 Tech Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- Axios
- Vite
- Lucide Icons

### Backend
- Java
- Spring Boot
- Spring Security
- MongoDB
- JWT Authentication
- REST APIs

### Payments
- Razorpay Payment Gateway

### Authentication
- JWT
- Google OAuth
- Refresh Tokens

### Deployment
- Frontend: Vercel  
- Backend: Render  
- Database: MongoDB Atlas  

---

## 📁 Project Structure

```
BookVerse
│
├── frontend
│ ├── components
│ ├── pages
│ ├── hooks
│ ├── context
│ ├── services
│ └── assets
│
├── backend
│ ├── auth
│ ├── book
│ ├── writer
│ ├── admin
│ ├── security
│ ├── review
│ ├── marketplace
│ └── user


---

## 🚀 Getting Started

### Clone Repository
```bash
git clone https://github.com/yourusername/bookverse.git
cd bookverse

Backend Setup
cd backend
./mvnw spring-boot:run

Frontend Setup
cd frontend
npm install
npm run dev

```

## 🔐 User Roles

### 👤 Reader
- Read books  
- Purchase premium books  
- Buy old books from marketplace  
- Access personal library  
- Write reviews and ratings  

---

### ✍️ Writer
- Publish books  
- Upload chapters  
- Create poems & thoughts  
- Manage public/private writings  
- View analytics dashboard  

---

### 🛡 Admin
- Manage users  
- Approve or reject books  
- Moderate content  
- Control marketplace  

---

## 🌟 Future Improvements 
- AI book recommendations  
- Subscription model for writers  
Mobile app (React Native)

---

## Docker Setup

This project can run with Docker Compose using two containers:

- `bookverse-backend` - Spring Boot API on port `8080`
- `bookverse-frontend` - React production build served by Nginx on port `80`

MongoDB is not started by Docker Compose. The backend continues to use MongoDB Atlas through `MONGODB_URI`.

### Prerequisites

- Docker Desktop installed and running
- A MongoDB Atlas connection string
- Google OAuth credentials
- Razorpay credentials
- Gmail app password or SMTP-compatible mail credentials

### Environment Variables

Create the backend `.env` file from the example:

```bash
cp .env.example backend/.env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example backend/.env
```

Then fill in the backend values:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.example.mongodb.net/bookverse?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
MAIL_USERNAME=your-gmail-address@gmail.com
MAIL_PASSWORD=your-gmail-app-password
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
RAZORPAY_KEY=your-razorpay-key
RAZORPAY_SECRET=your-razorpay-secret
CORS_ALLOWED_ORIGINS=http://localhost,http://localhost:80
JAVA_OPTS=-XX:MaxRAMPercentage=75.0
```

Create or update the frontend `.env` file:

```env
VITE_API_URL=/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_RAZORPAY_KEY=your-razorpay-key
```

The frontend container reads `frontend/.env` at runtime and writes those values into `/env.js`. This is needed because Vite normally embeds `VITE_*` values at build time. The Nginx container proxies `/api` requests to the backend service at `http://backend:8080`.

### Build And Run

From the project root:

```bash
docker compose up --build
```

Open the app:

- Frontend: `http://localhost`
- Backend API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Backend health: `http://localhost:8080/actuator/health`

### Stop

```bash
docker compose down
```

### Rebuild

Use this after Dockerfile, dependency, or environment changes:

```bash
docker compose up --build
```

To rebuild from a clean image cache:

```bash
docker compose build --no-cache
docker compose up
```

### Health Checks

Both services include Docker health checks:

- Backend checks `http://localhost:8080/actuator/health`
- Frontend checks `http://localhost/health`

The frontend waits for the backend to become healthy before starting.

### Troubleshooting

- If the backend fails to start, check that `backend/.env` exists and `MONGODB_URI` points to MongoDB Atlas.
- If login or protected APIs fail, confirm `JWT_SECRET` is set and the backend container restarted after changing it.
- If Google login fails with `invalid_client`, verify `VITE_GOOGLE_CLIENT_ID` exists in `frontend/.env` and matches your Google OAuth web client.
- If email notifications fail, use a Gmail app password for `MAIL_PASSWORD`.
- If Razorpay checkout opens but purchase recording fails, check browser console logs and backend logs.
- If port `80` or `8080` is already in use, stop the other service or change the host port mapping in `docker-compose.yml`.

View container logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```
