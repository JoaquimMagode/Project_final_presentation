const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

const addHospitalPassword = async () => {
  try {
    console.log('🔧 Adding password column to hospitals table...');

    // Add password column to hospitals table
    await pool.execute(`
      ALTER TABLE hospitals 
      ADD COLUMN password VARCHAR(255) AFTER contact_phone
    `);

    console.log('✅ Password column added successfully');

    // Hash the default password
    const hashedPassword = await bcrypt.hash('password', 12);

    // Update all existing hospitals with the hashed password
    await pool.execute(`
      UPDATE hospitals 
      SET password = ?
    `, [hashedPassword]);

    console.log('✅ Default passwords set for all hospitals');
    console.log('\n📋 Hospital Login Credentials:');
    
    // Get all hospitals to show login credentials
    const [hospitals] = await pool.execute('SELECT contact_email, name FROM hospitals');
    
    hospitals.forEach(hospital => {
      console.log(`${hospital.name}: ${hospital.contact_email} / password`);
    });

  } catch (error) {
    console.error('❌ Error adding hospital password:', error);
  } finally {
    process.exit(0);
  }
};

// Run the migration
addHospitalPassword();