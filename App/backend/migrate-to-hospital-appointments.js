const { pool } = require('./config/database');

const migrateToHospitalAppointments = async () => {
  try {
    console.log('🔄 Starting migration to hospital-only appointments...');

    // Disable foreign key checks temporarily
    await pool.execute('SET FOREIGN_KEY_CHECKS = 0');

    // Drop doctors table if it exists
    console.log('🗑️ Removing doctors table...');
    await pool.execute('DROP TABLE IF EXISTS doctors');

    // Update appointments table structure
    console.log('📋 Updating appointments table...');
    
    // Check if appointments table exists
    const [tables] = await pool.execute("SHOW TABLES LIKE 'appointments'");
    
    if (tables.length > 0) {
      // Get current table structure
      const [columns] = await pool.execute('DESCRIBE appointments');
      const columnNames = columns.map(col => col.Field);

      // Remove doctor-related columns if they exist
      if (columnNames.includes('doctor_id')) {
        await pool.execute('ALTER TABLE appointments DROP COLUMN doctor_id');
        console.log('✅ Removed doctor_id column');
      }
      
      if (columnNames.includes('doctor_name')) {
        await pool.execute('ALTER TABLE appointments DROP COLUMN doctor_name');
        console.log('✅ Removed doctor_name column');
      }

      // Add new columns if they don't exist
      if (!columnNames.includes('type')) {
        await pool.execute(`
          ALTER TABLE appointments 
          ADD COLUMN type ENUM('consultation', 'procedure', 'follow_up', 'telemedicine') DEFAULT 'consultation'
        `);
        console.log('✅ Added type column');
      }

      if (!columnNames.includes('reason')) {
        await pool.execute('ALTER TABLE appointments ADD COLUMN reason TEXT NOT NULL DEFAULT "General consultation"');
        console.log('✅ Added reason column');
      }

      if (!columnNames.includes('consultation_fee')) {
        await pool.execute('ALTER TABLE appointments ADD COLUMN consultation_fee DECIMAL(10,2)');
        console.log('✅ Added consultation_fee column');
      }

      // Update status enum to include new values
      await pool.execute(`
        ALTER TABLE appointments 
        MODIFY COLUMN status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'pending'
      `);
      console.log('✅ Updated status enum values');

      // Update existing appointments to have default values
      await pool.execute(`
        UPDATE appointments 
        SET reason = COALESCE(notes, 'General consultation'), 
            type = 'consultation',
            status = CASE 
              WHEN status = 'scheduled' THEN 'confirmed'
              ELSE status 
            END
        WHERE reason IS NULL OR reason = ''
      `);
      console.log('✅ Updated existing appointment data');
    }

    // Update medical_reports table to remove doctor references
    console.log('📋 Updating medical_reports table...');
    const [reportTables] = await pool.execute("SHOW TABLES LIKE 'medical_reports'");
    
    if (reportTables.length > 0) {
      const [reportColumns] = await pool.execute('DESCRIBE medical_reports');
      const reportColumnNames = reportColumns.map(col => col.Field);

      if (reportColumnNames.includes('doctor_id')) {
        await pool.execute('ALTER TABLE medical_reports DROP COLUMN doctor_id');
        console.log('✅ Removed doctor_id from medical_reports');
      }
    }

    // Re-enable foreign key checks
    await pool.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('🎉 Migration completed successfully!');
    console.log('\n📋 Changes made:');
    console.log('- Removed doctors table');
    console.log('- Removed doctor references from appointments');
    console.log('- Added appointment types (consultation, procedure, follow_up, telemedicine)');
    console.log('- Added reason field for appointments');
    console.log('- Added consultation_fee field');
    console.log('- Updated appointment status values');
    console.log('\n✨ Your database is now ready for direct hospital appointments!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    process.exit(0);
  }
};

// Run migration
migrateToHospitalAppointments();