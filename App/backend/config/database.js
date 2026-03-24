const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'imap_solution_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Create database if it doesn't exist
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await tempConnection.end();

    // Create tables
    await createTables();
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

// Create all necessary tables
const createTables = async () => {
  const connection = await pool.getConnection();
  
  try {
    // Users table (patients, hospital admins, super admin)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('patient', 'hospital_admin', 'super_admin') NOT NULL,
        status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Hospitals table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS hospitals (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100) DEFAULT 'India',
        specialties JSON,
        accreditations JSON,
        commission_rate DECIMAL(5,2) DEFAULT 8.00,
        logo_url VARCHAR(500),
        description TEXT,
        status ENUM('active', 'pending', 'suspended') DEFAULT 'pending',
        admin_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Patients table (extended user information)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT UNIQUE NOT NULL,
        date_of_birth DATE,
        gender ENUM('male', 'female', 'other'),
        blood_group VARCHAR(5),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        emergency_contact_name VARCHAR(255),
        emergency_contact_phone VARCHAR(20),
        medical_history TEXT,
        allergies TEXT,
        current_medications TEXT,
        insurance_provider VARCHAR(255),
        insurance_policy_number VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Doctors table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INT PRIMARY KEY AUTO_INCREMENT,
        hospital_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        specialization VARCHAR(255),
        qualification VARCHAR(500),
        experience_years INT,
        consultation_fee DECIMAL(10,2),
        availability JSON,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
      )
    `);

    // Appointments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        patient_id INT NOT NULL,
        hospital_id INT NOT NULL,
        doctor_id INT,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        type ENUM('consultation', 'procedure', 'follow_up', 'telemedicine') NOT NULL,
        status ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
        notes TEXT,
        consultation_fee DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
      )
    `);

    // Medical reports table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS medical_reports (
        id INT PRIMARY KEY AUTO_INCREMENT,
        patient_id INT NOT NULL,
        hospital_id INT,
        doctor_id INT,
        appointment_id INT,
        report_type VARCHAR(100),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_url VARCHAR(500),
        file_type VARCHAR(50),
        file_size INT,
        report_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
      )
    `);

    // Payments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        patient_id INT NOT NULL,
        hospital_id INT NOT NULL,
        appointment_id INT,
        amount DECIMAL(10,2) NOT NULL,
        commission_amount DECIMAL(10,2),
        payment_method ENUM('card', 'bank_transfer', 'cash', 'insurance') NOT NULL,
        payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        transaction_id VARCHAR(255),
        payment_date TIMESTAMP,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
      )
    `);

    // Hospital employees table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS hospital_employees (
        id INT PRIMARY KEY AUTO_INCREMENT,
        hospital_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        position VARCHAR(100),
        department VARCHAR(100),
        employee_id VARCHAR(50),
        hire_date DATE,
        salary DECIMAL(10,2),
        status ENUM('active', 'inactive', 'terminated') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
      )
    `);

    // System logs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS system_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        action VARCHAR(255) NOT NULL,
        entity_type VARCHAR(100),
        entity_id INT,
        details JSON,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Notifications table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('appointment', 'payment', 'report', 'system', 'reminder') NOT NULL,
        read_status BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

  } finally {
    connection.release();
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase
};