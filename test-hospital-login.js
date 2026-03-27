const fetch = require('node-fetch');

const testHospitalLogin = async () => {
  try {
    console.log('Testing hospital login...');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'hospital@demo.com',
        password: 'password'
      })
    });

    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Hospital login successful!');
      console.log('User role:', data.data.user.role);
    } else {
      console.log('❌ Hospital login failed:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing hospital login:', error.message);
  }
};

testHospitalLogin();