# IMAP Solution - Medical Tourism Platform

A comprehensive medical tourism platform connecting international patients directly with top hospitals in India. Eliminates intermediaries for transparent communication, accurate information, and reduced processing time.

## Key Features

### ✅ Direct Patient-to-Hospital Appointments
- **No Doctor Intermediaries**: Patients book appointments directly with hospitals
- **Hospital-Focused**: Streamlined process connecting patients to hospital services
- **Comprehensive Care**: Access to full hospital facilities and specialist teams
- **Transparent Process**: Direct communication with hospital administration

### ✅ Complete Appointment Management
- **Current Appointments**: View and manage pending/confirmed appointments
- **Appointment History**: Complete history across all hospitals visited
- **Multiple Appointment Types**: Consultation, Procedure, Follow-up, Telemedicine
- **Real-time Status Updates**: Track appointment progress from booking to completion

### ✅ Hospital Discovery
- **Advanced Search**: Find hospitals by city and medical specialization
- **Detailed Profiles**: Hospital information, specialties, and contact details
- **Direct Booking**: Book appointments directly from hospital profiles
- **Verified Hospitals**: Only accredited and verified Indian hospitals

### ✅ User Management
- **Patient Profiles**: Complete medical history and personal information
- **Hospital Administration**: Manage hospital data and appointment requests
- **Super Admin**: System-wide management and oversight
- **Role-based Access**: Secure access control for different user types

### ✅ Medical Tourism Support
- **International Focus**: Designed for patients seeking treatment in India
- **Comprehensive Information**: Hospital details, specializations, and facilities
- **Treatment Planning**: Support for complex medical procedures and treatments
- **Communication Tools**: Direct contact with hospital representatives

## Demo Credentials

After setting up the database, use these credentials to test the application:

- **Patient**: `patient@demo.com` / `password`
- **Hospital Admin**: `hospital@demo.com` / `password`
- **Super Admin**: `admin@imapsolution.com` / `password`

## Sample Data

The seeded database includes:
- **5 Top Indian Hospitals**: Apollo Mumbai, Fortis Delhi, Max Healthcare, Manipal Bangalore, Medanta
- **Sample Appointment History**: 6 appointments across different hospitals and time periods
- **Multiple Appointment Types**: Consultation, Procedure, Follow-up, Telemedicine
- **Various Specializations**: Cardiology, Neurosurgery, Orthopedics, Eye Surgery, Dental, etc.

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

## Patient Features

### Hospital Search & Discovery
- Search hospitals by city (Mumbai, Delhi, Bangalore, etc.)
- Filter by medical procedures and specializations
- View detailed hospital profiles with contact information
- Direct appointment booking from hospital listings

### Appointment Management
- **Current Appointments Tab**: View pending and confirmed appointments
- **Appointment History Tab**: Complete history of all hospital visits
- **Appointment Details**: Date, time, hospital, reason, status, and fees
- **Status Tracking**: Pending → Confirmed → Completed workflow
- **Appointment Actions**: View details, edit pending appointments, cancel if needed

### Medical Tourism Support
- International patient-focused interface
- Comprehensive hospital information for informed decisions
- Direct communication channels with hospitals
- Support for complex medical procedures and treatments

## Hospital Admin Features
- Manage hospital profile and information
- View and manage appointment requests
- Update appointment status (pending → confirmed → completed)
- Access patient information for scheduled appointments
- Hospital-specific dashboard and analytics

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL with proper relational schema
- **Authentication**: JWT tokens with role-based access
- **API**: RESTful architecture
- **Security**: Helmet, rate limiting, input validation

## Database Schema

### Core Tables
- **users**: Patient, hospital admin, and super admin accounts
- **patients**: Extended patient profiles with medical information
- **hospitals**: Hospital details, specializations, and contact info
- **appointments**: Direct patient-to-hospital appointments
- **medical_reports**: Patient medical documents and reports
- **payments**: Payment tracking and history

### Key Relationships
- Patients can have multiple appointments across different hospitals
- Hospitals can receive appointments from multiple patients
- Appointment history is maintained across all hospitals
- Role-based access ensures data security and privacy

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

### Appointment Booking Issues
1. Ensure patient profile is complete
2. Verify hospital is active and available
3. Check for appointment time conflicts
4. Confirm all required fields are filled

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile

### Appointments
- `GET /api/appointments` - Get user appointments (role-based)
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Hospitals
- `GET /api/hospitals` - Get hospitals list
- `GET /api/hospitals/:id` - Get hospital details
- `GET /api/hospitals/search` - Search hospitals by criteria

### Patients
- `GET /api/patients/profile` - Get patient profile
- `PUT /api/patients/profile` - Update patient profile
- `GET /api/patients/appointments` - Get patient appointments

## Contributing

This is a medical tourism platform focused on connecting international patients with Indian hospitals. The system prioritizes:

1. **Direct Hospital Access**: No intermediary doctors, direct hospital appointments
2. **Comprehensive History**: Complete appointment history across all hospitals
3. **Medical Tourism**: Specialized features for international patients
4. **Transparency**: Clear communication and pricing
5. **Security**: Proper authentication and data protection

## License

MIT License - Built for medical tourism and international healthcare access.