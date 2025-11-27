import prisma from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
  try {
    return await prisma.user.findUnique({where: {email}});
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error in getUserById:", e);
    }
    return null;
  }
};

export const getUserById = async (id?: string) => {
  try {
    return await prisma.user.findUnique({where: {id}});
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error in getUserById:", e);
    }
    return null;
  }
};

export const getAccountByUserId = async (userId: string) => {
  try {
    return await prisma.account.findFirst({
      where: {userId}
    });
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error in getUserById:", e);
    }
    return null;
  }
};
