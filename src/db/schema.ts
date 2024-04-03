import {
  integer,
  text,
  serial,
  pgEnum,
  pgTable,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["ADMIN", "USER"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  image: text("image"),
  role: rolesEnum("role").notNull().default("USER"),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// For Category we can create another table and reference it
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  image: text("image"),
  price: integer("price").notNull(),
  duration: integer("duration").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const enrollments = pgTable(
  "enrollments",
  {
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id),
    course_id: integer("course_id")
      .notNull()
      .references(() => courses.id),
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.user_id, t.course_id] }),
  })
);
