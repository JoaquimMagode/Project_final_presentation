const bcrypt = require('bcryptjs');
const prisma = require('./config/prisma');

const createHospitalAdmins = async () => {
  try {
    console.log('🏥 Creating admin users for all hospitals...\n');

    const hospitals = await prisma.hospitals.findMany({
      select: { id: true, name: true, email: true, admin_id: true }
    });

    if (hospitals.length === 0) {
      console.log('❌ No hospitals found. Run seed first.');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 12);

    for (const hospital of hospitals) {
      // Generate email from hospital name
      const slug = hospital.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const email = `admin.${slug}@imapsolution.com`;

      // Check if user already exists
      const existing = await prisma.users.findUnique({ where: { email } });
      if (existing) {
        // Link to hospital if not already linked
        if (!hospital.admin_id) {
          await prisma.hospitals.update({ where: { id: hospital.id }, data: { admin_id: existing.id } });
          console.log(`🔗 Linked existing user to ${hospital.name}`);
        } else {
          console.log(`⏭️  Skipped (already exists): ${email}`);
        }
        continue;
      }

      // Create admin user
      const user = await prisma.users.create({
        data: {
          email,
          password: hashedPassword,
          name: hospital.name,
          role: 'hospital_admin',
          status: 'active',
        }
      });

      // Link user to hospital
      await prisma.hospitals.update({
        where: { id: hospital.id },
        data: { admin_id: user.id }
      });

      console.log(`✅ ${hospital.name}`);
      console.log(`   Username : ${email}`);
      console.log(`   Password : admin123`);
      console.log(`   User ID  : ${user.id}\n`);
    }

    console.log('\n🎉 Done! All hospital admin accounts created.');
    console.log('Password for all accounts: admin123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

createHospitalAdmins();
