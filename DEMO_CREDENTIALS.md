# IMAP Solution - Demo Credentials

## 🔐 Login Credentials

### 👤 Patient Account
- **Email**: `patient@demo.com`
- **Password**: `password`
- **Role**: Patient
- **Features**: Book appointments, view medical history, manage profile

### 🏥 Hospital Admin Account  
- **Email**: `hospital@demo.com`
- **Password**: `password`
- **Role**: Hospital Administrator
- **Features**: Manage hospital data, view appointment requests, hospital dashboard

### ⚙️ Super Admin Account
- **Email**: `admin@imapsolution.com`
- **Password**: `password`
- **Role**: Super Administrator
- **Features**: System-wide management, user management, hospital approval

## 🚀 Quick Start

1. **Start Backend**: `cd App/backend && npm run dev`
2. **Start Frontend**: `cd App/frontend && npm start`
3. **Login**: Use any of the credentials above
4. **Test Features**: Explore dashboards and functionality

## 📊 Database Data

The seeded database includes:
- 3 demo users (one for each role)
- 3 hospitals with different specializations
- Multiple appointments with various statuses
- Patient profiles and medical history

## 🔧 Reset Database

To reset and reseed the database:
```bash
cd App/backend
npm run seed
```

This will clear existing data and create fresh demo data.

---
*All passwords are set to 'password' for demo purposes*