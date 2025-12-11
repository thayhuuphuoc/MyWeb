"use server";

import prisma from "@/lib/prisma";
import { getUserByEmail } from "@/actions/auth/prisma_data/user";
import { getVerificationTokenByToken } from "@/actions/auth/prisma_data/verificiation-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token không tồn tại!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token đã hết hạn!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email không tồn tại!" };
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
      updatedAt: new Date(),
    }
  });

  await prisma.verificationToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Email đã được xác thực!" };
};
