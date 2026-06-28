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
- 🛒 Marketplace for Free, Paid & **User-Sold Old Books**
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
- Notifications system  
- AI book recommendations  
- Subscription model for writers  
Mobile app (React Native)
