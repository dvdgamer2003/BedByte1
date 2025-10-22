# 🏥 GetBeds+ | Advanced Hospital Management Platform

**A premium, production-ready hospital management system with AI chatbot, emergency booking, doctor appointments, and real-time tracking.**

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)]() [![AI Powered](https://img.shields.io/badge/AI-Gemini-orange)]() [![Status](https://img.shields.io/badge/Status-Production%20Ready-success)]() [![License](https://img.shields.io/badge/License-MIT-blue)]()

---

## 🌟 Overview

GetBeds+ is a comprehensive hospital management platform that revolutionizes patient care through:

- 🤖 **AI Medical Chatbot** - Gemini AI-powered health assistant with 3 medicine types
- 🚨 **Emergency Fast Booking** - Priority-based emergency bed allocation  
- 👨‍⚕️ **Doctor Appointments** - Complete consultation booking system
- 💳 **Payment Integration** - Razorpay payment gateway
- 🏥 **Bed Management** - Real-time bed availability tracking
- 📋 **OPD Queue System** - Live queue monitoring with tokens
- 📍 **Location Services** - Find nearby hospitals with maps
- 👮 **Admin Dashboard** - Complete hospital & booking management
- ⚡ **Real-time Updates** - Socket.io for live data

---

## 📚 Documentation

For complete documentation, see **[docs/COMPLETE_DOCUMENTATION.md](docs/COMPLETE_DOCUMENTATION.md)**

Quick links:
- [AI Chatbot Guide](docs/AI_CHATBOT_DOCUMENTATION.md)
- [3D UI Features](docs/3D_CHATBOT_SUMMARY.md)
- [Ayurveda Feature](docs/AYURVEDA_FEATURE.md)
- [Contributing Guidelines](CONTRIBUTING.md)

---

## 🚀 Tech Stack

### Frontend
- React 18 + TypeScript + Vite
- TailwindCSS 3.4 + ShadCN UI
- Framer Motion (animations)
- Socket.io Client
- Lucide React (icons)

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Socket.io
- JWT + bcrypt
- Razorpay SDK
- Google Gemini AI (chatbot)

### Database
- MongoDB Atlas (cloud database)
- Mongoose ODM

### DevOps
- ESLint + Prettier
- TypeScript

---

## ✨ Key Features

### Phase 1 Complete ✅

#### 1. Emergency Booking System
- **Priority Levels**: Critical, High, Medium
- **9 Emergency Types**: Cardiac Arrest, Stroke, Trauma, etc.
- **Vital Signs Tracking**: BP, Heart Rate, Temperature, O2 Level
- **Immediate Bed Assignment**: Auto-allocation based on availability
- **Response Time Analytics**: Track emergency response metrics

#### 2. Doctor Appointments
- **8 Doctors Seeded**: Across 11 medical specializations
- **Availability Calendar**: Real-time slot booking
- **Time Slot Management**: Prevents double bookings
- **Appointment History**: Track consultations
- **Diagnosis & Prescriptions**: Complete patient records

#### 3. Payment Integration
- **Razorpay Gateway**: Test & production modes
- **Secure Verification**: Signature validation
- **Multiple Methods**: Card, UPI, Netbanking, Wallet
- **Refund Processing**: Automated refund handling
- **Transaction History**: Complete payment tracking

#### 4. Hospital & Bed Management
- **Real-time Availability**: Live bed status updates
- **Multiple Room Types**: General, ICU, Private
- **Booking Flow**: Provisional → Confirmed → Admitted
- **Admin Controls**: Mark beds occupied/free
- **Hospital CRUD**: Create, update, delete hospitals

#### 5. OPD Queue System
- **Token-based Queuing**: Automated token generation
- **Live Updates**: Real-time queue position
- **Wait Time Estimation**: Calculated wait times
- **Admin Controls**: Advance queue manually

#### 6. Admin Dashboard
- **All Bookings View**: Filter by status/hospital
- **Emergency Monitoring**: Track critical cases
- **Doctor Management**: CRUD operations
- **Statistics**: Revenue, occupancy, metrics

---

## 📊 Database Schema

### Collections (9 Total)

1. **users** - Patients, staff, admins
2. **hospitals** - Hospital details & facilities
3. **beds** - Bed inventory by room type
4. **bookings** - Regular bed bookings
5. **emergencybookings** - Priority emergency bookings
6. **doctors** - Doctor profiles & availability
7. **appointments** - Doctor consultations
8. **payments** - Razorpay transactions
9. **opdqueues** - OPD queue entries

---

## 🔌 API Endpoints (40+ Routes)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Hospitals
- `GET /api/hospitals` - List all hospitals
- `GET /api/hospitals/:id` - Hospital details
- `POST /api/hospitals` - Create hospital (admin)
- `PUT /api/hospitals/:id` - Update hospital (admin)
- `DELETE /api/hospitals/:id` - Delete hospital (admin)

### Beds
- `GET /api/beds/hospital/:id` - Get hospital beds
- `PUT /api/beds/:id` - Update bed status (admin)

### Bookings
- `POST /api/bookings/provisional` - Create booking
- `POST /api/bookings/:id/confirm` - Confirm booking
- `GET /api/bookings/my-bookings` - User bookings
- `POST /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/all` - All bookings (admin)

### Emergency Booking
- `POST /api/emergency-booking` - Emergency booking
- `GET /api/emergency-booking` - List emergencies (admin)
- `GET /api/emergency-booking/my` - My emergencies
- `PUT /api/emergency-booking/:id` - Update status
- `GET /api/emergency-booking/availability` - Check beds

### Doctors
- `GET /api/doctors` - List doctors
- `GET /api/doctors/:id` - Doctor profile
- `GET /api/doctors/availability` - Check slots
- `POST /api/doctors` - Create doctor (admin)
- `PUT /api/doctors/:id` - Update doctor (admin)

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/my` - My appointments
- `GET /api/appointments/:id` - Appointment details
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/stats/all` - Statistics (admin)

### Payments
- `POST /api/payments/order` - Create order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/my` - Payment history
- `POST /api/payments/:id/refund` - Request refund
- `GET /api/payments/all/list` - All payments (admin)

### OPD Queue
- `POST /api/opd/join` - Join queue
- `GET /api/opd/my-status` - My queue status
- `GET /api/opd/status/:hospitalId` - Queue status
- `POST /api/opd/advance/:hospitalId` - Advance queue

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd getbeds-clone

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Configure environment variables
# server/.env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret
CLIENT_URL=http://localhost:5173

# 4. Seed database
cd server
npm run seed
npm run seed-doctors

# 5. Start development servers

# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Access Application

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/health

### Demo Credentials

```
Email: admin@getbeds.com
Password: admin123
Role: Admin (full access)
```

### Test Payment (Razorpay Sandbox)

```
Card: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

---

## 📱 Application Routes

### Public Routes
- `/` - Home (Hospital listing)
- `/login` - Login page
- `/register` - Registration
- `/doctors` - Doctor listing
- `/doctors/:id` - Doctor profile
- `/hospital/:id` - Hospital details

### Protected Routes (User)
- `/emergency-booking` - Emergency booking
- `/my-appointments` - Appointments history
- `/my-bookings` - Booking history
- `/my-emergencies` - Emergency bookings
- `/opd-queue` - OPD queue

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/bookings` - All bookings
- `/admin/hospitals` - Hospital management

---

## 🎨 UI/UX Features

### Design System
- **Primary Colors**: Blue-600, Indigo-600
- **Fonts**: Inter, Plus Jakarta Sans
- **Components**: ShadCN UI library
- **Animations**: Framer Motion throughout
- **Icons**: Lucide React

### Responsive Design
- **Mobile**: Single column, touch-friendly
- **Tablet**: 2-column grids
- **Desktop**: 3-column layouts, hover effects

### Key UI Features
- Glass-morphism effects
- Gradient backgrounds
- Skeleton loaders
- Empty states
- Toast notifications
- Modal dialogs
- Status badges
- Progress indicators

---

## 📂 Project Structure

```
getbeds-clone/
├── server/
│   ├── src/
│   │   ├── models/          # Mongoose models
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # Express routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth, error handling
│   │   ├── config/          # Configuration
│   │   ├── sockets/         # Socket.io handlers
│   │   └── index.ts         # Entry point
│   ├── .env
│   └── package.json
├── client/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/      # Reusable components
│   │   │   └── ui/          # ShadCN UI components
│   │   ├── contexts/        # React contexts
│   │   ├── utils/           # Utilities
│   │   └── App.tsx
│   ├── .env
│   └── package.json
└── README.md
```

---

## 🔧 Development

### Scripts

**Server:**
```bash
npm run dev          # Start dev server
npm run build        # Build TypeScript
npm run seed         # Seed hospitals & beds
npm run seed-doctors # Seed doctors
```

**Client:**
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Environment Variables

**Server (.env):**
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

**Client (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚢 Deployment

### Backend (Render/Railway)

1. Connect GitHub repository
2. Set environment variables
3. Build Command: `cd server && npm install && npm run build`
4. Start Command: `cd server && npm start`

### Frontend (Vercel/Netlify)

1. Connect GitHub repository
2. Build Command: `cd client && npm install && npm run build`
3. Output Directory: `client/dist`
4. Set `VITE_API_URL` to backend URL

### Database
- Use MongoDB Atlas (recommended)
- Enable IP whitelist (0.0.0.0/0 for demo)
- Create database user

---

## 🧪 Testing

### Manual Testing Checklist

**Emergency Booking:**
- [ ] Select hospital
- [ ] Choose priority level
- [ ] Fill patient info
- [ ] Enter vital signs
- [ ] Submit booking
- [ ] Verify bed assigned

**Doctor Appointments:**
- [ ] Browse doctors
- [ ] Filter by specialization
- [ ] View doctor profile
- [ ] Check availability
- [ ] Book appointment
- [ ] Complete payment

**Admin Functions:**
- [ ] View all bookings
- [ ] Manage beds
- [ ] Create hospital
- [ ] Delete hospital
- [ ] Advance OPD queue

---

## 🔒 Security

- JWT authentication
- Password hashing (bcrypt)
- Role-based access control
- Input validation
- SQL injection prevention (Mongoose)
- XSS protection
- CORS configuration
- Rate limiting (recommended)
- HTTPS in production

---

## 📈 Performance

- Database indexing
- Efficient queries
- Socket.io for real-time
- Lazy loading
- Code splitting
- Image optimization
- Caching strategies

---

## 🐛 Troubleshooting

**Server won't start:**
- Check MongoDB connection
- Verify port 5000 is free
- Check .env configuration

**Frontend errors:**
- Clear node_modules and reinstall
- Check VITE_API_URL is correct
- Verify backend is running

**Payment fails:**
- Verify Razorpay keys
- Use test card numbers
- Check network tab for errors

---

## 📝 Future Enhancements (Phase 2)

### Planned Features
- 🤖 AI Prescription System
- 📧 Email Notifications
- 📱 Push Notifications
- 💬 In-app Chat
- 📊 Advanced Analytics
- 📄 PDF Reports
- 🔔 SMS Alerts
- 🌐 Multi-language Support

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Inspired by GetBeds (educational purposes only)
- ShadCN UI for component library
- Razorpay for payment gateway
- MongoDB Atlas for database

---

## 📞 Support & Contact

### Developer
**Divyesh A Ravane**

- 📧 Email: [divyeshravane21543@gmail.com](mailto:divyeshravane21543@gmail.com)
- 📍 Location: Near Gurumandir, Karanja Lad
- 💼 LinkedIn: [Divyesh Ravane](https://www.linkedin.com/in/divyesh-ravane-194753292/)
- 📸 Instagram: [@divyesh_06](https://www.instagram.com/divyesh_06/)
- 💻 GitHub: [@dvdgamer2003](https://github.com/dvdgamer2003)

### Project Support
- GitHub Issues
- Documentation
- Community discussions

---

## 📊 Project Stats

- **Backend**: 3,500+ lines of code
- **Frontend**: 6,000+ lines of code
- **API Endpoints**: 40+
- **Database Collections**: 9
- **Pages**: 15+
- **Components**: 50+
- **Status**: Production Ready ✅

---

**Built with ❤️ using MERN Stack**

**Version**: 2.0.0 (Phase 1 Complete)
