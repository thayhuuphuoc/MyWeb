import prisma from "@/lib/prisma";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findUnique({
      where: { token }
    });

    return twoFactorToken;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error in two factor token:", e);
    }
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findFirst({
      where: { email }
    });

    return twoFactorToken;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error in two factor token:", e);
    }
    return null;
  }
};
