import { Resend } from "resend";
import siteMetadata from "@/config/siteMetadata";
import nodemailer from 'nodemailer'
import {TContactSchema} from "@/schemas/contact.schema";

// const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;
const sendMail = (mailOptions: any) => {
  return new Promise((resolve,reject)=> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_GMAIL_APP_PASSWORD,
      },
    })

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("error is: " + error)
        resolve(false);
      } else {
        console.log('Email sent: ' + info.response)
        resolve(true);
      }
    })
  })
}

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  // await resend.emails.send({
  //   from: `${process.env.NEXT_PUBLIC_APP_URL} <onboarding@resend.dev>`,
  //   to: email,
  //   subject: `2FA Code - ${process.env.NEXT_PUBLIC_APP_URL}`,
  //   html: `<p>Code 2FA của bạn là: ${token}</p>`
  // });

  await sendMail({
    from: `${siteMetadata.logoTitle} <${process.env.NODE_MAILER_EMAIL}>`,
    to: email,
    subject: `2FA Code "${token}" - ${process.env.NEXT_PUBLIC_APP_URL}`,
    html: `<p>Code 2FA của bạn là: ${token}</p>`
  })
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`
  await sendMail({
    from: `${siteMetadata.logoTitle} <${process.env.NODE_MAILER_EMAIL}>`,
    to: email,
    subject: `Đặt lại mật khẩu - ${process.env.NEXT_PUBLIC_APP_URL}`,
    html: `<p>Click <a href="${resetLink}">vào đây</a> để đặt lại mật khẩu.</p>`
  })
};

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  await sendMail({
    from: `${siteMetadata.logoTitle} <${process.env.NODE_MAILER_EMAIL}>`,
    to: email,
    subject: `Xác thực email - ${process.env.NEXT_PUBLIC_APP_URL}`,
    html: `<p>Click <a href="${confirmLink}">vào đây</a> để xác thực email.</p>`
  })
};

export const sendContact = async (data: TContactSchema) => {
  const mailList = [
    siteMetadata.owner_email
  ];

  const content = [
    `<p>Họ tên: ${data.name}</p>`,
    `<p>Địa chỉ: ${data.address}</p>`,
    `<p>Điện thoại: ${data.phone}</p>`,
    `<p>Nội dung: ${data.note}</p>`,
    data.email ? `<p>Email: ${data.email}</p>` : ''
  ]

  await sendMail({
    from: `${siteMetadata.logoTitle} <${process.env.NODE_MAILER_EMAIL}>`,
    to: mailList,
    subject: `Đăng ký tư vấn - ${siteMetadata.logoTitle}`,
    html: content.join('')
  })
};
