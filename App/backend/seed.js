const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create tables if they don't exist
    await createTables();

    // Clear existing data
    await pool.execute('DELETE FROM appointments');
    await pool.execute('DELETE FROM patients');
    await pool.execute('DELETE FROM hospitals');
    await pool.execute('DELETE FROM users');

    // Reset auto increment
    await pool.execute('ALTER TABLE users AUTO_INCREMENT = 1');
    await pool.execute('ALTER TABLE hospitals AUTO_INCREMENT = 1');
    await pool.execute('ALTER TABLE patients AUTO_INCREMENT = 1');
    await pool.execute('ALTER TABLE appointments AUTO_INCREMENT = 1');

    // Seed users
    const hashedPassword = await bcrypt.hash('password', 12);
    
    const users = [
      {
        email: 'patient@demo.com',
        password: hashedPassword,
        name: 'Samuel Mensah',
        phone: '+234-123-456-7890',
        role: 'patient'
      },
      {
        email: 'hospital@demo.com',
        password: hashedPassword,
        name: 'Fortis Memorial Admin',
        phone: '+91-11-4277-6222',
        role: 'hospital_admin'
      },
      {
        email: 'admin@imapsolution.com',
        password: hashedPassword,
        name: 'IMAP Solution Admin',
        phone: '+1-800-123-4567',
        role: 'super_admin'
      }
    ];

    console.log('👥 Seeding users...');
    for (const user of users) {
      const [result] = await pool.execute(
        'INSERT INTO users (email, password, name, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        [user.email, user.password, user.name, user.phone, user.role, 'active']
      );
      
      console.log(`✅ Created user: ${user.email} (ID: ${result.insertId})`);
      
      // Create patient profile if role is patient
      if (user.role === 'patient') {
        await pool.execute(
          'INSERT INTO patients (user_id, date_of_birth, gender, address, emergency_contact) VALUES (?, ?, ?, ?, ?)',
          [result.insertId, '1990-05-15', 'male', 'Lagos, Nigeria', '+234-123-456-7891']
        );
        console.log(`✅ Created patient profile for user ID: ${result.insertId}`);
      }
    }

    // Seed hospitals
    const hospitals = [
      {
        name: 'Apollo Hospitals Mumbai',
        location: 'Mumbai',
        specializations: 'Cardiology, Orthopedics, Neurology',
        contact_email: 'info@apollomumbai.com',
        contact_phone: '+91-22-6767-4444',
        admin_id: 2 // hospital admin user
      },
      {
        name: 'Fortis Memorial Research Institute',
        location: 'Delhi',
        specializations: 'Cardiology, Neurosurgery, Oncology',
        contact_email: 'info@fortismemorial.com',
        contact_phone: '+91-11-4277-6222',
        admin_id: 2
      },
      {
        name: 'Max Healthcare',
        location: 'Delhi',
        specializations: 'Orthopedics, Cardiology, Gastroenterology',
        contact_email: 'info@maxhealthcare.com',
        contact_phone: '+91-11-2651-5050',
        admin_id: 2
      }
    ];

    console.log('🏥 Seeding hospitals...');
    for (const hospital of hospitals) {
      const [result] = await pool.execute(
        'INSERT INTO hospitals (name, location, specializations, contact_email, contact_phone, admin_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [hospital.name, hospital.location, hospital.specializations, hospital.contact_email, hospital.contact_phone, hospital.admin_id, 'active']
      );
      console.log(`✅ Created hospital: ${hospital.name} (ID: ${result.insertId})`);
    }

    // Seed appointments
    const appointments = [
      {
        patient_id: 1,
        hospital_id: 1,
        doctor_name: 'Dr. Sandeep Vaishya',
        appointment_date: '2024-04-20',
        appointment_time: '10:00:00',
        reason: 'Neurology consultation',
        status: 'confirmed'
      },
      {
        patient_id: 1,
        hospital_id: 2,
        doctor_name: 'Dr. Robert Coelho',
        appointment_time: '14:30:00',
        appointment_date: '2024-04-25',
        reason: 'Cardiac surgery consultation',
        status: 'pending'
      },
      {
        patient_id: 1,
        hospital_id: 3,
        doctor_name: 'Dr. Priya Sharma',
        appointment_date: '2024-05-01',
        appointment_time: '09:00:00',
        reason: 'General checkup',
        status: 'confirmed'
      }
    ];

    console.log('📅 Seeding appointments...');
    for (const appointment of appointments) {
      const [result] = await pool.execute(
        'INSERT INTO appointments (patient_id, hospital_id, doctor_name, appointment_date, appointment_time, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [appointment.patient_id, appointment.hospital_id, appointment.doctor_name, appointment.appointment_date, appointment.appointment_time, appointment.reason, appointment.status]
      );
      console.log(`✅ Created appointment: ${appointment.doctor_name} (ID: ${result.insertId})`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Patient: patient@demo.com / password');
    console.log('Hospital Admin: hospital@demo.com / password');
    console.log('Super Admin: admin@imapsolution.com / password');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
};

const createTables = async () => {
  console.log('📋 Creating database tables...');

  // Users table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      role ENUM('patient', 'hospital_admin', 'super_admin') NOT NULL,
      status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Patients table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS patients (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      date_of_birth DATE,
      gender ENUM('male', 'female', 'other'),
      address TEXT,
      emergency_contact VARCHAR(20),
      medical_history TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Hospitals table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS hospitals (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      specializations TEXT,
      contact_email VARCHAR(255),
      contact_phone VARCHAR(20),
      admin_id INT,
      status ENUM('active', 'inactive') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Appointments table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_id INT NOT NULL,
      hospital_id INT NOT NULL,
      doctor_name VARCHAR(255),
      appointment_date DATE NOT NULL,
      appointment_time TIME NOT NULL,
      reason TEXT,
      status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Database tables created successfully!');
};

// Run the seed function
seedDatabase();