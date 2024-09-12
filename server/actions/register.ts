/** @format */

"use server";

import { actionClient } from "@/lib/safe-action";
import { RegisterSchema } from "@/types/register-schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../schema";
// import bcrypt from "bcrypt";
import bcrypt from "bcryptjs";

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
      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (existingUser) {
          return {
            error: "Looks like you already have an account. Please log in.",
          };
        }
        await db.insert(users).values({
          firstName: firstName,
          lastName: lastName,
          location: location,
          email: email,
          password: hashedPassword,
          skillLevel: skillLevel,
        });

        return { success: "Account created successfully" };
      } catch (error) {
        console.log(error);
      }
    }
  );
