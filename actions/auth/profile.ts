"use server";

import * as z from "zod";
import prisma from "@/lib/prisma";
import {AvatarSchema, ProfileSchema, SettingsSchema} from "@/schemas/auth.schema";
import { getUserByEmail, getUserById } from "@/actions/auth/prisma_data/user";
import { currentUser } from "@/lib/auth";
import {unstable_update, signOut} from "@/auth";

export const getProfile = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "Auth expired" }
  }
  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Không tìm thấy người dùng" }
  }

  dbUser.password = null
  const updatedUser = {...user, ...dbUser}
  await unstable_update({user: updatedUser})

  return { success: "Success", dbUser: updatedUser }
}

export const updateProfile = async (
  values: z.infer<typeof ProfileSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Auth expired" }
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Không tìm thấy người dùng" }
  }

  const updatedUser = await prisma.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
      updatedAt: new Date(),
    }
  });

  updatedUser.password = null
  await unstable_update({user: {...user, ...updatedUser}})

  return { success: "Cập nhật hồ sơ thành công !", updatedUser }
}

export const updateProfileImage = async (
  values: z.infer<typeof AvatarSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Auth expired" }
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Không tìm thấy người dùng" }
  }

  const updatedUser = await prisma.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
      updatedAt: new Date(),
    }
  });

  updatedUser.password = null
  await unstable_update({user: {...user, ...updatedUser}})

  return { success: "Cập nhật ảnh đại diện thành công!", updatedUser }
}
