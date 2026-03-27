const bcrypt = require('bcryptjs');
const { pool } = require('./App/backend/config/database');

const fixHospitalLogin = async () => {
  try {
    console.log('🔧 Fixing hospital login issue...');

    // First, let's check if the hospital admin user exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      ['hospital@demo.com']
    );

    if (existingUsers.length === 0) {
      console.log('Creating hospital admin user...');
      const hashedPassword = await bcrypt.hash('password', 12);
      
      const [result] = await pool.execute(
        'INSERT INTO users (email, password, name, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        ['hospital@demo.com', hashedPassword, 'Hospital Admin', '+91-11-4277-6222', 'hospital_admin', 'active']
      );
      
      console.log(`✅ Created hospital admin user with ID: ${result.insertId}`);
    } else {
      console.log('✅ Hospital admin user already exists');
    }

    // Check if hospitals table has the correct structure
    try {
      const [hospitalStructure] = await pool.execute('DESCRIBE hospitals');
      const hasContactEmail = hospitalStructure.some(col => col.Field === 'contact_email');
      const hasPassword = hospitalStructure.some(col => col.Field === 'password');
      
      if (!hasContactEmail || !hasPassword) {
        console.log('Updating hospitals table structure...');
        
        if (!hasContactEmail) {
          await pool.execute('ALTER TABLE hospitals ADD COLUMN contact_email VARCHAR(255)');
        }
        if (!hasPassword) {
          await pool.execute('ALTER TABLE hospitals ADD COLUMN password VARCHAR(255)');
        }
        
        console.log('✅ Updated hospitals table structure');
      }
    } catch (error) {
      console.log('Creating hospitals table...');
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS hospitals (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          address TEXT,
          specializations TEXT,
          contact_email VARCHAR(255),
          contact_phone VARCHAR(20),
          password VARCHAR(255),
          admin_id INT,
          status ENUM('active', 'inactive') DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
        )
      `);
      console.log('✅ Created hospitals table');
    }

    // Insert or update hospital data with login credentials
    const hashedPassword = await bcrypt.hash('password', 12);
    
    const hospitals = [
      {
        name: 'Apollo Hospitals Mumbai',
        location: 'Mumbai',
        address: 'Mumbai, India',
        specializations: 'Cardiology, Orthopedics, Neurology',
        contact_email: 'hospital@demo.com',
        contact_phone: '+91-22-6767-4444',
        password: hashedPassword
      },
      {
        name: 'Fortis Memorial Research Institute',
        location: 'Delhi',
        address: 'Delhi, India',
        specializations: 'Cardiology, Neurosurgery, Oncology',
        contact_email: 'fortis@demo.com',
        contact_phone: '+91-11-4277-6222',
        password: hashedPassword
      }
    ];

    for (const hospital of hospitals) {
      // Check if hospital already exists
      const [existing] = await pool.execute(
        'SELECT id FROM hospitals WHERE contact_email = ?',
        [hospital.contact_email]
      );

      if (existing.length === 0) {
        const [result] = await pool.execute(
          'INSERT INTO hospitals (name, location, address, specializations, contact_email, contact_phone, password, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [hospital.name, hospital.location, hospital.address, hospital.specializations, hospital.contact_email, hospital.contact_phone, hospital.password, 'active']
        );
        console.log(`✅ Created hospital: ${hospital.name} (ID: ${result.insertId})`);
      } else {
        // Update existing hospital with password
        await pool.execute(
          'UPDATE hospitals SET password = ?, status = ? WHERE contact_email = ?',
          [hospital.password, 'active', hospital.contact_email]
        );
        console.log(`✅ Updated hospital: ${hospital.name}`);
      }
    }

    console.log('\n🎉 Hospital login fix completed!');
    console.log('\n📋 Hospital Login Credentials:');
    console.log('Email: hospital@demo.com');
    console.log('Password: password');
    console.log('\nAlternative hospital logins:');
    console.log('Email: fortis@demo.com');
    console.log('Password: password');

  } catch (error) {
    console.error('❌ Error fixing hospital login:', error);
  } finally {
    process.exit(0);
  }
};

fixHospitalLogin();