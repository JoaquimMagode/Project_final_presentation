-- Database migration script to add missing columns and fix issues

-- Add doctor_name column to appointments table if it doesn't exist
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS doctor_name VARCHAR(255);

-- Add missing columns to patients table if they don't exist
ALTER TABLE patients ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS insurance_policy_number VARCHAR(100);

-- Insert sample hospitals if the table is empty
INSERT IGNORE INTO hospitals (name, email, phone, address, city, state, country, specialties, accreditations, description, status) VALUES
('Apollo Hospitals', 'info@apollohospitals.com', '+91-44-2829-3333', '21, Greams Lane, Off Greams Road', 'Chennai', 'Tamil Nadu', 'India', '["Cardiology", "Oncology", "Neurology", "Orthopedics"]', '["JCI", "NABH"]', 'Leading multi-specialty hospital with world-class healthcare services', 'active'),
('Fortis Healthcare', 'contact@fortishealthcare.com', '+91-11-4277-6222', 'Sector 62, Phase VIII', 'Mohali', 'Punjab', 'India', '["Cardiology", "Gastroenterology", "Nephrology", "Pulmonology"]', '["NABH", "ISO"]', 'Comprehensive healthcare with advanced medical technology', 'active'),
('Max Healthcare', 'info@maxhealthcare.com', '+91-11-2651-5050', '1, Press Enclave Road, Saket', 'New Delhi', 'Delhi', 'India', '["Oncology", "Cardiology", "Neurosurgery", "Transplant"]', '["JCI", "NABH", "NABL"]', 'Premium healthcare services with international standards', 'active'),
('Manipal Hospitals', 'info@manipalhospitals.com', '+91-80-2502-4444', '98, Rustom Bagh, Airport Road', 'Bangalore', 'Karnataka', 'India', '["Pediatrics", "Cardiology", "Orthopedics", "Dermatology"]', '["NABH", "ISO"]', 'Multi-specialty hospital with patient-centric care', 'active'),
('AIIMS Delhi', 'info@aiims.edu', '+91-11-2658-8500', 'Ansari Nagar', 'New Delhi', 'Delhi', 'India', '["All Specialties", "Research", "Emergency Care"]', '["NABH", "Government"]', 'Premier medical institute and hospital', 'active');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hospitals_city ON hospitals(city);
CREATE INDEX IF NOT EXISTS idx_hospitals_state ON hospitals(state);
CREATE INDEX IF NOT EXISTS idx_hospitals_status ON hospitals(status);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_hospital ON appointments(hospital_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_patients_user ON patients(user_id);