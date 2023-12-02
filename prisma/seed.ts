import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.customer.upsert({
    where: { email: "ichiro@example.com" },
    update: {},
    create: {
      email: "ichiro@example.com",
      name: "Ichiro",
      address: "Tokyo",
      registered_at: new Date(),
      total_payment_from_last_year: 0,
    },
  });

  await prisma.customer.upsert({
    where: { email: "jiro@example.com" },
    update: {},
    create: {
      email: "jiro@example.com",
      name: "Jiro",
      address: "Tokyo",
      registered_at: new Date(),
      total_payment_from_last_year: 50,
    },
  });

  await prisma.customer.upsert({
    where: { email: "saburo@example.com" },
    update: {},
    create: {
      email: "saburo@example.com",
      name: "Saburo",
      address: "Osaka",
      registered_at: new Date(),
      total_payment_from_last_year: 100,
    },
  });

  await prisma.customer.upsert({
    where: { email: "shiro@example.com" },
    update: {},
    create: {
      email: "shiro@example.com",
      name: "Shiro",
      address: "Kyoto",
      registered_at: new Date(),
      total_payment_from_last_year: 10000,
    },
  });

  // order
  await prisma.order.upsert({
    where: { id: 1 },
    update: {},
    create: {
      total_in_cents: 20,
      ordered_at: new Date(),
      order_id: "A5",
      customer_id: 1,
    },
  });
  await prisma.order.upsert({
    where: { id: 2 },
    update: {},
    create: {
      total_in_cents: 30,
      ordered_at: new Date(),
      order_id: "A4",
      customer_id: 1,
    },
  });
  await prisma.order.upsert({
    where: { id: 3 },
    update: {},
    create: {
      total_in_cents: 99,
      ordered_at: new Date(),
      order_id: "A3",
      customer_id: 1,
    },
  });
  await prisma.order.upsert({
    where: { id: 4 },
    update: {},
    create: {
      total_in_cents: 110,
      ordered_at: new Date(),
      order_id: "A2",
      customer_id: 1,
    },
  });
  await prisma.order.upsert({
    where: { id: 5 },
    update: {},
    create: {
      total_in_cents: 20,
      ordered_at: new Date(),
      order_id: "A1",
      customer_id: 1,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
