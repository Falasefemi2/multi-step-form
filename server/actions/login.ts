/** @format */

"use server";

import { LoginSchema } from "@/types/login-schema";
import { actionClient } from "@/lib/safe-action";
import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const LoginAccount = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      // Check if a user is already logged in
      const { userId } = auth();

      if (userId) {
        return { error: "You are already logged in" };
      }

      // Attempt to find the user by email
      const users = await clerkClient.users.getUserList({
        emailAddress: [email],
      });

      if (users.data.length === 0) {
        return { error: "No user found with this email" };
      }

      const user = users.data[0];

      // Verify the password
      try {
        await clerkClient.users.verifyPassword({
          userId: user.id,
          password: password,
        });

        return {
          data: { success: "Logged in successfully.", redirectUrl: "/" },
        };
      } catch (error) {
        console.error("Authentication error:", error);
        return { error: "Invalid email or password. Please try again." };
      }
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      console.error(error);
      return { error: "An unexpected error occurred" };
    }
  });
