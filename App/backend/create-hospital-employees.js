const { pool } = require('./config/database');

const createHospitalEmployeesTable = async () => {
  try {
    console.log('🏥 Creating hospital_employees table...');

    // Create hospital_employees table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS hospital_employees (
        id INT PRIMARY KEY AUTO_INCREMENT,
        hospital_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        position VARCHAR(100) NOT NULL,
        department VARCHAR(100),
        employee_id VARCHAR(50),
        hire_date DATE,
        termination_date DATE,
        salary DECIMAL(10,2),
        employment_type ENUM('full_time', 'part_time', 'contract', 'intern') DEFAULT 'full_time',
        shift ENUM('morning', 'evening', 'night', 'rotating') DEFAULT 'morning',
        qualifications TEXT,
        emergency_contact_name VARCHAR(255),
        emergency_contact_phone VARCHAR(20),
        address TEXT,
        status ENUM('active', 'inactive', 'terminated', 'on_leave') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
        INDEX idx_hospital_id (hospital_id),
        INDEX idx_employee_id (employee_id),
        INDEX idx_department (department),
        INDEX idx_position (position),
        INDEX idx_status (status),
        INDEX idx_name (name)
      )
    `);

    console.log('✅ Hospital employees table created successfully');

    // Add some sample employees for the first hospital
    const sampleEmployees = [
      {
        hospital_id: 1,
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@apollomumbai.com',
        phone: '+91-22-1234-5678',
        position: 'Cardiologist',
        department: 'Cardiology',
        employee_id: 'APL001',
        hire_date: '2023-01-15',
        salary: 150000.00,
        employment_type: 'full_time',
        shift: 'morning',
        qualifications: 'MD Cardiology, MBBS',
        emergency_contact_name: 'John Johnson',
        emergency_contact_phone: '+91-22-9876-5432',
        address: 'Mumbai, Maharashtra'
      },
      {
        hospital_id: 1,
        name: 'Nurse Mary Smith',
        email: 'mary.smith@apollomumbai.com',
        phone: '+91-22-2345-6789',
        position: 'Senior Nurse',
        department: 'Emergency',
        employee_id: 'APL002',
        hire_date: '2022-06-01',
        salary: 45000.00,
        employment_type: 'full_time',
        shift: 'night',
        qualifications: 'BSc Nursing',
        emergency_contact_name: 'Robert Smith',
        emergency_contact_phone: '+91-22-8765-4321',
        address: 'Mumbai, Maharashtra'
      },
      {
        hospital_id: 2,
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@fortismemorial.com',
        phone: '+91-11-3456-7890',
        position: 'Neurosurgeon',
        department: 'Neurosurgery',
        employee_id: 'FMR001',
        hire_date: '2021-03-10',
        salary: 200000.00,
        employment_type: 'full_time',
        shift: 'morning',
        qualifications: 'MCh Neurosurgery, MS General Surgery, MBBS',
        emergency_contact_name: 'Priya Kumar',
        emergency_contact_phone: '+91-11-7654-3210',
        address: 'Delhi, India'
      }
    ];

    console.log('👥 Adding sample employees...');
    for (const employee of sampleEmployees) {
      await pool.execute(`
        INSERT INTO hospital_employees (
          hospital_id, name, email, phone, position, department, employee_id,
          hire_date, salary, employment_type, shift, qualifications,
          emergency_contact_name, emergency_contact_phone, address, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        employee.hospital_id, employee.name, employee.email, employee.phone,
        employee.position, employee.department, employee.employee_id,
        employee.hire_date, employee.salary, employee.employment_type,
        employee.shift, employee.qualifications, employee.emergency_contact_name,
        employee.emergency_contact_phone, employee.address, 'active'
      ]);
      console.log(`✅ Added employee: ${employee.name}`);
    }

    console.log('🎉 Hospital employees table setup completed!');

  } catch (error) {
    console.error('❌ Error creating hospital employees table:', error);
  } finally {
    process.exit(0);
  }
};

// Run the migration
createHospitalEmployeesTable();