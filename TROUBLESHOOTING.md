# Database Integration Troubleshooting Guide

## Quick Fix for Current Issues

### 1. Database Setup and Hospital Data

Run these commands in the backend directory:

```bash
# Setup database with all required tables and sample data
npm run setup-db

# If that doesn't work, try individual steps:
npm run create-db
npm run seed
```

### 2. Missing Database Columns

If you get errors about missing columns, run this SQL directly in your MySQL database:

```sql
-- Add missing columns
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS doctor_name VARCHAR(255);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS insurance_policy_number VARCHAR(100);

-- Add sample hospitals
INSERT IGNORE INTO hospitals (name, email, phone, address, city, state, country, specialties, accreditations, description, status) VALUES
('Apollo Hospitals', 'info@apollohospitals.com', '+91-44-2829-3333', '21, Greams Lane, Off Greams Road', 'Chennai', 'Tamil Nadu', 'India', '["Cardiology", "Oncology", "Neurology", "Orthopedics"]', '["JCI", "NABH"]', 'Leading multi-specialty hospital with world-class healthcare services', 'active'),
('Fortis Healthcare', 'contact@fortishealthcare.com', '+91-11-4277-6222', 'Sector 62, Phase VIII', 'Mohali', 'Punjab', 'India', '["Cardiology", "Gastroenterology", "Nephrology", "Pulmonology"]', '["NABH", "ISO"]', 'Comprehensive healthcare with advanced medical technology', 'active'),
('Max Healthcare', 'info@maxhealthcare.com', '+91-11-2651-5050', '1, Press Enclave Road, Saket', 'New Delhi', 'Delhi', 'India', '["Oncology", "Cardiology", "Neurosurgery", "Transplant"]', '["JCI", "NABH", "NABL"]', 'Premium healthcare services with international standards', 'active');
```

### 3. Environment Variables

Make sure your `.env` file in the backend directory has:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=imap_solution_db
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 4. MySQL Service

Ensure MySQL is running:
- **Windows**: Start MySQL service from Services or XAMPP/WAMP
- **Mac**: `brew services start mysql`
- **Linux**: `sudo systemctl start mysql`

## Common Error Solutions

### Error: "Failed to get hospitals" (500 Internal Server Error)

**Cause**: Database connection issues or missing hospital data

**Solution**:
1. Check MySQL is running
2. Verify database credentials in `.env`
3. Run `npm run setup-db` to populate hospitals
4. Check server logs for specific error details

### Error: "Failed to get patient appointments" (500 Internal Server Error)

**Cause**: Missing `doctor_name` column in appointments table

**Solution**:
```sql
ALTER TABLE appointments ADD COLUMN doctor_name VARCHAR(255);
```

### Error: "Patient profile not found" (404)

**Cause**: User logged in but no patient record exists

**Solution**:
1. Complete patient registration first
2. Check if patient record exists in database:
```sql
SELECT * FROM patients WHERE user_id = YOUR_USER_ID;
```

### Error: Database connection refused

**Cause**: MySQL not running or wrong credentials

**Solution**:
1. Start MySQL service
2. Check `.env` file credentials
3. Test connection: `mysql -u root -p`

## Database Schema Verification

Run these queries to verify your database structure:

```sql
-- Check if all tables exist
SHOW TABLES;

-- Check appointments table structure
DESCRIBE appointments;

-- Check if hospitals exist
SELECT COUNT(*) FROM hospitals;

-- Check patients table structure
DESCRIBE patients;
```

## API Testing

Test the APIs directly:

```bash
# Test hospitals endpoint
curl http://localhost:5000/api/hospitals

# Test with authentication (replace TOKEN with actual JWT)
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/patients/profile
```

## Step-by-Step Recovery

If everything is broken, follow these steps:

1. **Stop the server** (Ctrl+C)

2. **Reset database**:
```bash
cd App/backend
npm run setup-db
```

3. **Start server**:
```bash
npm run dev
```

4. **Test in browser**:
   - Go to http://localhost:3000
   - Login with demo credentials
   - Check if hospitals load in appointment booking

5. **Check browser console** for any remaining errors

## Demo Credentials

After database setup, use these to test:

- **Patient**: `patient@demo.com` / `password`
- **Hospital Admin**: `hospital@demo.com` / `password`
- **Super Admin**: `admin@imapsolution.com` / `password`

## Contact for Help

If issues persist:
1. Check server console logs for detailed error messages
2. Check browser developer tools console
3. Verify all environment variables are set correctly
4. Ensure MySQL version compatibility (5.7+ recommended)