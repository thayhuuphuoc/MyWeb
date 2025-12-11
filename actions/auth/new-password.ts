"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { NewPasswordSchema } from "@/schemas/auth.schema";
import { getPasswordResetTokenByToken } from "@/actions/auth/prisma_data/password-reset-token";
import { getUserByEmail } from "@/actions/auth/prisma_data/user";
import prisma from "@/lib/prisma";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema> ,
  token?: string | null,
) => {
  if (!token) {
    return { error: "Thiếu token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Các trường không hợp lệ!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Thiếu token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token đã hết hạn!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email không tồn tại!" }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
      updatedAt: new Date(),
    },
  });

  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Password đã được cập nhật!" };
};
