import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { courses, users } from "@/db/schema";
import { hashPassword } from "@/util/util";

config();

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql);

const coursesData = [
  {
    name: "Math 101",
    category: "Math",
    description: "Basic math course",
    price: 100,
    duration: 30,
    published: true,
  },
  {
    name: "English 101",
    category: "English",
    description: "Basic english course",
    price: 100,
    duration: 30,
    published: true,
  },
  {
    name: "Science 101",
    category: "Science",
    description: "Basic science course",
    price: 100,
    duration: 30,
    published: true,
  },
  {
    name: "History 101",
    category: "History",
    description: "Basic history course",
    price: 100,
    duration: 30,
    published: true,
  },
  {
    name: "Math 201",
    category: "Math",
    description: "Intermediate math course",
    price: 200,
    duration: 60,
    published: true,
  },
  {
    name: "English 201",
    category: "English",
    description: "Intermediate english course",
    price: 200,
    duration: 60,
    published: true,
  },
  {
    name: "Science 201",
    category: "Science",
    description: "Intermediate science course",
    price: 200,
    duration: 60,
    published: true,
  },
  {
    name: "History 201",
    category: "History",
    description: "Intermediate history course",
    price: 200,
    duration: 60,
    published: true,
  },
];

const usersData = [
  {
    name: "John Doe",
    email: "johndoe@user.com",
    password: "Pass@123",
  },

  {
    name: "Admin",
    email: "admin@admin.com",
    password: "Admin@123",
    role: "ADMIN" as const,
  },
];

usersData.forEach(async (user, i) => {
  usersData[i]!.password = await hashPassword(user.password);
});

async function seed() {
  await db.insert(courses).values(coursesData);
  await db.insert(users).values(usersData);
}

async function main() {
  try {
    await seed();

    console.log("Seeding completed");
  } catch (error) {
    console.error("Error during seeding:", error);

    process.exit(1);
  }
}

main();
