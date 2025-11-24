import * as z from "zod";
import { UserRole } from "@prisma/client";
import validator, {isMongoId} from "validator";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const ProfileSchema = z.object({
  name: z.optional(z.string().max(40)),
  image: z.optional(z.string()),

  visible: z.optional(z.boolean()),
  phoneNum: z.optional(z.string().refine((phone) => {
    return validator.isMobilePhone(phone, 'vi-VN')
  }, {
    message: 'Số điện thoại không hợp lệ '
  })),
})

export const AvatarSchema = z.object({
  image: z
    .any()
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
});


export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  isPasswordSet: z.optional(z.boolean()),
  role: z.nativeEnum(UserRole),
  email: z.optional(z.string().email()),
  password: z.optional(z.string()),
  newPassword: z.optional(
    z.string()
      .min(8, { message: 'Yêu cầu tối thiểu 8 ký tự' })
      .max(64, {
        message: 'Tối đa 64 ký ự',
      })
      .refine(
        (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(value ?? ''),
        'Mật khẩu phải chứa cả số và chữ'
      ),
  ),
  confirm_newPassword: z.optional(z.string()),
})
  .refine((data) => {
    return !(data.newPassword && data.newPassword !== data.confirm_newPassword);
  }, {
    message: "Mật khẩu mới chưa khớp nhau",
    path: ["confirm_newPassword"]
  })
  .refine((data) => {
    if (!data.isPasswordSet){
      return !!data.newPassword
    }

    return !(data.password && !data.newPassword);
  }, {
    message: "Cần có mật khẩu mới!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if(!data.isPasswordSet) return true

    return !(data.newPassword && !data.password);
  }, {
    message: "Cần có mật khẩu hiện tại!",
    path: ["password"]
  })

export const NewPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: 'Yêu cầu tối thiểu 8 ký tự' })
    .max(64, {
      message: 'Tối đa 64 ký ự',
    })
    .refine(
      (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(value ?? ''),
      'Mật khẩu phải chứa cả số và chữ'
    ),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Cần phải có email",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Cần phải có email",
  }),
  password: z.string()
    .min(8, { message: 'Yêu cầu tối thiểu 8 ký tự' })
    .max(64, {
      message: 'Tối đa 64 ký ự',
    })
    .refine(
      (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(value ?? ''),
      'Mật khẩu phải chứa cả số và chữ'
    ),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Cần phải có email",
  }),
  password: z.string()
    .min(8, { message: 'Yêu cầu tối thiểu 8 ký tự' })
    .max(64, {
      message: 'Tối đa 64 ký ự',
    })
    .refine(
      (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(value ?? ''),
      'Mật khẩu phải chứa cả số và chữ'
    ),
  name: z.string().min(1, {
      message: "Tên là bắt buộc",
  }),
});
