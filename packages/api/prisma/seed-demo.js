const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const demoEmail = 'admin@takeweb.in';
  const demoPassword = 'admin';
  const hash = await bcrypt.hash(demoPassword, 12);

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      passwordHash: hash,
      role: 'ADMIN',
      isActive: true,
    },
    create: {
      email: demoEmail,
      passwordHash: hash,
      firstName: 'TakeWeb',
      lastName: 'Admin',
      role: 'ADMIN',
      isActive: true,
      department: 'Management',
      workType: 'ONSITE',
      lifecycleStatus: 'ACTIVE',
    },
  });

  console.log('Demo user created:', user.email, '| Role:', user.role);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
