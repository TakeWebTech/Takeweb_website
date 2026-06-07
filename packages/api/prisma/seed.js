const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin@123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@takeweb.com' },
    update: {},
    create: {
      email: 'admin@takeweb.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'TakeWeb',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', admin.email, '| Role:', admin.role);
  console.log('   Login: admin@takeweb.com / Admin@123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
