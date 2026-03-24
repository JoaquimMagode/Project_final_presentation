-- =====================================================
-- AfriHealth Medical Tourism Platform Database Schema
-- MySQL Database Creation Script
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS afrihealth_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE afrihealth_db;

-- =====================================================
-- 1. USERS TABLE
-- Core user authentication and basic information
-- =====================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('patient', 'hospital_admin', 'super_admin') NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 2. HOSPITALS TABLE
-- Hospital information and settings
-- =====================================================
CREATE TABLE hospitals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    specialties JSON,
    accreditations JSON,
    commission_rate DECIMAL(5,2) DEFAULT 8.00,
    logo_url VARCHAR(500),
    description TEXT,
    website_url VARCHAR(255),
    established_year YEAR,
    bed_capacity INT,
    status ENUM('active', 'pending', 'suspended') DEFAULT 'pending',
    admin_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_city (city),
    INDEX idx_state (state),
    INDEX idx_country (country),
    INDEX idx_status (status),
    INDEX idx_admin_id (admin_id),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 3. PATIENTS TABLE
-- Extended patient information
-- =====================================================
CREATE TABLE patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    nationality VARCHAR(100),
    passport_number VARCHAR(50),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    chronic_conditions TEXT,
    insurance_provider VARCHAR(255),
    insurance_policy_number VARCHAR(100),
    insurance_expiry_date DATE,
    preferred_language VARCHAR(50) DEFAULT 'English',
    profile_picture_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_city (city),
    INDEX idx_state (state),
    INDEX idx_country (country),
    INDEX idx_blood_group (blood_group)
);

-- =====================================================
-- 4. DOCTORS TABLE
-- Hospital doctors and specialists
-- =====================================================
CREATE TABLE doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hospital_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    specialization VARCHAR(255) NOT NULL,
    sub_specialization VARCHAR(255),
    qualification VARCHAR(500),
    experience_years INT DEFAULT 0,
    consultation_fee DECIMAL(10,2),
    languages_spoken JSON,
    availability JSON,
    bio TEXT,
    profile_picture_url VARCHAR(500),
    license_number VARCHAR(100),
    status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    INDEX idx_hospital_id (hospital_id),
    INDEX idx_specialization (specialization),
    INDEX idx_status (status),
    INDEX idx_name (name)
);

-- =====================================================
-- 5. APPOINTMENTS TABLE
-- Patient appointments with hospitals/doctors
-- =====================================================
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    hospital_id INT NOT NULL,
    doctor_id INT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    type ENUM('consultation', 'procedure', 'follow_up', 'telemedicine', 'surgery', 'diagnostic') NOT NULL,
    status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled') DEFAULT 'scheduled',
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    notes TEXT,
    symptoms TEXT,
    consultation_fee DECIMAL(10,2),
    estimated_duration INT DEFAULT 30, -- in minutes
    room_number VARCHAR(20),
    cancellation_reason TEXT,
    cancelled_by ENUM('patient', 'hospital', 'system'),
    cancelled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
    INDEX idx_patient_id (patient_id),
    INDEX idx_hospital_id (hospital_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_appointment_date (appointment_date),
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at),
    UNIQUE KEY unique_appointment (patient_id, appointment_date, appointment_time)
);

-- =====================================================
-- 6. MEDICAL_REPORTS TABLE
-- Patient medical reports and documents
-- =====================================================
CREATE TABLE medical_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    hospital_id INT,
    doctor_id INT,
    appointment_id INT,
    report_type VARCHAR(100),
    category ENUM('lab_report', 'imaging', 'prescription', 'discharge_summary', 'consultation_notes', 'other') DEFAULT 'other',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    file_type VARCHAR(50),
    file_size INT,
    report_date DATE,
    is_confidential BOOLEAN DEFAULT FALSE,
    shared_with_patient BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_patient_id (patient_id),
    INDEX idx_hospital_id (hospital_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_appointment_id (appointment_id),
    INDEX idx_report_type (report_type),
    INDEX idx_category (category),
    INDEX idx_report_date (report_date)
);

-- =====================================================
-- 7. PAYMENTS TABLE
-- Payment transactions and billing
-- =====================================================
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    hospital_id INT NOT NULL,
    appointment_id INT,
    invoice_number VARCHAR(100) UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    commission_amount DECIMAL(10,2),
    commission_rate DECIMAL(5,2),
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(10,2),
    payment_method ENUM('card', 'bank_transfer', 'cash', 'insurance', 'upi', 'wallet') NOT NULL,
    payment_status ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    gateway_transaction_id VARCHAR(255),
    payment_gateway VARCHAR(100),
    payment_date TIMESTAMP NULL,
    refund_amount DECIMAL(10,2) DEFAULT 0.00,
    refund_date TIMESTAMP NULL,
    refund_reason TEXT,
    description TEXT,
    billing_address JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_patient_id (patient_id),
    INDEX idx_hospital_id (hospital_id),
    INDEX idx_appointment_id (appointment_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_payment_method (payment_method),
    INDEX idx_payment_date (payment_date),
    INDEX idx_invoice_number (invoice_number),
    INDEX idx_transaction_id (transaction_id)
);

-- =====================================================
-- 8. HOSPITAL_EMPLOYEES TABLE
-- Hospital staff and employee management
-- =====================================================
CREATE TABLE hospital_employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hospital_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    employee_id VARCHAR(50),
    hire_date DATE,
    termination_date DATE,
    salary DECIMAL(10,2),
    employment_type ENUM('full_time', 'part_time', 'contract', 'intern') DEFAULT 'full_time',
    shift ENUM('morning', 'evening', 'night', 'rotating') DEFAULT 'morning',
    qualifications TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    address TEXT,
    status ENUM('active', 'inactive', 'terminated', 'on_leave') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    INDEX idx_hospital_id (hospital_id),
    INDEX idx_employee_id (employee_id),
    INDEX idx_department (department),
    INDEX idx_position (position),
    INDEX idx_status (status),
    INDEX idx_name (name)
);

-- =====================================================
-- 9. NOTIFICATIONS TABLE
-- System notifications for users
-- =====================================================
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('appointment', 'payment', 'report', 'system', 'reminder', 'promotion', 'alert') NOT NULL,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    read_status BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    metadata JSON,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_read_status (read_status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at),
    INDEX idx_expires_at (expires_at)
);

-- =====================================================
-- 10. SYSTEM_LOGS TABLE
-- Audit trail and system activity logs
-- =====================================================
CREATE TABLE system_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id INT,
    old_values JSON,
    new_values JSON,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_entity_type (entity_type),
    INDEX idx_entity_id (entity_id),
    INDEX idx_created_at (created_at),
    INDEX idx_ip_address (ip_address)
);

-- =====================================================
-- 11. HOSPITAL_SERVICES TABLE
-- Services offered by hospitals
-- =====================================================
CREATE TABLE hospital_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hospital_id INT NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_category VARCHAR(100),
    description TEXT,
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'INR',
    duration_minutes INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    INDEX idx_hospital_id (hospital_id),
    INDEX idx_service_category (service_category),
    INDEX idx_is_active (is_active)
);

-- =====================================================
-- 12. REVIEWS_RATINGS TABLE
-- Patient reviews and ratings for hospitals
-- =====================================================
CREATE TABLE reviews_ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    hospital_id INT NOT NULL,
    doctor_id INT,
    appointment_id INT,
    overall_rating DECIMAL(2,1) CHECK (overall_rating >= 1.0 AND overall_rating <= 5.0),
    service_rating DECIMAL(2,1) CHECK (service_rating >= 1.0 AND service_rating <= 5.0),
    cleanliness_rating DECIMAL(2,1) CHECK (cleanliness_rating >= 1.0 AND cleanliness_rating <= 5.0),
    staff_rating DECIMAL(2,1) CHECK (staff_rating >= 1.0 AND staff_rating <= 5.0),
    review_title VARCHAR(255),
    review_text TEXT,
    would_recommend BOOLEAN,
    is_verified BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    admin_response TEXT,
    admin_response_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_patient_id (patient_id),
    INDEX idx_hospital_id (hospital_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_overall_rating (overall_rating),
    INDEX idx_is_published (is_published),
    INDEX idx_created_at (created_at),
    UNIQUE KEY unique_review (patient_id, hospital_id, appointment_id)
);

-- =====================================================
-- 13. MEDICAL_PACKAGES TABLE
-- Medical tourism packages offered by hospitals
-- =====================================================
CREATE TABLE medical_packages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hospital_id INT NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    package_code VARCHAR(50) UNIQUE,
    category VARCHAR(100),
    description TEXT,
    included_services JSON,
    excluded_services JSON,
    duration_days INT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    discounted_price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    max_bookings INT,
    current_bookings INT DEFAULT 0,
    valid_from DATE,
    valid_until DATE,
    terms_conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    INDEX idx_hospital_id (hospital_id),
    INDEX idx_category (category),
    INDEX idx_is_active (is_active),
    INDEX idx_is_featured (is_featured),
    INDEX idx_package_code (package_code),
    INDEX idx_valid_from (valid_from),
    INDEX idx_valid_until (valid_until)
);

-- =====================================================
-- 14. PACKAGE_BOOKINGS TABLE
-- Bookings for medical packages
-- =====================================================
CREATE TABLE package_bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    package_id INT NOT NULL,
    booking_reference VARCHAR(100) UNIQUE,
    booking_date DATE NOT NULL,
    travel_date DATE,
    number_of_people INT DEFAULT 1,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded') DEFAULT 'pending',
    special_requirements TEXT,
    contact_person_name VARCHAR(255),
    contact_person_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES medical_packages(id) ON DELETE CASCADE,
    INDEX idx_patient_id (patient_id),
    INDEX idx_package_id (package_id),
    INDEX idx_booking_reference (booking_reference),
    INDEX idx_booking_date (booking_date),
    INDEX idx_status (status)
);

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert Super Admin User
INSERT INTO users (email, password, name, role, status, email_verified) VALUES 
('admin@afrihealth.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Super Administrator', 'super_admin', 'active', TRUE);

-- Insert Sample Specialties and Countries Data (for reference)
-- These would typically be managed through the application

-- =====================================================
-- CREATE VIEWS FOR COMMON QUERIES
-- =====================================================

-- Hospital Statistics View
CREATE VIEW hospital_stats AS
SELECT 
    h.id,
    h.name,
    h.city,
    h.state,
    h.status,
    COUNT(DISTINCT a.id) as total_appointments,
    COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_appointments,
    COUNT(DISTINCT p.id) as total_patients,
    COALESCE(SUM(CASE WHEN pay.payment_status = 'completed' THEN pay.amount END), 0) as total_revenue,
    AVG(r.overall_rating) as average_rating,
    COUNT(r.id) as total_reviews
FROM hospitals h
LEFT JOIN appointments a ON h.id = a.hospital_id
LEFT JOIN patients p ON a.patient_id = p.id
LEFT JOIN payments pay ON a.id = pay.appointment_id
LEFT JOIN reviews_ratings r ON h.id = r.hospital_id AND r.is_published = TRUE
GROUP BY h.id, h.name, h.city, h.state, h.status;

-- Patient Summary View
CREATE VIEW patient_summary AS
SELECT 
    p.id,
    u.name,
    u.email,
    u.phone,
    p.city,
    p.state,
    p.country,
    COUNT(DISTINCT a.id) as total_appointments,
    COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_appointments,
    COUNT(DISTINCT mr.id) as total_reports,
    COALESCE(SUM(CASE WHEN pay.payment_status = 'completed' THEN pay.amount END), 0) as total_spent,
    MAX(a.appointment_date) as last_appointment_date
FROM patients p
JOIN users u ON p.user_id = u.id
LEFT JOIN appointments a ON p.id = a.patient_id
LEFT JOIN medical_reports mr ON p.id = mr.patient_id
LEFT JOIN payments pay ON a.id = pay.appointment_id
GROUP BY p.id, u.name, u.email, u.phone, p.city, p.state, p.country;

-- =====================================================
-- CREATE STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure to get hospital dashboard data
CREATE PROCEDURE GetHospitalDashboard(IN hospital_id INT)
BEGIN
    -- Get basic statistics
    SELECT 
        COUNT(DISTINCT a.patient_id) as total_patients,
        COUNT(DISTINCT a.id) as total_appointments,
        COUNT(DISTINCT CASE WHEN a.status = 'scheduled' THEN a.id END) as scheduled_appointments,
        COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_appointments,
        COUNT(DISTINCT d.id) as total_doctors,
        COUNT(DISTINCT e.id) as total_employees,
        COALESCE(SUM(CASE WHEN p.payment_status = 'completed' THEN p.amount END), 0) as total_revenue,
        COALESCE(AVG(r.overall_rating), 0) as average_rating,
        COUNT(r.id) as total_reviews
    FROM hospitals h
    LEFT JOIN appointments a ON h.id = a.hospital_id
    LEFT JOIN doctors d ON h.id = d.hospital_id AND d.status = 'active'
    LEFT JOIN hospital_employees e ON h.id = e.hospital_id AND e.status = 'active'
    LEFT JOIN payments p ON a.id = p.appointment_id
    LEFT JOIN reviews_ratings r ON h.id = r.hospital_id AND r.is_published = TRUE
    WHERE h.id = hospital_id;
    
    -- Get recent appointments
    SELECT 
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.type,
        a.status,
        u.name as patient_name,
        d.name as doctor_name
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN users u ON p.user_id = u.id
    LEFT JOIN doctors d ON a.doctor_id = d.id
    WHERE a.hospital_id = hospital_id
    ORDER BY a.created_at DESC
    LIMIT 10;
END //

-- Procedure to get patient dashboard data
CREATE PROCEDURE GetPatientDashboard(IN patient_id INT)
BEGIN
    -- Get patient statistics
    SELECT 
        COUNT(DISTINCT a.id) as total_appointments,
        COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_appointments,
        COUNT(DISTINCT CASE WHEN a.status = 'scheduled' THEN a.id END) as upcoming_appointments,
        COUNT(DISTINCT mr.id) as total_reports,
        COALESCE(SUM(CASE WHEN p.payment_status = 'completed' THEN p.amount END), 0) as total_spent,
        MAX(a.appointment_date) as last_appointment_date,
        MIN(CASE WHEN a.appointment_date >= CURDATE() AND a.status = 'scheduled' THEN a.appointment_date END) as next_appointment_date
    FROM patients pat
    LEFT JOIN appointments a ON pat.id = a.patient_id
    LEFT JOIN medical_reports mr ON pat.id = mr.patient_id
    LEFT JOIN payments p ON a.id = p.appointment_id
    WHERE pat.id = patient_id;
    
    -- Get upcoming appointments
    SELECT 
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.type,
        a.status,
        h.name as hospital_name,
        h.city as hospital_city,
        d.name as doctor_name,
        d.specialization
    FROM appointments a
    JOIN hospitals h ON a.hospital_id = h.id
    LEFT JOIN doctors d ON a.doctor_id = d.id
    WHERE a.patient_id = patient_id 
    AND a.appointment_date >= CURDATE()
    AND a.status IN ('scheduled', 'confirmed')
    ORDER BY a.appointment_date ASC, a.appointment_time ASC
    LIMIT 5;
END //

DELIMITER ;

-- =====================================================
-- CREATE TRIGGERS
-- =====================================================

DELIMITER //

-- Trigger to update hospital rating when review is added/updated
CREATE TRIGGER update_hospital_rating 
AFTER INSERT ON reviews_ratings
FOR EACH ROW
BEGIN
    UPDATE hospitals 
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.hospital_id;
END //

-- Trigger to log user activities
CREATE TRIGGER log_user_login
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    IF NEW.last_login != OLD.last_login THEN
        INSERT INTO system_logs (user_id, action, entity_type, entity_id, details)
        VALUES (NEW.id, 'USER_LOGIN', 'users', NEW.id, JSON_OBJECT('login_time', NEW.last_login));
    END IF;
END //

-- Trigger to update package booking count
CREATE TRIGGER update_package_bookings
AFTER INSERT ON package_bookings
FOR EACH ROW
BEGIN
    UPDATE medical_packages 
    SET current_bookings = current_bookings + NEW.number_of_people
    WHERE id = NEW.package_id;
END //

DELIMITER ;

-- =====================================================
-- GRANT PERMISSIONS (Optional - for specific database user)
-- =====================================================

-- Create application user (uncomment and modify as needed)
-- CREATE USER 'afrihealth_app'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON afrihealth_db.* TO 'afrihealth_app'@'localhost';
-- FLUSH PRIVILEGES;

-- =====================================================
-- DATABASE SETUP COMPLETE
-- =====================================================

SELECT 'AfriHealth Database Setup Complete!' as Status;
SELECT COUNT(*) as 'Total Tables Created' FROM information_schema.tables WHERE table_schema = 'afrihealth_db';