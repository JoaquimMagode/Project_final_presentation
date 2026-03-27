const { pool } = require('./App/backend/config/database');

const checkDatabase = async () => {
  try {
    console.log('Checking database structure and data...\n');
    
    // Check users table
    console.log('=== USERS TABLE ===');
    const [users] = await pool.execute('SELECT * FROM users');
    console.log('Users:', users);
    
    // Check hospitals table structure
    console.log('\n=== HOSPITALS TABLE STRUCTURE ===');
    const [hospitalStructure] = await pool.execute('DESCRIBE hospitals');
    console.log('Hospital table structure:', hospitalStructure);
    
    // Check hospitals data
    console.log('\n=== HOSPITALS DATA ===');
    const [hospitals] = await pool.execute('SELECT * FROM hospitals');
    console.log('Hospitals:', hospitals);
    
    // Check patients table
    console.log('\n=== PATIENTS TABLE ===');
    const [patients] = await pool.execute('SELECT * FROM patients');
    console.log('Patients:', patients);
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    process.exit(0);
  }
};

checkDatabase();