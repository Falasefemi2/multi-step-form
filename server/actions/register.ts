/** @format */

"use server";

import { actionClient } from "@/lib/safe-action";
import { RegisterSchema } from "@/types/register-schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const RegisterAccounnt = actionClient
  .schema(RegisterSchema)
  .action(
    async ({
      parsedInput: {
        email,
        firstName,
        skillLevel,
        lastName,
        location,
        password,
      },
    }) => {
      try {
        // Check if user already exists in your database
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (existingUser) {
          return {
            error: "Looks like you already have an account. Please log in.",
          };
        }

        // Create user in Clerk
        const clerkUser = await clerkClient.users.createUser({
          emailAddress: [email],
          password,
          firstName,
          lastName,
        });

        // Insert user into your database
        await db.insert(users).values({
          firstName,
          lastName,
          location,
          email,
          password: clerkUser.id, // Store Clerk user ID instead of password
          skillLevel,
        });

        return { success: "Account created successfully" };
      } catch (error) {
        console.error(error);
        return { error: "An error occurred while creating the account" };
      }
    }
  );
