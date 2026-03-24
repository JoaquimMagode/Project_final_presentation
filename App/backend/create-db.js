const mysql = require('mysql2/promise');
require('dotenv').config();

const createDatabase = async () => {
  try {
    console.log('🔧 Creating database...');
    
    // Connect without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'admin',
      port: process.env.DB_PORT || 3306
    });

    // Create database
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'imap_solution_db'}`);
    console.log(`✅ Database '${process.env.DB_NAME || 'imap_solution_db'}' created successfully!`);
    
    await connection.end();
    
    console.log('🎉 Database setup complete! Now run: npm run seed');
    
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    console.log('\n📋 Manual steps:');
    console.log('1. Open MySQL Workbench or command line');
    console.log('2. Run: CREATE DATABASE imap_solution_db;');
    console.log('3. Then run: npm run seed');
  }
  
  process.exit(0);
};

createDatabase();