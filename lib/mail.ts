import siteMetadata from "@/config/siteMetadata";
import nodemailer from 'nodemailer'
import {TContactSchema} from "@/schemas/contact.schema";

const domain = process.env.NEXT_PUBLIC_APP_URL;

// Xác định SMTP config dựa trên email provider
const getSmtpConfig = () => {
  const email = process.env.NODE_MAILER_EMAIL || '';
  
  // Check if explicitly set to Zoho via environment variable
  const forceZoho = process.env.ZOHO_SMTP_HOST || process.env.ZOHO_SMTP_PORT;
  
  // Check if email domain is Zoho
  const isZohoDomain = email.includes('@zoho.com') || email.includes('@zoho.eu') || email.includes('@zoho.in') || email.includes('@zohomail.com');
  
  // Use Zoho if domain matches OR if Zoho SMTP config is explicitly set
  const isZoho = isZohoDomain || forceZoho;
  
  if (process.env.NODE_ENV === 'development') {
    console.log("[getSmtpConfig] Email provider detection:", {
      email: email,
      isZohoDomain: isZohoDomain,
      hasZohoConfig: !!forceZoho,
      detectedProvider: isZoho ? 'Zoho' : 'Gmail'
    });
  }
  
  if (isZoho) {
    // Zoho Mail SMTP configuration
    return {
      host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
      port: parseInt(process.env.ZOHO_SMTP_PORT || '465'),
      secure: process.env.ZOHO_SMTP_PORT === '587' ? false : true,
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_APP_PASSWORD || process.env.NODE_MAILER_GMAIL_APP_PASSWORD,
      },
    };
  } else {
    // Gmail SMTP configuration (default)
    return {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_GMAIL_APP_PASSWORD || process.env.NODE_MAILER_APP_PASSWORD,
      },
    };
  }
};

const sendMail = (mailOptions: any) => {
  return new Promise<boolean>((resolve,reject)=> {
    // Check if email configuration is set
    if (!process.env.NODE_MAILER_EMAIL) {
      const error = new Error("Email configuration is not set. Please set NODE_MAILER_EMAIL in environment variables.");
      if (process.env.NODE_ENV === 'development') {
        console.error("[sendMail] Configuration error:", error.message);
      }
      reject(error);
      return;
    }

    // Check password - prioritize NODE_MAILER_APP_PASSWORD for Zoho
    const email = process.env.NODE_MAILER_EMAIL || '';
    const forceZoho = process.env.ZOHO_SMTP_HOST || process.env.ZOHO_SMTP_PORT;
    const isZohoDomain = email.includes('@zoho.com') || email.includes('@zoho.eu') || email.includes('@zoho.in') || email.includes('@zohomail.com');
    const isZoho = isZohoDomain || forceZoho;
    
    const appPassword = isZoho 
      ? (process.env.NODE_MAILER_APP_PASSWORD || process.env.NODE_MAILER_GMAIL_APP_PASSWORD)
      : (process.env.NODE_MAILER_GMAIL_APP_PASSWORD || process.env.NODE_MAILER_APP_PASSWORD);

    if (!appPassword) {
      const error = new Error(`Email password is not set. Please set ${isZoho ? 'NODE_MAILER_APP_PASSWORD' : 'NODE_MAILER_GMAIL_APP_PASSWORD'} in environment variables.`);
      if (process.env.NODE_ENV === 'development') {
        console.error("[sendMail] Configuration error:", error.message);
        console.error("[sendMail] Email provider:", isZoho ? 'Zoho' : 'Gmail');
      }
      reject(error);
      return;
    }

    const smtpConfig = getSmtpConfig();
    
    if (process.env.NODE_ENV === 'development') {
      console.log("[sendMail] SMTP Config:", {
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.secure,
        user: smtpConfig.auth.user,
        hasPassword: !!smtpConfig.auth.pass,
        passwordLength: smtpConfig.auth.pass?.length || 0
      });
    }

    const transporter = nodemailer.createTransport(smtpConfig)

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("[sendMail] Email error:", error);
          const nodemailerError = error as any;
          if (nodemailerError.code) {
            console.error("[sendMail] Error code:", nodemailerError.code);
          }
          if (nodemailerError.command) {
            console.error("[sendMail] Error command:", nodemailerError.command);
          }
          if (nodemailerError.response) {
            console.error("[sendMail] Error response:", nodemailerError.response);
          }
        }
        reject(error);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('[sendMail] Email sent:', info.response);
        }
        resolve(true);
      }
    })
  })
}

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
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
    data.address && data.address.trim() ? `<p>Địa chỉ: ${data.address}</p>` : '',
    `<p>Điện thoại: ${data.phone}</p>`,
    `<p>Nội dung: ${data.note}</p>`,
    data.email ? `<p>Email: ${data.email}</p>` : ''
  ].filter(Boolean) // Remove empty strings

  if (process.env.NODE_ENV === 'development') {
    console.log("[Contact] Sending email to:", mailList);
    console.log("[Contact] Email config:", {
      from: process.env.NODE_MAILER_EMAIL,
      hasPassword: !!(process.env.NODE_MAILER_APP_PASSWORD || process.env.NODE_MAILER_GMAIL_APP_PASSWORD),
      smtpHost: getSmtpConfig().host,
      smtpPort: getSmtpConfig().port
    });
  }

  try {
    await sendMail({
      from: `${siteMetadata.logoTitle} <${process.env.NODE_MAILER_EMAIL}>`,
      to: mailList,
      subject: `Đăng ký tư vấn - ${siteMetadata.logoTitle}`,
      html: content.join('')
    });
  } catch (error: unknown) {
    // Re-throw with more user-friendly message
    const err = error as any;
    if (err?.message?.includes("configuration")) {
      throw error; // Keep original message for configuration errors
    } else if (err?.code === 'EAUTH') {
      const email = process.env.NODE_MAILER_EMAIL || '';
      const forceZoho = process.env.ZOHO_SMTP_HOST || process.env.ZOHO_SMTP_PORT;
      const isZohoDomain = email.includes('@zoho.com') || email.includes('@zoho.eu') || email.includes('@zoho.in') || email.includes('@zohomail.com');
      const isZoho = isZohoDomain || forceZoho;
      
      const errorMsg = isZoho 
        ? "Xác thực email Zoho thất bại. Vui lòng kiểm tra lại:\n1. NODE_MAILER_EMAIL có đúng email Zoho không\n2. NODE_MAILER_APP_PASSWORD có đúng App Password từ Zoho không\n3. Đảm bảo đã tạo App Password trong Zoho Mail settings\n4. Nếu dùng custom domain, đảm bảo đã set ZOHO_SMTP_HOST hoặc ZOHO_SMTP_PORT"
        : "Xác thực email Gmail thất bại. Vui lòng kiểm tra lại NODE_MAILER_GMAIL_APP_PASSWORD trong file .env.local";
      throw new Error(errorMsg);
    } else if (err?.code === 'ECONNECTION') {
      throw new Error("Không thể kết nối đến máy chủ email. Vui lòng kiểm tra lại cấu hình SMTP.");
    } else if (err?.code === 'ETIMEDOUT') {
      throw new Error("Kết nối email bị timeout. Vui lòng thử lại sau.");
    } else {
      const errorMessage = err?.message || "Không thể gửi email. Vui lòng kiểm tra lại cấu hình email.";
      if (process.env.NODE_ENV === 'development') {
        console.error("[Contact] Email send failed:", errorMessage);
        console.error("[Contact] Full error:", error);
      }
      throw new Error(errorMessage);
    }
  }

  return true;
};
