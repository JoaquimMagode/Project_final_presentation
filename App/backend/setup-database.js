const { pool, initializeDatabase } = require('./config/database');

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');
    
    // Initialize database and tables
    await initializeDatabase();
    
    // Add missing columns if they don't exist
    console.log('📝 Adding missing columns...');
    
    try {
      await pool.execute('ALTER TABLE appointments ADD COLUMN doctor_name VARCHAR(255)');
      console.log('✅ Added doctor_name column to appointments');
    } catch (error) {
      if (!error.message.includes('Duplicate column name')) {
        console.log('ℹ️ doctor_name column already exists');
      }
    }
    
    try {
      await pool.execute('ALTER TABLE patients ADD COLUMN city VARCHAR(100)');
      console.log('✅ Added city column to patients');
    } catch (error) {
      if (!error.message.includes('Duplicate column name')) {
        console.log('ℹ️ city column already exists');
      }
    }
    
    try {
      await pool.execute('ALTER TABLE patients ADD COLUMN state VARCHAR(100)');
      console.log('✅ Added state column to patients');
    } catch (error) {
      if (!error.message.includes('Duplicate column name')) {
        console.log('ℹ️ state column already exists');
      }
    }
    
    try {
      await pool.execute('ALTER TABLE patients ADD COLUMN insurance_policy_number VARCHAR(100)');
      console.log('✅ Added insurance_policy_number column to patients');
    } catch (error) {
      if (!error.message.includes('Duplicate column name')) {
        console.log('ℹ️ insurance_policy_number column already exists');
      }
    }
    
    // Check if hospitals exist, if not add sample data
    const [hospitals] = await pool.execute('SELECT COUNT(*) as count FROM hospitals');
    if (hospitals[0].count === 0) {
      console.log('🏥 Adding sample hospitals...');
      
      const sampleHospitals = [
        {
          name: 'Apollo Hospitals',
          email: 'info@apollohospitals.com',
          phone: '+91-44-2829-3333',
          address: '21, Greams Lane, Off Greams Road',
          city: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India',
          specialties: JSON.stringify(['Cardiology', 'Oncology', 'Neurology', 'Orthopedics']),
          accreditations: JSON.stringify(['JCI', 'NABH']),
          description: 'Leading multi-specialty hospital with world-class healthcare services',
          status: 'active'
        },
        {
          name: 'Fortis Healthcare',
          email: 'contact@fortishealthcare.com',
          phone: '+91-11-4277-6222',
          address: 'Sector 62, Phase VIII',
          city: 'Mohali',
          state: 'Punjab',
          country: 'India',
          specialties: JSON.stringify(['Cardiology', 'Gastroenterology', 'Nephrology', 'Pulmonology']),
          accreditations: JSON.stringify(['NABH', 'ISO']),
          description: 'Comprehensive healthcare with advanced medical technology',
          status: 'active'
        },
        {
          name: 'Max Healthcare',
          email: 'info@maxhealthcare.com',
          phone: '+91-11-2651-5050',
          address: '1, Press Enclave Road, Saket',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          specialties: JSON.stringify(['Oncology', 'Cardiology', 'Neurosurgery', 'Transplant']),
          accreditations: JSON.stringify(['JCI', 'NABH', 'NABL']),
          description: 'Premium healthcare services with international standards',
          status: 'active'
        },
        {
          name: 'Manipal Hospitals',
          email: 'info@manipalhospitals.com',
          phone: '+91-80-2502-4444',
          address: '98, Rustom Bagh, Airport Road',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          specialties: JSON.stringify(['Pediatrics', 'Cardiology', 'Orthopedics', 'Dermatology']),
          accreditations: JSON.stringify(['NABH', 'ISO']),
          description: 'Multi-specialty hospital with patient-centric care',
          status: 'active'
        },
        {
          name: 'AIIMS Delhi',
          email: 'info@aiims.edu',
          phone: '+91-11-2658-8500',
          address: 'Ansari Nagar',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          specialties: JSON.stringify(['All Specialties', 'Research', 'Emergency Care']),
          accreditations: JSON.stringify(['NABH', 'Government']),
          description: 'Premier medical institute and hospital',
          status: 'active'
        }
      ];
      
      for (const hospital of sampleHospitals) {
        await pool.execute(`
          INSERT INTO hospitals 
          (name, email, phone, address, city, state, country, specialties, accreditations, description, status) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          hospital.name, hospital.email, hospital.phone, hospital.address,
          hospital.city, hospital.state, hospital.country, hospital.specialties,
          hospital.accreditations, hospital.description, hospital.status
        ]);
      }
      
      console.log('✅ Sample hospitals added successfully');
    } else {
      console.log('ℹ️ Hospitals already exist in database');
    }
    
    // Create indexes for better performance
    console.log('📊 Creating indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_hospitals_city ON hospitals(city)',
      'CREATE INDEX IF NOT EXISTS idx_hospitals_state ON hospitals(state)',
      'CREATE INDEX IF NOT EXISTS idx_hospitals_status ON hospitals(status)',
      'CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id)',
      'CREATE INDEX IF NOT EXISTS idx_appointments_hospital ON appointments(hospital_id)',
      'CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date)',
      'CREATE INDEX IF NOT EXISTS idx_patients_user ON patients(user_id)'
    ];
    
    for (const indexQuery of indexes) {
      try {
        await pool.execute(indexQuery);
      } catch (error) {
        // Index might already exist, ignore error
      }
    }
    
    console.log('✅ Database setup completed successfully!');
    console.log('🎉 Your IMAP Solution database is ready to use!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

setupDatabase();