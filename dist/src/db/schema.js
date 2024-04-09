"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRecovery = exports.enrollments = exports.courses = exports.users = exports.rolesEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const pg_core_2 = require("drizzle-orm/pg-core");
exports.rolesEnum = (0, pg_core_2.pgEnum)("roles", ["ADMIN", "USER"]);
exports.users = (0, pg_core_2.pgTable)("users", {
    id: (0, pg_core_2.serial)("id").primaryKey(),
    name: (0, pg_core_2.text)("name").notNull(),
    email: (0, pg_core_2.text)("email").notNull().unique(),
    password: (0, pg_core_2.text)("password").notNull(),
    image: (0, pg_core_2.text)("image"),
    role: (0, exports.rolesEnum)("role").notNull().default("USER"),
    created_at: (0, pg_core_2.timestamp)("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updated_at: (0, pg_core_2.timestamp)("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});
// For Category we can create another table and reference it
exports.courses = (0, pg_core_2.pgTable)("courses", {
    id: (0, pg_core_2.serial)("id").primaryKey(),
    name: (0, pg_core_2.text)("name").notNull(),
    description: (0, pg_core_2.text)("description").notNull(),
    category: (0, pg_core_2.text)("category").notNull(),
    image: (0, pg_core_2.text)("image"),
    price: (0, pg_core_2.integer)("price").notNull(),
    duration: (0, pg_core_2.integer)("duration").notNull(),
    published: (0, pg_core_1.boolean)("published").notNull().default(false),
    created_at: (0, pg_core_2.timestamp)("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updated_at: (0, pg_core_2.timestamp)("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});
exports.enrollments = (0, pg_core_2.pgTable)("enrollments", {
    enrollment_id: (0, pg_core_2.serial)("enrollment_id").primaryKey(),
    user_id: (0, pg_core_2.integer)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    course_id: (0, pg_core_2.integer)("course_id")
        .notNull()
        .references(() => exports.courses.id, { onDelete: "cascade" }),
    created_at: (0, pg_core_2.timestamp)("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updated_at: (0, pg_core_2.timestamp)("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (t) => ({
    pk: (0, pg_core_2.primaryKey)({ columns: [t.user_id, t.course_id] }),
}));
exports.passwordRecovery = (0, pg_core_2.pgTable)("password_recovery", {
    id: (0, pg_core_2.serial)("id").primaryKey(),
    user_id: (0, pg_core_2.integer)("user_id")
        .notNull()
        .references(() => exports.users.id),
    token: (0, pg_core_2.text)("token").notNull(),
    created_at: (0, pg_core_2.timestamp)("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updated_at: (0, pg_core_2.timestamp)("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});
