"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function registerUser(data: RegisterInput) {
  const validated = registerSchema.safeParse(data);

  if (!validated.success) {
    return { error: "Invalid fields. Please check your input." };
  }

  const { name, email, password } = validated.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "An account with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return { success: "Account created successfully! Please log in." };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

export async function loginUser(data: { email: string; password: string }) {
  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: "/dashboard",
    });
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }
    // Re-throw redirect errors (Next.js NEXT_REDIRECT)
    throw error;
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: "/" });
}
