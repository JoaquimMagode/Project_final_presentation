const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create tables if they don't exist
    await createTables();

    // Clear existing data and recreate tables with proper schema
    await pool.execute('SET FOREIGN_KEY_CHECKS = 0');
    await pool.execute('DROP TABLE IF EXISTS appointments');
    await pool.execute('DROP TABLE IF EXISTS hospitals');
    await pool.execute('DELETE FROM patients');
    await pool.execute('DELETE FROM users');
    await pool.execute('SET FOREIGN_KEY_CHECKS = 1');
    
    // Recreate hospitals table with proper schema
    await pool.execute(`
      CREATE TABLE hospitals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100) DEFAULT 'India',
        specialties JSON,
        description TEXT,
        status ENUM('active', 'pending', 'suspended') DEFAULT 'active',
        admin_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    
    // Recreate appointments table
    await pool.execute(`
      CREATE TABLE appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        hospital_id INT NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        type ENUM('consultation', 'procedure', 'follow_up', 'telemedicine') DEFAULT 'consultation',
        reason TEXT NOT NULL,
        notes TEXT,
        status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'pending',
        consultation_fee DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
      )
    `);

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
          'INSERT INTO patients (user_id, date_of_birth, gender, address, emergency_contact_name, emergency_contact_phone) VALUES (?, ?, ?, ?, ?, ?)',
          [result.insertId, '1990-05-15', 'male', 'Lagos, Nigeria', 'Emergency Contact', '+234-123-456-7891']
        );
        console.log(`✅ Created patient profile for user ID: ${result.insertId}`);
      }
    }

    // Seed hospitals
    const hospitals = [
      {
        name: 'Apollo Hospitals Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        specialties: ['Cardiology', 'Orthopedics', 'Neurology', 'Cancer Treatment'],
        email: 'info@apollomumbai.com',
        phone: '+91-22-6767-4444',
        admin_id: 2
      },
      {
        name: 'Fortis Memorial Research Institute',
        city: 'Delhi',
        state: 'Delhi',
        specialties: ['Cardiology', 'Neurosurgery', 'Oncology', 'Kidney Transplant'],
        email: 'info@fortismemorial.com',
        phone: '+91-11-4277-6222',
        admin_id: 2
      },
      {
        name: 'Max Healthcare',
        city: 'Delhi',
        state: 'Delhi',
        specialties: ['Orthopedics', 'Cardiology', 'Gastroenterology', 'Joint Replacement'],
        email: 'info@maxhealthcare.com',
        phone: '+91-11-2651-5050',
        admin_id: 2
      },
      {
        name: 'Manipal Hospitals',
        city: 'Bangalore',
        state: 'Karnataka',
        specialties: ['Neurology', 'Cardiac Surgery', 'IVF Treatment', 'Eye Surgery'],
        email: 'info@manipalhospitals.com',
        phone: '+91-80-2502-4444',
        admin_id: 2
      },
      {
        name: 'Medanta - The Medicity',
        city: 'Gurgaon',
        state: 'Haryana',
        specialties: ['Liver Transplant', 'Spine Surgery', 'Cosmetic Surgery', 'Dental Treatment'],
        email: 'info@medanta.org',
        phone: '+91-124-414-1414',
        admin_id: 2
      }
    ];

    console.log('🏥 Seeding hospitals...');
    for (const hospital of hospitals) {
      const [result] = await pool.execute(
        'INSERT INTO hospitals (name, city, state, address, specialties, email, phone, admin_id, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          hospital.name, 
          hospital.city, 
          hospital.state, 
          `${hospital.city}, ${hospital.state}, India`, 
          JSON.stringify(hospital.specialties), 
          hospital.email, 
          hospital.phone, 
          hospital.admin_id, 
          'active',
          `Leading healthcare provider in ${hospital.city} offering comprehensive medical services.`
        ]
      );
      console.log(`✅ Created hospital: ${hospital.name} (ID: ${result.insertId})`);
    }

    // Seed appointments
    const appointments = [
      {
        patient_id: 1,
        hospital_id: 1,
        appointment_date: '2024-04-20',
        appointment_time: '10:00:00',
        type: 'consultation',
        reason: 'Cardiology consultation for chest pain and irregular heartbeat',
        status: 'confirmed',
        consultation_fee: 150.00
      },
      {
        patient_id: 1,
        hospital_id: 2,
        appointment_date: '2024-04-25',
        appointment_time: '14:30:00',
        type: 'consultation',
        reason: 'Neurosurgery consultation for chronic headaches',
        status: 'pending',
        consultation_fee: 200.00
      },
      {
        patient_id: 1,
        hospital_id: 3,
        appointment_date: '2024-05-01',
        appointment_time: '09:00:00',
        type: 'consultation',
        reason: 'General health checkup and blood work',
        status: 'confirmed',
        consultation_fee: 100.00
      },
      {
        patient_id: 1,
        hospital_id: 4,
        appointment_date: '2024-03-15',
        appointment_time: '11:00:00',
        type: 'procedure',
        reason: 'Eye surgery consultation for vision correction',
        status: 'completed',
        consultation_fee: 300.00
      },
      {
        patient_id: 1,
        hospital_id: 5,
        appointment_date: '2024-03-10',
        appointment_time: '15:00:00',
        type: 'follow_up',
        reason: 'Follow-up appointment for previous dental treatment',
        status: 'completed',
        consultation_fee: 75.00
      },
      {
        patient_id: 1,
        hospital_id: 1,
        appointment_date: '2024-02-20',
        appointment_time: '16:00:00',
        type: 'telemedicine',
        reason: 'Online consultation for medication review',
        status: 'completed',
        consultation_fee: 50.00
      }
    ];

    console.log('📅 Seeding appointments...');
    for (const appointment of appointments) {
      const [result] = await pool.execute(
        'INSERT INTO appointments (patient_id, hospital_id, appointment_date, appointment_time, type, reason, status, consultation_fee) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [appointment.patient_id, appointment.hospital_id, appointment.appointment_date, appointment.appointment_time, appointment.type, appointment.reason, appointment.status, appointment.consultation_fee]
      );
      console.log(`✅ Created appointment: ${appointment.reason.substring(0, 30)}... (ID: ${result.insertId})`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Patient: patient@demo.com / password');
    console.log('Hospital Admin: hospital@demo.com / password');
    console.log('Super Admin: admin@imapsolution.com / password');
    console.log('\n🏥 Sample hospitals with direct appointment booking:');
    console.log('- Apollo Hospitals Mumbai (Cardiology, Orthopedics)');
    console.log('- Fortis Memorial Research Institute (Neurosurgery, Oncology)');
    console.log('- Max Healthcare (Orthopedics, Gastroenterology)');
    console.log('- Manipal Hospitals (Neurology, Cardiac Surgery)');
    console.log('- Medanta - The Medicity (Liver Transplant, Spine Surgery)');

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
      email VARCHAR(255),
      phone VARCHAR(20),
      address TEXT,
      city VARCHAR(100),
      state VARCHAR(100),
      country VARCHAR(100) DEFAULT 'India',
      specialties JSON,
      description TEXT,
      status ENUM('active', 'pending', 'suspended') DEFAULT 'active',
      admin_id INT,
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
      appointment_date DATE NOT NULL,
      appointment_time TIME NOT NULL,
      type ENUM('consultation', 'procedure', 'follow_up', 'telemedicine') DEFAULT 'consultation',
      reason TEXT NOT NULL,
      notes TEXT,
      status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'pending',
      consultation_fee DECIMAL(10,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
      FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Database tables created successfully!');
};

// Run the seed function
seedDatabase();