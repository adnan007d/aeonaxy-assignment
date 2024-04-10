"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const dotenv_1 = require("dotenv");
const schema_1 = require("../db/schema");
const util_1 = require("../util/util");
const env_1 = require("../env");
(0, dotenv_1.config)();
const sql = (0, serverless_1.neon)(env_1.env.DATABASE_URL);
const db = (0, neon_http_1.drizzle)(sql);
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
        password: env_1.env.PASSWORD_FOR_USER,
    },
    {
        name: "Admin",
        email: "admin@admin.com",
        password: env_1.env.PASSWORD_FOR_ADMIN,
        role: "ADMIN",
    },
];
usersData.forEach(async (user, i) => {
    usersData[i].password = await (0, util_1.hashPassword)(user.password);
});
async function seed() {
    await db.insert(schema_1.courses).values(coursesData);
    await db.insert(schema_1.users).values(usersData);
}
async function main() {
    try {
        await seed();
        console.log("Seeding completed");
    }
    catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    }
}
main();
