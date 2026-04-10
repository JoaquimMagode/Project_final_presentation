const bcrypt = require('bcryptjs');
const prisma = require('./config/prisma');

async function fixEmployeePassword() {
  const email = 'joaquimcesarmagode@gmail.com';

  // Find the employee record to get their position
  const emp = await prisma.hospital_employees.findFirst({ where: { email } });
  if (!emp) {
    console.log('No employee record found for', email);
    process.exit(1);
  }

  const roleSlug = (emp.position || 'employee').toLowerCase().replace(/\s+/g, '');
  const defaultPassword = `${roleSlug}@1234`;
  const hashed = await bcrypt.hash(defaultPassword, 12);

  // Check if user account exists
  const existing = await prisma.users.findUnique({ where: { email } });

  if (existing) {
    await prisma.users.update({ where: { email }, data: { password: hashed, role: 'hospital_admin', status: 'active' } });
    console.log(`✅ Password reset for ${email}`);
  } else {
    await prisma.users.create({
      data: { email, password: hashed, name: emp.name, phone: emp.phone || null, role: 'hospital_admin', status: 'active' }
    });
    console.log(`✅ User account created for ${email}`);
  }

  console.log(`🔑 Password: ${defaultPassword}`);
  await prisma.$disconnect();
}

fixEmployeePassword().catch(e => { console.error(e); process.exit(1); });
