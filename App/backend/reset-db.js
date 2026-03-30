const { pool } = require('./config/database');

const resetDatabase = async () => {
  try {
    console.log('🔄 Resetting database to fix schema issues...');

    // Disable foreign key checks
    await pool.execute('SET FOREIGN_KEY_CHECKS = 0');

    // Drop all tables
    console.log('🗑️ Dropping existing tables...');
    await pool.execute('DROP TABLE IF EXISTS appointments');
    await pool.execute('DROP TABLE IF EXISTS medical_reports');
    await pool.execute('DROP TABLE IF EXISTS payments');
    await pool.execute('DROP TABLE IF EXISTS hospital_employees');
    await pool.execute('DROP TABLE IF EXISTS hospitals');
    await pool.execute('DROP TABLE IF EXISTS patients');
    await pool.execute('DROP TABLE IF EXISTS users');
    await pool.execute('DROP TABLE IF EXISTS system_logs');
    await pool.execute('DROP TABLE IF EXISTS notifications');

    // Re-enable foreign key checks
    await pool.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✅ Database reset completed!');
    console.log('📋 Now run: npm run seed');

  } catch (error) {
    console.error('❌ Database reset failed:', error);
  } finally {
    process.exit(0);
  }
};

resetDatabase();