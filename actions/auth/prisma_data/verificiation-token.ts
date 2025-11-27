import prisma from "@/lib/prisma";

export const getVerificationTokenByToken = async (
  token: string
) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    return verificationToken;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error in verification token:", e);
    }
    return null;
  }
}

export const getVerificationTokenByEmail = async (
  email: string
) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { email }
    });

    return verificationToken;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error in verification token:", e);
    }
    return null;
  }
}
