import prisma from "@/lib/prisma";

export const getTwoFactorConfirmationByUserId = async (
  userId: string
) => {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
      where: { userId }
    });

    return twoFactorConfirmation;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error in two factor confirmation:", e);
    }
    return null;
  }
};
