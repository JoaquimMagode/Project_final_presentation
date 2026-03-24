# IMAP Solution Backend API

A comprehensive backend system for the IMAP Solution Medical Tourism Platform built with Node.js, Express, and MySQL.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Support for patients, hospital admins, and super admins
- **Hospital Management**: Complete hospital CRUD operations with file uploads
- **Patient Management**: Patient profiles and medical history
- **Appointment System**: Booking, scheduling, and management
- **File Upload**: Secure file handling for medical reports and hospital logos
- **Database**: MySQL with proper relationships and constraints
- **Security**: Rate limiting, CORS, helmet, input validation
- **API Documentation**: RESTful API design with proper error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Environment**: dotenv

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration and connection
├── middleware/
│   ├── auth.js              # Authentication and authorization
│   ├── validation.js        # Request validation
│   └── upload.js            # File upload handling
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── hospitals.js         # Hospital management routes
│   ├── patients.js          # Patient management routes
│   └── appointments.js      # Appointment management routes
├── uploads/                 # File upload directory
│   ├── profiles/
│   ├── hospitals/
│   ├── reports/
│   └── documents/
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
└── server.js               # Main server file
```

## Installation

1. **Clone the repository**
   ```bash
   cd App/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env` file and update the values:
   ```bash
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=imap_solution_db
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Set up MySQL Database**
   - Create a MySQL database named `imap_solution_db`
   - Run the seed script to create tables and demo data:
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Demo Credentials

After running the seed script, you can use these demo credentials:

- **Patient**: `patient@demo.com` / `password`
- **Hospital Admin**: `hospital@demo.com` / `password`  
- **Super Admin**: `admin@imapsolution.com` / `password`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/users` - Get all users (Super Admin only)

### Hospitals
- `GET /api/hospitals` - Get all hospitals
- `GET /api/hospitals/:id` - Get hospital by ID
- `POST /api/hospitals` - Create new hospital (Super Admin)
- `PUT /api/hospitals/:id` - Update hospital
- `PUT /api/hospitals/:id/status` - Update hospital status (Super Admin)
- `DELETE /api/hospitals/:id` - Delete hospital (Super Admin)
- `GET /api/hospitals/:id/dashboard` - Get hospital dashboard data

### Patients
- `GET /api/patients` - Get all patients (Admin only)
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient profile
- `GET /api/patients/:id/appointments` - Get patient appointments
- `GET /api/patients/:id/reports` - Get patient medical reports
- `GET /api/patients/:id/payments` - Get patient payment history
- `GET /api/patients/me` - Get current patient profile

### Appointments
- `GET /api/appointments` - Get appointments (role-filtered)
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment (Patient)
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/available-slots` - Get available time slots

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password` - Hashed password
- `name` - Full name
- `phone` - Phone number
- `role` - User role (patient, hospital_admin, super_admin)
- `status` - Account status (active, inactive, suspended)

### Hospitals Table
- `id` - Primary key
- `name` - Hospital name
- `email` - Contact email
- `phone` - Contact phone
- `address` - Full address
- `city`, `state`, `country` - Location details
- `specialties` - JSON array of medical specialties
- `accreditations` - JSON array of certifications
- `commission_rate` - Commission percentage
- `logo_url` - Hospital logo URL
- `status` - Hospital status (active, pending, suspended)
- `admin_id` - Foreign key to users table

### Patients Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `date_of_birth` - Patient's birth date
- `gender` - Gender (male, female, other)
- `blood_group` - Blood type
- `medical_history` - Medical history text
- `allergies` - Known allergies
- `insurance_provider` - Insurance company
- `emergency_contact_name` - Emergency contact name
- `emergency_contact_phone` - Emergency contact phone

### Appointments Table
- `id` - Primary key
- `patient_id` - Foreign key to patients table
- `hospital_id` - Foreign key to hospitals table
- `doctor_id` - Foreign key to doctors table
- `appointment_date` - Appointment date
- `appointment_time` - Appointment time
- `type` - Appointment type (consultation, procedure, etc.)
- `status` - Status (scheduled, confirmed, completed, cancelled)
- `notes` - Additional notes
- `consultation_fee` - Fee amount

## User Roles

### Patient
- Register and manage profile
- Book appointments
- View medical reports
- View payment history
- Update personal information

### Hospital Admin
- Manage hospital profile
- View hospital dashboard
- Manage appointments for their hospital
- View hospital statistics
- Manage hospital employees

### Super Admin
- Manage all hospitals
- Approve/reject hospital registrations
- View system-wide statistics
- Manage all users
- Access all data

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin resource sharing control
- **Helmet**: Security headers
- **File Upload Security**: File type and size validation

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## File Upload

Supports file uploads for:
- Hospital logos
- Medical reports
- Profile pictures
- Documents

Files are stored in organized directories with unique names and proper validation.

## Development

### Running in Development Mode
```bash
npm run dev
```

### Environment Variables
Make sure to set all required environment variables in `.env` file.

### Database Initialization
The application automatically creates all required tables on startup.

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a process manager like PM2
3. Set up proper MySQL database
4. Configure reverse proxy (nginx)
5. Set up SSL certificates
6. Configure proper logging

## API Testing

Use tools like Postman or curl to test the API endpoints. The server includes a health check endpoint at `/health`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.