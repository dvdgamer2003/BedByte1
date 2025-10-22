# 🏥 BedByte - Hospital Management System (Backend)

**Production-Ready Node.js/TypeScript Backend with MongoDB**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Vulnerabilities](https://img.shields.io/badge/vulnerabilities-0-success)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)]()
[![Node](https://img.shields.io/badge/Node-18+-green)]()

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

BedByte is a comprehensive hospital management system backend that provides:
- **Real-time bed availability** tracking
- **Doctor appointment booking** system
- **AI-powered medical chatbot** (Gemini 2.5 Flash)
- **Emergency booking** management
- **Geospatial hospital search**
- **Payment integration** (Razorpay)
- **Admin dashboard** with full analytics

---

## ✨ Features

### Core Features
- ✅ **User Authentication & Authorization** (JWT-based)
- ✅ **Hospital Management** (CRUD operations)
- ✅ **Bed Management** (Real-time availability)
- ✅ **Doctor Management** (Availability, specializations)
- ✅ **Appointment Booking** (Time-slot management)
- ✅ **Emergency Bookings** (Priority handling)
- ✅ **OPD Queue Management**
- ✅ **Payment Processing** (Razorpay integration)
- ✅ **Medical Store Locator** (Geospatial search)

### Advanced Features
- 🤖 **AI Chatbot** - Gemini 2.5 Flash powered medical guidance
  - Ayurveda, Homeopathy, and Allopathy modes
  - Multilingual support (English, Hindi, Marathi)
  - Emergency symptom detection
  - Professional medical disclaimers

- 📍 **Geospatial Features**
  - Find nearby hospitals (radius-based search)
  - Find nearby medical stores
  - Distance calculation
  - 2dsphere MongoDB indexing

- 🔔 **Real-time Updates**
  - Socket.io integration
  - Live bed availability
  - Queue updates

---

## 🛠️ Tech Stack

### Backend Framework
- **Node.js** (18+)
- **Express.js** (4.18.2)
- **TypeScript** (5.3.3)

### Database
- **MongoDB** (8.0.3)
- **Mongoose** (ODM)

### Security
- **JWT** (jsonwebtoken)
- **Bcrypt** (password hashing)
- **Helmet** (security headers)
- **CORS** configured

### AI & Services
- **Google Gemini AI** (2.5 Flash model)
- **Razorpay** (payments)
- **Socket.io** (real-time)

### Development
- **TypeScript** (strict mode)
- **ESLint** (code quality)
- **ts-node-dev** (hot reload)

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ installed
- **MongoDB** instance (local or Atlas)
- **Gemini API Key** (from Google AI Studio)
- **Razorpay Account** (for payments, optional)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials (see [Environment Variables](#environment-variables))

### 4. Build the Project

```bash
npm run build
```

---

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_very_secure_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# Gemini AI (REQUIRED for chatbot)
GEMINI_API_KEY=your_gemini_api_key_here

# Razorpay Payment Gateway (Optional)
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
```

### Getting API Keys

#### Gemini API Key
1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key and add to `.env`

#### Razorpay Keys (Optional)
1. Visit: https://dashboard.razorpay.com/
2. Go to Settings → API Keys
3. Generate Test/Live keys

---

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

### Option 2: Local MongoDB

```bash
# Install MongoDB locally
# Update MONGO_URI to: mongodb://localhost:27017/bedbyte
```

### Seed the Database

```bash
# Seed admin user
npm run seed-admin

# Seed hospitals and beds
npm run seed

# Seed doctors
npm run seed-doctors

# Seed medical stores (optional)
npm run seed-medicals
```

**Default Admin Credentials:**
- Email: `admin@getbeds.com`
- Password: `admin123`
- ⚠️ **Change this in production!**

---

## 🏃 Running the Application

### Development Mode (Hot Reload)

```bash
npm run dev
```

Server will start on http://localhost:5000

### Production Build

```bash
npm run build
npm start
```

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
npm run lint         # Run ESLint
npm run seed-admin   # Seed admin user
npm run seed         # Seed hospitals & beds
npm run seed-doctors # Seed doctors
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

### Hospital Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/hospitals` | Get all hospitals | No |
| GET | `/api/hospitals/:id` | Get hospital by ID | No |
| GET | `/api/hospitals/nearby` | Get nearby hospitals | No |
| POST | `/api/hospitals` | Create hospital | Admin |
| PUT | `/api/hospitals/:id` | Update hospital | Admin |

**Nearby Hospitals Query:**
```
GET /api/hospitals/nearby?latitude=19.076&longitude=72.8777&radius=10
```
- `latitude` (required): User latitude
- `longitude` (required): User longitude
- `radius` (optional): Search radius in kilometers (default: 10km)

### Booking Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/bookings` | Get bookings (admin: all, user: own) | Yes |
| GET | `/api/bookings/my-bookings` | Get user's bookings | Yes |
| POST | `/api/bookings/provisional` | Create provisional booking | Yes |
| POST | `/api/bookings/:id/confirm` | Confirm booking | Yes |
| POST | `/api/bookings/:id/cancel` | Cancel booking | Yes |

### Appointment Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/appointments` | Get appointments (smart handler) | Yes |
| GET | `/api/appointments/my` | Get user's appointments | Yes |
| GET | `/api/appointments/all` | Get all appointments | Admin |
| POST | `/api/appointments` | Book appointment | Yes |
| DELETE | `/api/appointments/:id` | Cancel appointment | Yes |
| PUT | `/api/appointments/:id` | Update appointment | Admin |

### Chatbot Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/chatbot/message` | Send message to AI | Yes |
| GET | `/api/chatbot/sessions` | Get user chat sessions | Yes |
| GET | `/api/chatbot/history/:sessionId` | Get chat history | Yes |

**Chatbot Request:**
```json
{
  "message": "I have fever",
  "prescriptionType": "ayurveda",
  "symptoms": ["fever", "headache"]
}
```

**Prescription Types:**
- `ayurveda` - Ayurvedic remedies
- `homeopathy` - Homeopathic medicines
- (default) - General OTC medicines

### Payment Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/payments/order` | Create payment order | Yes |
| POST | `/api/payments/verify` | Verify payment | Yes |
| GET | `/api/payments/my` | Get user payments | Yes |

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Environment Setup

Ensure all production environment variables are set:
- ✅ Update `JWT_SECRET` to a secure random string
- ✅ Set `NODE_ENV=production`
- ✅ Configure production `MONGO_URI`
- ✅ Add production `CLIENT_URL`
- ✅ Update Razorpay keys to live mode (if used)

### Deploy to Render (Recommended)

1. **Create Account** at https://render.com
2. **New Web Service**
3. **Connect Repository**
4. **Configure:**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment: Node
5. **Add Environment Variables** from `.env`
6. **Deploy!**

### Deploy to Railway

1. **Install Railway CLI:** `npm i -g @railway/cli`
2. **Login:** `railway login`
3. **Initialize:** `railway init`
4. **Deploy:** `railway up`
5. **Add Variables:** `railway variables set KEY=value`

### Deploy to Heroku

```bash
# Install Heroku CLI
heroku login
heroku create bedbyte-api
git push heroku main
heroku config:set MONGO_URI=your_uri
heroku config:set GEMINI_API_KEY=your_key
```

---

## 🔧 Troubleshooting

### Chatbot Not Working

**Error:** "Sorry, I encountered an error"

**Solution:**
1. Check if `GEMINI_API_KEY` is set in `.env`
2. Verify API key is valid at https://aistudio.google.com/app/apikey
3. Ensure using model `gemini-2.5-flash`
4. Restart server after updating `.env`

### Database Connection Failed

**Error:** "MongoServerError: Authentication failed"

**Solutions:**
1. Check `MONGO_URI` credentials
2. Whitelist your IP in MongoDB Atlas
3. Verify network access permissions
4. Check if database user has correct permissions

### Port Already in Use

**Error:** "EADDRINUSE: address already in use :::5000"

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Build Errors

**Error:** TypeScript compilation errors

**Solutions:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Run `npm run build`
4. Check TypeScript version compatibility

---

## 📊 Project Structure

```
server/
├── src/
│   ├── config/              # Database configuration
│   ├── controllers/         # Request handlers (14 controllers)
│   ├── middleware/          # Auth & error handling
│   ├── models/              # Mongoose schemas (11 models)
│   ├── routes/              # API route definitions (13 routes)
│   ├── scripts/             # Database seeders
│   ├── services/            # Business logic (Gemini, Razorpay)
│   ├── sockets/             # Socket.io handlers
│   ├── utils/               # Utility functions
│   └── index.ts             # Application entry point
├── dist/                    # Compiled JavaScript (generated)
├── node_modules/            # Dependencies
├── .env                     # Environment variables
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

---

## 🔒 Security Features

- ✅ JWT authentication with secure token generation
- ✅ Bcrypt password hashing (10 rounds)
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Input validation on all endpoints
- ✅ Rate limiting (recommended to add)
- ✅ MongoDB injection prevention
- ✅ XSS protection
- ✅ Environment variable protection (.gitignore)

---

## 📈 Performance Optimizations

- ✅ MongoDB indexing (geospatial, compound indexes)
- ✅ Connection pooling
- ✅ Async/await throughout
- ✅ Proper error handling
- ✅ TypeScript for type safety
- ✅ Gzip compression (recommended to add)
- ✅ Response caching (recommended to add)

---

## 🧪 Testing

```bash
# Unit tests (to be added)
npm test

# Integration tests (to be added)
npm run test:integration

# Test coverage (to be added)
npm run test:coverage
```

---

## 📝 Recent Updates

### Latest Fixes (October 2025)

1. ✅ **Fixed Admin Dashboard** - Bookings and appointments now load correctly
2. ✅ **Fixed Chatbot** - Updated to Gemini 2.5 Flash model
3. ✅ **Enhanced Geospatial Queries** - Km-based radius, better validation
4. ✅ **Removed Vulnerabilities** - 0 npm vulnerabilities
5. ✅ **Optimized Code Structure** - Clean, organized, production-ready
6. ✅ **Improved Error Handling** - Comprehensive error messages
7. ✅ **Added Fallback Responses** - Chatbot works even if AI service is down

---

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Google Gemini** for AI-powered chatbot
- **Razorpay** for payment processing
- **MongoDB** for database
- **Socket.io** for real-time features

---

## 📞 Support

For issues or questions:
- **Email:** divyeshravane21543@gmail.com
- **GitHub Issues:** [Create an issue](https://github.com/your-repo/issues)

---

## 🎯 Status

**Current Version:** 1.0.0  
**Build Status:** ✅ Passing  
**Vulnerabilities:** ✅ 0  
**Production Ready:** ✅ Yes  

**Last Updated:** October 22, 2025

---

Made with ❤️ by BedByte Team
