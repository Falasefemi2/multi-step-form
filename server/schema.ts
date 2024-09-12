/** @format */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { pgEnum, pgTableCreator, text } from "drizzle-orm/pg-core";

// Assuming you have your Neon connection string in an environment variable
const databaseUrl = process.env.DATABASE_URL!;

// Extract the schema name from the connection string
const schemaMatch = databaseUrl.match(/branch=([^&]+)/);
const schemaName = schemaMatch ? schemaMatch[1] : "public";

// Create a pgTableCreator that uses the correct schema
const pgTable = pgTableCreator((name) => `${schemaName}.form_${name}`);

// Define your enum
export const SkillLevelEnum = pgEnum("SkillLevel", [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
  "Master",
]);

// Define your table
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  firstName: text("firstname"),
  lastName: text("lastname"),
  location: text("location"),
  email: text("email").notNull(),
  password: text("password"),
  skillLevel: SkillLevelEnum("skillLevel").notNull().default("Beginner"),
});

// Create the database connection
const sql = neon(databaseUrl);
export const db = drizzle(sql);
