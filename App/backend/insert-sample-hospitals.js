const { pool } = require('./config/database');

async function insertSampleHospitals() {
  try {
    console.log('Inserting sample hospitals...');

    const hospitals = [
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

    for (const hospital of hospitals) {
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

    console.log('Sample hospitals inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting sample hospitals:', error);
    process.exit(1);
  }
}

insertSampleHospitals();