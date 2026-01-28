import prisma from "@/lib/prisma";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    return passwordResetToken;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error in password reset token:", e);
    }
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: { email }
    });

    return passwordResetToken;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error in password reset token:", e);
    }
    return null;
  }
};
