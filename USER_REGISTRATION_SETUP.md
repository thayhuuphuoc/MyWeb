# Hướng Dẫn Cấu Hình Đăng Ký Tài Khoản

Website đã có sẵn hệ thống đăng ký tài khoản với các tính năng:
- ✅ Đăng ký bằng Email/Password
- ✅ Đăng ký bằng Google OAuth
- ✅ Xác thực email tự động
- ✅ Bảo mật 2 lớp (Two-Factor Authentication) - tùy chọn

## 📋 Mục Lục

1. [Cấu hình cơ bản](#1-cấu-hình-cơ-bản)
2. [Cấu hình Email (Bắt buộc)](#2-cấu-hình-email-bắt-buộc)
3. [Cấu hình Google OAuth (Tùy chọn)](#3-cấu-hình-google-oauth-tùy-chọn)
4. [Cấu hình Database](#4-cấu-hình-database)
5. [Kiểm tra hoạt động](#5-kiểm-tra-hoạt-động)
6. [Quy trình đăng ký của User](#6-quy-trình-đăng-ký-của-user)

---

## 1. Cấu hình cơ bản

### 1.1. Tạo AUTH_SECRET

AUTH_SECRET là secret key cho NextAuth.js, dùng để mã hóa session và tokens.

**Cách tạo:**

**Option 1: Sử dụng công cụ online (Khuyến nghị)**
- Truy cập: https://auth-secret-gen.vercel.app/
- Click "Generate Secret"
- Copy secret key được tạo

**Option 2: Sử dụng OpenSSL (Terminal/Git Bash)**
```bash
openssl rand -base64 32
```

**Thêm vào `.env.local`:**
```env
AUTH_SECRET=your_generated_secret_key_here
```

### 1.2. Cấu hình URL ứng dụng

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Hoặc cho production:
# NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 2. Cấu hình Email (Bắt buộc)

Email được sử dụng để:
- Gửi email xác thực khi user đăng ký
- Gửi email đặt lại mật khẩu
- Gửi mã 2FA (nếu bật)

### 2.1. Sử dụng Zoho Mail (Khuyến nghị)

**Bước 1: Tạo Zoho App Password**

1. Đăng nhập vào tài khoản Zoho Mail: https://mail.zoho.com/
2. Truy cập: https://accounts.zoho.com/home#security/app-passwords
3. Click "Generate New Password"
4. Nhập tên ứng dụng: "NextJS Website"
5. Click "Generate"
6. **Copy mật khẩu** (chỉ hiển thị 1 lần, lưu lại ngay!)

**Bước 2: Cấu hình biến môi trường**

Thêm vào `.env.local`:
```env
NODE_MAILER_EMAIL=your-email@zoho.com
NODE_MAILER_APP_PASSWORD=your-app-password-from-zoho
```

**Bước 3: Cấu hình SMTP Zoho (Tùy chọn)**

Nếu bạn ở khu vực khác, có thể cấu hình SMTP host:
```env
ZOHO_SMTP_HOST=smtp.zoho.com    # smtp.zoho.eu (châu Âu) hoặc smtp.zoho.in (Ấn Độ)
ZOHO_SMTP_PORT=465              # 465 (SSL) hoặc 587 (TLS)
```

### 2.2. Sử dụng Gmail (Alternative)

**Bước 1: Tạo Gmail App Password**

1. Đăng nhập vào tài khoản Google: https://myaccount.google.com/
2. Bật 2-Step Verification (nếu chưa bật)
3. Truy cập: https://myaccount.google.com/apppasswords
4. Chọn "Mail" và "Other (Custom name)"
5. Nhập tên: "NextJS Website"
6. Click "Generate"
7. **Copy mật khẩu 16 ký tự** (lưu lại ngay!)

**Bước 2: Cấu hình biến môi trường**

Thêm vào `.env.local`:
```env
NODE_MAILER_EMAIL=your-email@gmail.com
NODE_MAILER_GMAIL_APP_PASSWORD=your-16-char-app-password
```

---

## 3. Cấu hình Google OAuth (Tùy chọn)

Cho phép user đăng ký/đăng nhập bằng tài khoản Google.

### 3.1. Tạo Google OAuth Credentials

**Bước 1: Tạo OAuth Client ID**

1. Truy cập: https://console.cloud.google.com/
2. Chọn project hoặc tạo project mới
3. Vào **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
5. Nếu chưa có OAuth consent screen, làm theo hướng dẫn:
   - Chọn User Type (External hoặc Internal)
   - Điền App name, User support email, Developer contact
   - Thêm Scopes: `email`, `profile`, `openid`
   - Thêm Test users (nếu ở Testing mode)
6. Quay lại **Credentials** → **+ CREATE CREDENTIALS** → **OAuth client ID**
7. Chọn Application type: **Web application**
8. Đặt tên: "NextJS Website"
9. Thêm **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```
10. Click **CREATE**
11. **Copy Client ID và Client Secret**

**Bước 2: Cấu hình biến môi trường**

Thêm vào `.env.local`:
```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Lưu ý:**
- Nếu không cấu hình Google OAuth, user vẫn có thể đăng ký bằng Email/Password
- Google OAuth chỉ là phương thức đăng ký/đăng nhập bổ sung

---

## 4. Cấu hình Database

### 4.1. Cấu hình MongoDB

Hệ thống sử dụng MongoDB với Prisma ORM.

**Thêm vào `.env.local`:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Lưu ý:**
- Thay `username`, `password`, `cluster`, `database` bằng thông tin thực tế
- Có thể dùng MongoDB Atlas (free tier) hoặc MongoDB local

### 4.2. Chạy Prisma Migration

```bash
cd web2
npx prisma generate
npx prisma db push
```

---

## 5. Kiểm tra hoạt động

### 5.1. Khởi động ứng dụng

```bash
cd web2
npm run dev
```

### 5.2. Truy cập trang đăng ký

Mở trình duyệt và truy cập:
```
http://localhost:3000/auth/register
```

### 5.3. Test đăng ký

**Test với Email/Password:**
1. Điền form:
   - **Tên**: Tên của bạn
   - **Email**: Email hợp lệ (chưa được sử dụng)
   - **Mật khẩu**: Tối thiểu 8 ký tự, có cả chữ và số
2. Click "Đăng ký"
3. Kiểm tra email để nhận link xác thực
4. Click link xác thực trong email
5. Đăng nhập lại với email và mật khẩu vừa tạo

**Test với Google OAuth:**
1. Click nút "Đăng ký với Google"
2. Chọn tài khoản Google
3. Cho phép quyền truy cập
4. Tự động đăng nhập và chuyển đến dashboard

---

## 6. Quy trình đăng ký của User

### 6.1. Đăng ký bằng Email/Password

```
1. User truy cập /auth/register
2. Điền form: Tên, Email, Mật khẩu
3. Click "Đăng ký"
4. Hệ thống kiểm tra:
   - Email đã tồn tại? → Báo lỗi
   - Mật khẩu hợp lệ? (≥8 ký tự, có chữ và số) → Báo lỗi
5. Tạo user mới trong database (emailVerified = false)
6. Tạo verification token
7. Gửi email xác thực đến email của user
8. User nhận email, click link xác thực
9. Hệ thống cập nhật emailVerified = true
10. User có thể đăng nhập
```

### 6.2. Đăng ký bằng Google OAuth

```
1. User truy cập /auth/register
2. Click "Đăng ký với Google"
3. Chọn tài khoản Google
4. Cho phép quyền truy cập
5. Hệ thống tự động:
   - Tạo user mới (nếu chưa có)
   - Liên kết tài khoản Google
   - Đặt emailVerified = true (tự động)
   - Đăng nhập và chuyển đến dashboard
```

### 6.3. Yêu cầu mật khẩu

- **Độ dài**: Tối thiểu 8 ký tự, tối đa 64 ký tự
- **Định dạng**: Phải chứa cả chữ cái (A-Z, a-z) và số (0-9)
- **Ký tự đặc biệt**: Có thể dùng @$!%*#?& (tùy chọn)

**Ví dụ mật khẩu hợp lệ:**
- `Password123`
- `MyPass2024`
- `Secure@123`

**Ví dụ mật khẩu không hợp lệ:**
- `password` (thiếu số)
- `12345678` (thiếu chữ)
- `Pass123` (quá ngắn, < 8 ký tự)

---

## 7. Các route liên quan

- `/auth/register` - Trang đăng ký
- `/auth/login` - Trang đăng nhập
- `/auth/new-verification` - Xác thực email (tự động redirect)
- `/auth/reset` - Quên mật khẩu
- `/auth/new-password` - Đặt lại mật khẩu
- `/auth/error` - Trang lỗi xác thực

---

## 8. Troubleshooting

### 8.1. Email không được gửi

**Kiểm tra:**
1. `NODE_MAILER_EMAIL` đã được set chưa?
2. `NODE_MAILER_APP_PASSWORD` hoặc `NODE_MAILER_GMAIL_APP_PASSWORD` đã đúng chưa?
3. App Password đã được tạo đúng cách chưa?
4. Kiểm tra console log trong development mode

**Lỗi thường gặp:**
- `EAUTH`: Sai email hoặc app password
- `ECONNECTION`: Không kết nối được SMTP server
- `ETIMEDOUT`: Kết nối bị timeout

### 8.2. Google OAuth không hoạt động

**Kiểm tra:**
1. `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` đã được set chưa?
2. Authorized redirect URI đã được thêm vào Google Console chưa?
3. OAuth consent screen đã được publish chưa? (nếu ở Testing mode, chỉ test users mới dùng được)

### 8.3. User không thể đăng nhập sau khi đăng ký

**Nguyên nhân:**
- User chưa xác thực email
- Email xác thực đã hết hạn (token hết hạn sau 1 giờ)

**Giải pháp:**
- Gửi lại email xác thực từ trang login
- Hoặc tạo lại verification token trong database

### 8.4. Database connection error

**Kiểm tra:**
1. `MONGODB_URI` đã đúng format chưa?
2. MongoDB server có đang chạy không?
3. IP address đã được whitelist trong MongoDB Atlas chưa?

---

## 9. Tóm tắt các biến môi trường cần thiết

### Bắt buộc:
```env
# NextAuth
AUTH_SECRET=your_auth_secret

# Database
MONGODB_URI=mongodb+srv://...

# Email (chọn 1 trong 2)
# Zoho Mail
NODE_MAILER_EMAIL=your-email@zoho.com
NODE_MAILER_APP_PASSWORD=your-zoho-app-password

# Hoặc Gmail
NODE_MAILER_EMAIL=your-email@gmail.com
NODE_MAILER_GMAIL_APP_PASSWORD=your-gmail-app-password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Tùy chọn:
```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Zoho SMTP (nếu cần custom)
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
```

---

## 10. Bảo mật

### 10.1. Best Practices

1. **Không commit `.env.local`** vào Git
2. **Sử dụng App Passwords** thay vì mật khẩu chính
3. **Rotate AUTH_SECRET** định kỳ (sẽ làm user phải đăng nhập lại)
4. **Giới hạn OAuth redirect URIs** chỉ cho domain của bạn
5. **Bật 2FA** cho tài khoản admin (tùy chọn)

### 10.2. Email Verification

- User **phải** xác thực email trước khi đăng nhập
- Verification token hết hạn sau **1 giờ**
- Có thể gửi lại email xác thực từ trang login

---

## 11. Tùy chỉnh

### 11.1. Thay đổi yêu cầu mật khẩu

Sửa file `web2/schemas/auth.schema.ts`:
```typescript
export const RegisterSchema = z.object({
  // ... other fields
  password: z.string()
    .min(8, { message: 'Yêu cầu tối thiểu 8 ký tự' })
    .max(64, { message: 'Tối đa 64 ký tự' })
    .refine(
      (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(value ?? ''),
      'Mật khẩu phải chứa cả số và chữ'
    ),
});
```

### 11.2. Thay đổi redirect sau đăng ký

Sửa file `web2/routes.ts`:
```typescript
export const DEFAULT_LOGIN_REDIRECT = "/dashboard/settings";
```

### 11.3. Thêm OAuth provider khác

Sửa file `web2/auth.config.ts`:
```typescript
import Github from "next-auth/providers/github";

export default {
  providers: [
    // ... existing providers
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
}
```

---

## ✅ Checklist

Trước khi cho phép user đăng ký, đảm bảo:

- [ ] `AUTH_SECRET` đã được tạo và thêm vào `.env.local`
- [ ] `MONGODB_URI` đã được cấu hình
- [ ] Email đã được cấu hình (Zoho hoặc Gmail)
- [ ] `NEXT_PUBLIC_APP_URL` đã được set đúng
- [ ] Đã test đăng ký thành công với Email/Password
- [ ] Đã test email xác thực hoạt động
- [ ] (Tùy chọn) Google OAuth đã được cấu hình và test
- [ ] Database đã được migrate (`npx prisma db push`)

---

**Lưu ý:** Sau khi cấu hình xong, khởi động lại server (`npm run dev`) để áp dụng các thay đổi trong `.env.local`.



