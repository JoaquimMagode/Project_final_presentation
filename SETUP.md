# IMAP Solution - Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- Git

## Quick Setup

### 1. Database Setup
Create a MySQL database:
```sql
CREATE DATABASE imap_solution_db;
```

### 2. Backend Setup
```bash
cd App/backend
npm install
npm run seed
npm run dev
```

### 3. Frontend Setup (in a new terminal)
```bash
cd App/frontend
npm install
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Demo Credentials

### Patient Login
- Email: `patient@demo.com`
- Password: `password`

### Hospital Admin Login
- Email: `hospital@demo.com`
- Password: `password`

### Super Admin Login
- Email: `admin@imapsolution.com`
- Password: `password`

## Features Implemented

### ✅ Authentication
- Real database authentication
- JWT token-based sessions
- Role-based access control
- Persistent login state

### ✅ Dashboard Data
- Patient appointments from database
- Hospital management data
- Real-time data fetching
- Error handling and loading states

### ✅ Database Integration
- MySQL database with proper schema
- Seeded demo data
- RESTful API endpoints
- Secure password hashing

## Troubleshooting

### Database Connection Issues
1. Ensure MySQL server is running
2. Check database credentials in `.env` file
3. Verify database `imap_solution_db` exists

### Port Conflicts
- Backend runs on port 5000
- Frontend runs on port 3000
- Change ports in respective config files if needed

### API Errors
- Check backend console for error messages
- Verify all environment variables are set
- Ensure database is seeded with demo data

## Next Steps

1. **Run the seed script** to populate database with demo data
2. **Start both backend and frontend servers**
3. **Login with demo credentials** to test functionality
4. **Explore the dashboard** to see real database integration

The login and dashboard now use real database data instead of mock data!