# IMAP Solution

A comprehensive medical tourism platform connecting patients directly with top hospitals in India.

## Demo Credentials

After setting up the database, use these credentials to test the application:

- **Patient**: `patient@demo.com` / `password`
- **Hospital Admin**: `hospital@demo.com` / `password`
- **Super Admin**: `admin@imapsolution.com` / `password`

## Quick Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- Git

### Backend Setup
```bash
cd App/backend
npm install
npm run create-db
npm run seed
npm run dev
```

### Frontend Setup (in new terminal)
```bash
cd App/frontend
npm install
npm start
```

### Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features

### ✅ Real Database Integration
- MySQL database with proper schema
- JWT-based authentication
- Role-based access control
- Seeded demo data

### ✅ User Roles
- **Patients**: Book appointments, view medical history
- **Hospital Admins**: Manage hospital data, view requests
- **Super Admins**: System-wide management

### ✅ Dashboard Features
- Real-time data from database
- Appointment management
- Hospital information
- Patient profiles
- Medical history tracking

## Troubleshooting

### Connection Refused Error
If you see `net::ERR_CONNECTION_REFUSED`:
1. Ensure backend server is running (`npm run dev`)
2. Check MySQL server is running
3. Verify database exists and is seeded
4. Check port 5000 is not blocked

### Database Issues
1. Create database: `npm run create-db`
2. Seed data: `npm run seed`
3. Check MySQL credentials in `.env` file

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT tokens
- **API**: RESTful architecture