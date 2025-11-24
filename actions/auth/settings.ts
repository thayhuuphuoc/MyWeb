"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";
import {SettingsSchema} from "@/schemas/auth.schema";
import {getUserByEmail, getUserById} from "@/actions/auth/prisma_data/user";
import {currentUser} from "@/lib/auth";
import {generateVerificationToken} from "@/lib/tokens";
import {sendVerificationEmail} from "@/lib/mail";
import {unstable_update} from "@/auth";

export const settings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Auth expired" }
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Không tìm thấy người dùng" }
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email đã được sử dụng!" }
    }

    const verificationToken = await generateVerificationToken(
      values.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Email xác minh đã được gửi!" };
  }

  // compare password
  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordsMatch) {
      return { error: "Mật khẩu hiện tại không chính xác!" };
    }

    values.password = await bcrypt.hash(
      values.newPassword,
      10,
    );
    values.newPassword = undefined;
  }

  // case password is not set
  if (values.newPassword && !dbUser.password){
    values.password = await bcrypt.hash(
      values.newPassword,
      10,
    );
  }

  // delete schema form before update
  delete values.newPassword
  delete values.confirm_newPassword
  delete values.isPasswordSet

  const updatedUser = await prisma.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
      updatedAt: new Date(),
    }
  });

  updatedUser.password = null
  await unstable_update({user: {...user, ...updatedUser, isPasswordSet: true}})

  return { success: "Cập nhật bảo mật thành công!" }
}
