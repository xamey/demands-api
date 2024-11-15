import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true })
    .unique(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  superUser: integer("super_user", { mode: "boolean" }).default(false),
  createdAt: text("date").default(sql`CURRENT_TIMESTAMP`),
});

export const dayoffs = sqliteTable("dayoffs", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true })
    .unique(),
  userId: integer("user_id", { mode: "number" })
    .notNull()
    .references(() => users.id),
  date: text("date").notNull(),
  status: text("status", { enum: ["pending", "approved", "refused"] })
    .notNull()
    .default("pending"),
  createdAt: text("date").default(sql`CURRENT_TIMESTAMP`),
});
