# NextJS Blog & CMS Platform

Website blog và quản lý nội dung (CMS) được xây dựng bằng Next.js 14 với đầy đủ tính năng SEO, quản lý bài viết, sản phẩm và tài nguyên.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Tính năng chính](#tính-năng-chính)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
  - [Database](#database)
  - [Authentication](#authentication)
  - [Email (Nodemailer + Zoho Mail)](#email-nodemailer--zoho-mail)
  - [Mailchimp (Newsletter)](#mailchimp-newsletter)
  - [Google AdSense](#google-adsense)
  - [Google Analytics](#google-analytics)
  - [Image Upload (Cloudinary)](#image-upload-cloudinary)
- [Scripts](#scripts)
- [Hướng dẫn Test và Debug](#hướng-dẫn-test-và-debug)
- [License](#license)

## 🎯 Tổng quan

Dự án này là một nền tảng blog và CMS hoàn chỉnh với các tính năng:

- **Blog System**: Quản lý bài viết với rich text editor, categories, tags, comments
- **Product Management**: Quản lý sản phẩm với gallery và carousel
- **CMS Dashboard**: Giao diện quản trị trực quan và dễ sử dụng
- **SEO Optimization**: Tối ưu hóa SEO với sitemap, robots.txt, meta tags
- **Authentication**: Hệ thống xác thực với NextAuth.js (Google OAuth, Credentials)
- **Email Integration**: Tích hợp Nodemailer với Zoho Mail/Gmail
- **Newsletter**: Tích hợp Mailchimp cho đăng ký nhận bản tin
- **AdSense**: Tích hợp Google AdSense cho quảng cáo
- **Dark Mode**: Hỗ trợ chế độ tối/sáng
- **Responsive Design**: Tối ưu cho mọi thiết bị

## 🛠 Công nghệ sử dụng

### Frontend Framework & Core

- **[Next.js 14](https://nextjs.org/)** - React framework với App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### UI Components & Libraries

- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Dark mode support

### Backend & Database

- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication for Next.js
- **[Nodemailer](https://nodemailer.com/)** - Email sending

### Rich Text Editor & Content

- **[Quill](https://quilljs.com/)** - Rich text editor
- **[Quill Better Table](https://github.com/soccerloway/quill-better-table)** - Table support
- **[Highlight.js](https://highlightjs.org/)** - Syntax highlighting
- **[Highlightjs Copy](https://github.com/arve0/highlightjs-copy)** - Copy code button

### Data Management & Forms

- **[TanStack Table](https://tanstack.com/table)** - Headless UI for tables
- **[React Hook Form](https://react-hook-form.com/)** - Form validation
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Media & Gallery

- **[PhotoSwipe](https://photoswipe.com/)** - Image gallery
- **[LightGallery](https://www.lightgalleryjs.com/)** - Lightweight gallery
- **[React Slick](https://react-slick.neostack.com/)** - Carousel slider
- **[Sharp](https://sharp.pixelplumbing.com/)** - Image processing

### Analytics & Third-party

- **[Next Third Parties](https://github.com/onwidget/next-third-parties)** - Google Analytics
- **[Google AdSense](https://www.google.com/adsense/)** - Advertisement
- **[Mailchimp](https://mailchimp.com/)** - Newsletter management

## ✨ Tính năng chính

### 1. Blog System

- ✅ **Quản lý bài viết** (CRUD operations)
- ✅ **Rich Text Editor** với hỗ trợ formatting, headings, lists, tables, code blocks
- ✅ **Categories & Tags** - Phân loại và gắn thẻ bài viết
- ✅ **Table of Contents** - Mục lục tự động từ headings
- ✅ **Comments System** - Hệ thống bình luận
- ✅ **View Counter** - Đếm lượt xem bài viết
- ✅ **Social Media Sharing** - Chia sẻ lên Facebook, Twitter/X, Pinterest, Instagram
- ✅ **Copy Link** - Sao chép link bài viết
- ✅ **Search Functionality** - Tìm kiếm bài viết
- ✅ **Pagination** - Phân trang
- ✅ **Related Posts** - Bài viết liên quan
- ✅ **Google AdSense Integration** - Quảng cáo trong bài viết

### 2. Product Management

- ✅ **Quản lý sản phẩm** (CRUD operations)
- ✅ **Multi-image Upload** - Upload nhiều hình ảnh
- ✅ **Image Gallery** - Gallery với lightbox
- ✅ **Product Carousel** - Carousel hiển thị sản phẩm
- ✅ **Categories & Tags** - Phân loại sản phẩm
- ✅ **Search & Filter** - Tìm kiếm và lọc sản phẩm
- ✅ **Pagination** - Phân trang

### 3. CMS Dashboard

- ✅ **Dashboard Overview** - Tổng quan thống kê
- ✅ **User Management** - Quản lý người dùng
- ✅ **Post Management** - Quản lý bài viết
- ✅ **Product Management** - Quản lý sản phẩm
- ✅ **Resource Management** - Quản lý tài nguyên
- ✅ **Category & Tag Management** - Quản lý danh mục và thẻ
- ✅ **Image Carousel Management** - Quản lý carousel hình ảnh
- ✅ **Settings** - Cài đặt hệ thống
- ✅ **Data Tables** - Bảng dữ liệu với sorting, filtering, pagination

### 4. Authentication & Authorization

- ✅ **NextAuth.js Integration** - Hệ thống xác thực
- ✅ **Google OAuth** - Đăng nhập bằng Google
- ✅ **Credentials Login** - Đăng nhập bằng email/password
- ✅ **Role-based Access Control** - Phân quyền theo vai trò
- ✅ **Password Reset** - Đặt lại mật khẩu
- ✅ **Email Verification** - Xác thực email
- ✅ **Two-factor Authentication** - Xác thực hai yếu tố (2FA)

### 5. SEO & Performance

- ✅ **Server-side Rendering (SSR)** - Render phía server
- ✅ **Static Site Generation (SSG)** - Tạo trang tĩnh
- ✅ **Automatic Sitemap** - Sitemap tự động
- ✅ **Robots.txt** - File robots.txt
- ✅ **Meta Tags Optimization** - Tối ưu meta tags
- ✅ **Open Graph Tags** - Tags cho social media
- ✅ **Image Optimization** - Tối ưu hình ảnh với Sharp

### 6. UI/UX Features

- ✅ **Dark Mode** - Chế độ tối/sáng
- ✅ **Responsive Design** - Thiết kế responsive
- ✅ **Loading States** - Trạng thái loading
- ✅ **Error Handling** - Xử lý lỗi
- ✅ **Toast Notifications** - Thông báo toast
- ✅ **Form Validation** - Validation form
- ✅ **Accessibility** - Hỗ trợ accessibility

## 📁 Cấu trúc dự án

```
web2/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes
│   │   ├── (blog)/               # Blog routes
│   │   ├── (home)/               # Home page
│   │   ├── (products)/           # Product routes
│   │   ├── contact/              # Contact page
│   │   └── gioi-thieu/           # About page
│   ├── (protected)/              # Protected routes
│   │   └── dashboard/            # Admin dashboard
│   ├── api/                      # API routes
│   ├── auth/                     # Authentication pages
│   └── layout.tsx                # Root layout
├── actions/                      # Server actions
│   ├── auth/                     # Authentication actions
│   ├── posts/                    # Post actions
│   ├── products/                 # Product actions
│   ├── comments/                 # Comment actions
│   ├── newsletter/                # Newsletter actions
│   └── mails/                    # Email actions
├── components/                   # React components
│   ├── auth/                     # Auth components
│   ├── dashboard/                # Dashboard components
│   ├── data-table/               # Table components
│   ├── public/                   # Public components
│   │   ├── adsense/              # AdSense components
│   │   ├── layout/               # Layout components
│   │   ├── posts/                # Post components
│   │   ├── products/             # Product components
│   │   └── shared/               # Shared components
│   └── ui/                       # UI components
├── config/                       # Configuration files
│   ├── siteMetadata.ts           # Site metadata
│   ├── adsense.ts                # AdSense config
│   └── quill-config.ts           # Quill editor config
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
│   └── mail.ts                   # Email utilities
├── locales/                      # Internationalization
├── prisma/                       # Prisma schema
│   └── schema.prisma             # Database schema
├── public/                       # Static files
├── styles/                       # Global styles
└── types/                        # TypeScript types
```

## 🚀 Cài đặt

### Yêu cầu

- Node.js 18+ 
- MongoDB database
- npm hoặc yarn

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd web2
```

### Bước 2: Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### Bước 3: Cấu hình environment variables

Tạo file `.env.local` từ `env.example`:

```bash
cp env.example .env.local
```

Cập nhật các biến môi trường trong `.env.local`. Xem chi tiết ở phần [Cấu hình](#cấu-hình).

### Bước 4: Setup database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

### Bước 5: Chạy development server

```bash
npm run dev
# hoặc
yarn dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## ⚙️ Cấu hình

### Database

Dự án sử dụng MongoDB với Prisma ORM. Schema được định nghĩa trong `prisma/schema.prisma`.

**Cấu hình:**

```env
MONGODB_URI=your_mongodb_connection_string
```

### Authentication

**Google OAuth:**

1. Tạo OAuth credentials tại [Google Cloud Console](https://console.cloud.google.com/)
2. Thêm credentials vào `.env.local`:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Auth Secret:**

Tạo secret key cho NextAuth:

```env
AUTH_SECRET=your_auth_secret
# Tạo bằng: openssl rand -base64 32
# Hoặc: https://auth-secret-gen.vercel.app/
```

### Email (Nodemailer + Zoho Mail)

Hệ thống hỗ trợ gửi email qua Nodemailer với Zoho Mail hoặc Gmail. Dự án hiện tại hỗ trợ 2 phương án để nhận email từ trang liên hệ:

#### Phương án 1: Sử dụng Nodemailer với Zoho Mail (Khuyến nghị)

**Bước 1: Tạo Zoho App Password**

1. Đăng nhập vào tài khoản Zoho Mail của bạn
2. Truy cập: https://accounts.zoho.com/home#security/app-passwords
3. Click "Generate New Password"
4. Nhập tên ứng dụng: "NextJS Website"
5. Click "Generate"
6. **Copy mật khẩu** (lưu ý: chỉ hiển thị 1 lần, hãy lưu lại ngay)

**Bước 2: Cấu hình biến môi trường**

Mở file `.env.local` (hoặc `.env`) và thêm/cập nhật:

```env
NODE_MAILER_EMAIL=your-email@zoho.com
NODE_MAILER_APP_PASSWORD=your-app-password
```

**Lưu ý:**
- `NODE_MAILER_EMAIL`: Email Zoho của bạn (ví dụ: `lienhe@nguyenhuuphuoc.com` nếu dùng Zoho Mail)
- `NODE_MAILER_APP_PASSWORD`: Mật khẩu ứng dụng từ Zoho
- Hệ thống sẽ tự động nhận diện Zoho Mail dựa trên domain email

**Bước 3: Cấu hình SMTP Zoho (Tùy chọn)**

Nếu bạn ở khu vực khác, có thể cấu hình SMTP host:

```env
ZOHO_SMTP_HOST=smtp.zoho.com    # smtp.zoho.eu (châu Âu) hoặc smtp.zoho.in (Ấn Độ)
ZOHO_SMTP_PORT=465              # 465 (SSL) hoặc 587 (TLS)
```

**Mặc định:**
- Host: `smtp.zoho.com`
- Port: `465` (SSL)
- Secure: `true`

**Bước 4: Cập nhật email nhận thông báo**

Mở file `config/siteMetadata.ts` và cập nhật:

```typescript
owner_email: 'your-email@zoho.com'  // Email bạn muốn nhận thông báo
```

**Bước 5: Cập nhật Contact Form để dùng Nodemailer**

Hiện tại form đang dùng `formsubmit.co`. Để chuyển sang Nodemailer, cần cập nhật file `app/(public)/contact/_components/contact-form.tsx`:

**Thay đổi từ:**
```typescript
fetch('https://formsubmit.co/ajax/' + siteMetadata.owner_email, {
  // ...
})
```

**Thành:**
```typescript
import { actionSendMail } from "@/actions/mails/actionSendMail";

// Trong handleSubmit:
const result = await actionSendMail({
  name: `${formData.firstname} ${formData.lastname}`,
  phone: formData.number,
  email: formData.email,
  address: '', // Nếu form không có trường này
  note: formData.message,
});
```

**Bước 6: Kiểm tra**

1. Khởi động lại server: `npm run dev`
2. Điền form liên hệ và gửi
3. Kiểm tra email trong hộp thư đến

#### Phương án 1b: Sử dụng Nodemailer với Gmail

**Bước 1: Tạo Gmail App Password**

1. Đăng nhập vào tài khoản Gmail của bạn
2. Truy cập: https://myaccount.google.com/apppasswords
3. Chọn "App" → "Mail" và "Device" → "Other (Custom name)"
4. Nhập tên: "NextJS Website"
5. Click "Generate"
6. **Copy mật khẩu 16 ký tự** (ví dụ: `abcd efgh ijkl mnop`)

**Bước 2: Cấu hình biến môi trường**

Mở file `.env.local` (hoặc `.env`) và thêm/cập nhật:

```env
NODE_MAILER_EMAIL=your-email@gmail.com
NODE_MAILER_GMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Lưu ý:**
- `NODE_MAILER_EMAIL`: Email Gmail của bạn (ví dụ: `lienhe@nguyenhuuphuoc.com` nếu dùng Gmail Workspace)
- `NODE_MAILER_GMAIL_APP_PASSWORD`: Mật khẩu ứng dụng 16 ký tự (bỏ khoảng trắng)

**Bước 3: Cập nhật email nhận thông báo**

Mở file `config/siteMetadata.ts` và cập nhật:

```typescript
owner_email: 'your-email@gmail.com'  // Email bạn muốn nhận thông báo
```

**Bước 4: Cập nhật Contact Form để dùng Nodemailer**

Tương tự như Phương án 1, cập nhật file `app/(public)/contact/_components/contact-form.tsx`.

**Bước 5: Kiểm tra**

1. Khởi động lại server: `npm run dev`
2. Điền form liên hệ và gửi
3. Kiểm tra email trong hộp thư đến

#### Phương án 2: Sử dụng FormSubmit.co (Hiện tại đang dùng)

**Ưu điểm:**
- Không cần cấu hình phức tạp
- Miễn phí
- Hoạt động ngay lập tức

**Cách hoạt động:**
1. Form hiện tại đã được cấu hình sẵn
2. Chỉ cần đảm bảo `siteMetadata.owner_email` đúng
3. FormSubmit sẽ gửi email đến địa chỉ đó

**Cấu hình:**
Chỉ cần cập nhật trong `config/siteMetadata.ts`:
```typescript
owner_email: 'your-email@gmail.com'
```

**Lưu ý:**
- FormSubmit có giới hạn 50 email/tháng (bản miễn phí)
- Cần xác thực email lần đầu tiên

#### Khắc phục sự cố

**Lỗi: "Invalid login" (Zoho)**
- Kiểm tra lại Zoho App Password
- Đảm bảo đã bật 2-Step Verification trên Zoho
- Kiểm tra email có đúng định dạng @zoho.com không

**Lỗi: "Invalid login" (Gmail)**
- Kiểm tra lại Gmail App Password (phải là 16 ký tự, không có khoảng trắng)
- Đảm bảo đã bật 2-Step Verification trên Gmail

**Lỗi: "Email không được gửi"**
- Kiểm tra biến môi trường đã được load chưa (restart server)
- Kiểm tra console log để xem lỗi chi tiết
- Đảm bảo Gmail App Password chưa hết hạn

**Email không đến**
- Kiểm tra thư mục Spam
- Kiểm tra `owner_email` trong `siteMetadata.ts`
- Kiểm tra email trong `NODE_MAILER_EMAIL` có đúng không

#### Tùy chọn nâng cao

**Thêm nhiều email nhận thông báo:**

Sửa file `lib/mail.ts`, hàm `sendContact`:

```typescript
const mailList = [
  siteMetadata.owner_email,
  'email-khac@gmail.com',  // Thêm email khác
  'email-khac-2@gmail.com'
];
```

**Tùy chỉnh nội dung email:**

Sửa file `lib/mail.ts`, hàm `sendContact`:

```typescript
const content = [
  `<h2>Thông tin liên hệ mới</h2>`,
  `<p><strong>Họ tên:</strong> ${data.name}</p>`,
  `<p><strong>Địa chỉ:</strong> ${data.address}</p>`,
  `<p><strong>Điện thoại:</strong> ${data.phone}</p>`,
  `<p><strong>Email:</strong> ${data.email || 'Không có'}</p>`,
  `<hr>`,
  `<p><strong>Nội dung:</strong></p>`,
  `<p>${data.note}</p>`
]
```

#### Khuyến nghị

**Nên dùng Nodemailer** vì:
- Kiểm soát hoàn toàn
- Không giới hạn số lượng email
- Tùy chỉnh dễ dàng
- Đã có sẵn code trong dự án

**Dùng FormSubmit.co** khi:
- Cần giải pháp nhanh, không muốn cấu hình
- Dự án nhỏ, ít email
- Muốn test nhanh

### Mailchimp (Newsletter)

Tích hợp Mailchimp cho đăng ký nhận bản tin. Email sẽ được tự động thêm vào danh sách Mailchimp của bạn.

**Bước 1: Tạo tài khoản Mailchimp**

1. Truy cập: https://mailchimp.com/
2. Đăng ký tài khoản miễn phí (hỗ trợ tối đa 500 contacts)
3. Xác nhận email và hoàn tất đăng ký

**Bước 2: Tạo Audience (Danh sách)**

1. Đăng nhập vào Mailchimp
2. Vào **Audience** > **All contacts**
3. Nếu chưa có Audience, click **Create Audience**
4. Điền thông tin:
   - **Audience name**: Tên danh sách (ví dụ: "Newsletter Subscribers")
   - **Default from email**: Email người gửi
   - **Default from name**: Tên người gửi
5. Click **Save**

**Bước 3: Lấy API Key**

1. Vào **Account** > **Extras** > **API keys**
2. Hoặc truy cập trực tiếp: https://mailchimp.com/developer/marketing/api/quick-start/
3. Click **Create A Key**
4. Đặt tên cho key (ví dụ: "NextJS Website")
5. **Copy API Key** (lưu ý: chỉ hiển thị 1 lần)

**Lưu ý:** API Key có dạng: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1`
- Phần `-us1` là **Server Prefix** (có thể là `us1`, `us2`, `us3`, `us6`, `us7`, `us8`, `us9`, `us10`, `us11`, `us12`, `us13`, `us14`, `us15`, `us16`, `us17`, `us18`, `us19`, `us20`, `us21`)
- Server Prefix cho biết server Mailchimp của bạn ở đâu

**Bước 4: Lấy Audience ID**

1. Vào **Audience** > **Settings** > **Audience name and defaults**
2. Scroll xuống phần **Audience ID**
3. **Copy Audience ID** (dạng: `1234567890`)

**Bước 5: Cấu hình biến môi trường**

Mở file `.env.local` (hoặc `.env`) và thêm:

```env
# Mailchimp Configuration
MAILCHIMP_API_KEY=your-api-key-here
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_AUDIENCE_ID=your-audience-id-here
```

**Ví dụ:**
```env
MAILCHIMP_API_KEY=abc123def456ghi789jkl012mno345pqr678-us1
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_AUDIENCE_ID=1234567890
```

**Lưu ý:**
- `MAILCHIMP_API_KEY`: API Key đầy đủ (bao gồm cả server prefix)
- `MAILCHIMP_SERVER_PREFIX`: Chỉ lấy phần server prefix (ví dụ: `us1`)
- `MAILCHIMP_AUDIENCE_ID`: ID của Audience bạn muốn thêm email vào

**Bước 6: Kiểm tra hoạt động**

1. Khởi động lại server: `npm run dev`
2. Truy cập trang chủ
3. Scroll xuống phần "Đăng ký nhận bản tin"
4. Nhập email và click "Đăng ký"
5. Kiểm tra trong Mailchimp: **Audience** > **All contacts** để xem email đã được thêm chưa

**Xử lý lỗi thường gặp:**

**Lỗi: "Member Exists"**
- Email đã được đăng ký trước đó
- Hệ thống sẽ hiển thị thông báo: "Email này đã được đăng ký trước đó."

**Lỗi: "Invalid API Key"**
- Kiểm tra lại `MAILCHIMP_API_KEY` trong `.env.local`
- Đảm bảo không có khoảng trắng thừa

**Lỗi: "Invalid Audience ID"**
- Kiểm tra lại `MAILCHIMP_AUDIENCE_ID` trong `.env.local`
- Đảm bảo ID đúng với Audience bạn muốn sử dụng

**Lỗi: "Server Prefix không đúng"**
- Kiểm tra lại `MAILCHIMP_SERVER_PREFIX`
- Server prefix thường là 2-3 ký tự (ví dụ: `us1`, `us2`, `us3`)

**Tùy chỉnh trạng thái đăng ký:**

Mặc định, email sẽ được thêm với trạng thái **"subscribed"** (đã đăng ký).

Nếu muốn sử dụng **double opt-in** (yêu cầu xác nhận email), sửa file `actions/newsletter/actions.ts`:

```typescript
const requestBody = {
  email_address: validatedData.email,
  status: "pending",  // Thay đổi từ "subscribed" thành "pending"
  status_if_new: "pending",
};
```

Với `status: "pending"`, Mailchimp sẽ gửi email xác nhận đến người đăng ký.

### Google AdSense

Tích hợp Google AdSense để hiển thị quảng cáo trong bài viết.

#### 1. Environment Variables

Thêm các biến sau vào file `.env.local`:

```env
# Publisher ID (required)
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=pub-7388236160845202

# Blog Post Ad Slot IDs (optional - leave empty to disable)
NEXT_PUBLIC_ADSENSE_BLOG_POST_AFTER_DESC=9341242472
NEXT_PUBLIC_ADSENSE_BLOG_POST_AFTER_CONTENT=9341242472
NEXT_PUBLIC_ADSENSE_BLOG_POST_AFTER_SHARE=9341242472
```

**Note:** 
- The Publisher ID is already configured in `env.example`.
- Each ad position can have a different Ad Slot ID.
- Leave an Ad Slot ID empty to disable ads in that position.
- You can also configure Ad Slot IDs in `config/adsense.ts` directly.

#### 2. Components

**AdSenseScript Component**
- **Location:** `components/public/adsense/adsense-script.tsx`
- **Purpose:** Loads the AdSense JavaScript library
- **Usage:** Automatically included in `app/layout.tsx` and `app/(public)/layout.tsx`
- **Note:** Only loads if `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` is set

**AdSenseUnit Component**
- **Location:** `components/public/adsense/adsense-unit.tsx`
- **Purpose:** Displays individual ad units
- **Props:**
  - `adSlot` (required): The ad slot ID from Google AdSense
  - `adFormat` (optional): 'auto' | 'rectangle' | 'vertical' | 'horizontal' (default: 'auto')
  - `style` (optional): Custom CSS styles
  - `className` (optional): Additional CSS classes

#### 3. Getting Ad Slot IDs

1. Log in to [Google AdSense](https://adsense.google.com/)
2. Go to **Ads** → **By ad unit**
3. Click **Create ad unit**
4. Choose ad type (Display ads, In-article ads, etc.)
5. Configure the ad unit
6. Copy the **Ad unit ID** (this is your `adSlot` value)

#### 4. Configuring Ad Slot IDs for Different Positions

**Method 1: Using Environment Variables (Recommended)**

Edit your `.env.local` file:

```env
# Blog Post - Ad after description
NEXT_PUBLIC_ADSENSE_BLOG_POST_AFTER_DESC=1234567890

# Blog Post - Ad after content
NEXT_PUBLIC_ADSENSE_BLOG_POST_AFTER_CONTENT=0987654321

# Blog Post - Ad after share buttons
NEXT_PUBLIC_ADSENSE_BLOG_POST_AFTER_SHARE=1122334455
```

**Important:** Each position should have a **different** Ad Slot ID to display multiple ads on the same page.

**Method 2: Using Config File**

Edit `config/adsense.ts`:

```typescript
export const adsenseConfig = {
	blogPost: {
		afterDescription: '1234567890',  // Your Ad Slot ID
		afterContent: '0987654321',      // Different Ad Slot ID
		afterShareButtons: '1122334455', // Another Ad Slot ID
	},
	// ...
}
```

**Disabling Ads in Specific Positions:**

To disable ads in a specific position, either:
- Leave the environment variable empty: `NEXT_PUBLIC_ADSENSE_BLOG_POST_AFTER_DESC=`
- Or set it to an empty string in `config/adsense.ts`

#### 5. Best Practices

1. **Don't place too many ads:** Google recommends no more than 3 ad units per page
2. **Respect user experience:** Place ads in natural positions that don't interrupt content flow
3. **Mobile responsive:** Use `data-full-width-responsive="true"` (already included)
4. **Wait for approval:** AdSense may take a few days to approve your site
5. **Follow AdSense policies:** Ensure your content complies with [AdSense policies](https://support.google.com/adsense/answer/48182)

#### 6. Common Ad Formats

- **Auto:** Automatically adjusts to available space
- **Rectangle:** 300x250, 336x280, etc.
- **Vertical:** 120x600, 160x600, etc.
- **Horizontal:** 728x90, 970x90, etc.

#### 7. ⚠️ Quan trọng - Tắt Auto Ads (Recommended for Manual Ad Placement)

Khi sử dụng ad units thủ công (như trong setup này), bạn **nên tắt Auto Ads** trong Google AdSense Dashboard để tránh các đề xuất nội dung không mong muốn:

1. Log in to [Google AdSense](https://adsense.google.com/)
2. Go to **Ads** → **Auto ads**
3. Select your site
4. **Disable** Auto Ads for your site
5. This will prevent Google from automatically injecting:
   - Content suggestions (like "Explore more: AI, lifestyle, etc.")
   - In-article ads
   - Anchor ads
   - Vignette ads
   - Other automatic ad placements

**Why disable Auto Ads?**
- When Auto Ads is enabled, Google may inject content suggestions (e.g., "Khám phá thêm: AI, lối sống, trí tuệ nhân tạo, giáo dục...")
- These suggestions may not work properly or lead to empty pages
- Manual ad units give you full control over ad placement and user experience
- Prevents conflicts between Auto Ads and manual ad units

#### 8. Troubleshooting

**Ads not showing?**
1. Check that `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` is set in `.env.local`
2. Verify your site is approved by Google AdSense
3. Check browser console for errors
4. Ensure ad slots are correctly configured in AdSense dashboard
5. Wait 24-48 hours after creating new ad units

**Development mode**
- AdSense may not show ads in development (`localhost`)
- Test on a deployed/staging environment

**AdSense violations**
- Review [AdSense policies](https://support.google.com/adsense/answer/48182)
- Ensure content is original and complies with guidelines
- Avoid click fraud or invalid traffic

### Google Analytics

Tích hợp Google Analytics để theo dõi traffic.

**Cấu hình:**

1. Tạo Google Analytics property
2. Lấy Measurement ID (format: `G-XXXXXXXXXX`)
3. Thêm vào `.env.local`:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Image Upload (Cloudinary)

Cấu hình Cloudinary để upload hình ảnh.

**Cấu hình:**

1. Tạo tài khoản tại [Cloudinary](https://cloudinary.com/)
2. Lấy Upload URL và Upload Preset
3. Thêm vào `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL=your_cloudinary_upload_url
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 📜 Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Seed resources
npm run seed:resources
```

## 🧪 Hướng dẫn Test và Debug

### Bước 1: Khởi động Development Server

Mở terminal và chạy:

```bash
cd web2
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`

### Bước 2: Mở Browser Console

1. Mở trình duyệt và truy cập `http://localhost:3000`
2. Nhấn `F12` hoặc `Ctrl + Shift + I` (Windows) / `Cmd + Option + I` (Mac)
3. Chọn tab **Console** để xem logs từ client-side

### Bước 3: Test Contact Form

#### 3.1. Kiểm tra Terminal Logs (Server-side)

Khi submit form, bạn sẽ thấy logs trong terminal như:

```
[actionSendMail] Received input: { name: '...', phone: '...', ... }
[Contact] Sending email to: ['lienhe@nguyenhuuphuoc.com']
[Contact] Email config: { from: '...', hasPassword: true }
[actionSendMail] Email sent successfully
```

Nếu có lỗi, sẽ thấy:
```
[actionSendMail] Error: ...
[Contact] Email error: ...
```

#### 3.2. Kiểm tra Browser Console (Client-side)

Khi submit form, bạn sẽ thấy:
```
[ContactForm] Error from server: ... (nếu có lỗi)
```

#### 3.3. Test Cases

**Test Case 1: Gửi form thành công**
- Điền đầy đủ thông tin:
  - Họ: "Nguyễn"
  - Tên: "Văn A"
  - Số điện thoại: "0982484950" (hoặc "0982 484 950")
  - Email: "test@example.com"
  - Tin nhắn: "Đây là tin nhắn test" (ít nhất 8 ký tự)
- Click "Gửi tin nhắn"
- **Kiểm tra:**
  - Terminal: Có log `[actionSendMail] Email sent successfully`
  - Browser: Toast success "Cảm ơn bạn đã gửi tin nhắn!"
  - Email inbox: Nhận được email từ Nodemailer

**Test Case 2: Test validation**
- Để trống một số trường
- **Kiểm tra:** Hiển thị lỗi validation

**Test Case 3: Test số điện thoại không hợp lệ**
- Nhập số điện thoại không đúng format
- **Kiểm tra:** Hiển thị lỗi "Số điện thoại không hợp lệ"

**Test Case 4: Test khi thiếu cấu hình email**
- Tạm thời xóa `NODE_MAILER_EMAIL` trong `.env.local`
- Submit form
- **Kiểm tra:** 
  - Terminal: Log lỗi "Email configuration is not set"
  - Browser: Toast error với thông báo lỗi

### Bước 4: Test Newsletter (Mailchimp)

#### 4.1. Kiểm tra Terminal Logs (Server-side)

Khi đăng ký newsletter, bạn sẽ thấy:

```
[Newsletter] Mailchimp API URL: https://us1.api.mailchimp.com/3.0/lists/...
[Newsletter] Email hash: ...
[Newsletter] Request body: { ... }
[Newsletter] Response status: 200
[Newsletter] Response data: { ... }
```

Nếu có lỗi:
```
[Newsletter] Missing Mailchimp configuration: ['MAILCHIMP_API_KEY', ...]
[Newsletter] Mailchimp API Error: { status: 401, ... }
```

#### 4.2. Kiểm tra Browser Console (Client-side)

Khi đăng ký, bạn sẽ thấy:
```
[Newsletter] Submitting email: test@example.com
[Newsletter] Result: { data: {...}, error: null }
[Newsletter] Success: { email: '...', status: 'subscribed' }
```

Nếu có lỗi:
```
[Newsletter] Error: ...
```

#### 4.3. Test Cases

**Test Case 1: Đăng ký thành công**
- Scroll xuống phần "Đăng ký nhận bản tin"
- Nhập email hợp lệ: "test@example.com"
- Click "Đăng ký"
- **Kiểm tra:**
  - Terminal: Log `[Newsletter] Response status: 200`
  - Browser: Toast success "Đăng ký thành công!"
  - Mailchimp Dashboard: Email xuất hiện trong Audience > All contacts

**Test Case 2: Email đã tồn tại**
- Đăng ký email đã được đăng ký trước đó
- **Kiểm tra:**
  - Browser: Toast error "Email này đã được đăng ký trước đó."

**Test Case 3: Thiếu cấu hình Mailchimp**
- Tạm thời xóa `MAILCHIMP_API_KEY` trong `.env.local`
- Đăng ký email
- **Kiểm tra:**
  - Terminal: Log `[Newsletter] Missing Mailchimp configuration: ['MAILCHIMP_API_KEY']`
  - Browser: Toast error "Cấu hình Mailchimp chưa được thiết lập..."

**Test Case 4: API Key không hợp lệ**
- Sửa `MAILCHIMP_API_KEY` thành giá trị sai
- Đăng ký email
- **Kiểm tra:**
  - Terminal: Log `[Newsletter] Mailchimp API Error: { status: 401, ... }`
  - Browser: Toast error với thông báo từ Mailchimp API

### Bước 5: Kiểm tra Environment Variables

Đảm bảo file `.env.local` có đầy đủ các biến:

```env
# Nodemailer (Zoho Mail)
NODE_MAILER_EMAIL=your-email@zoho.com
NODE_MAILER_APP_PASSWORD=your-app-password
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465

# Mailchimp
MAILCHIMP_API_KEY=your-api-key-with-server-prefix
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_AUDIENCE_ID=your-audience-id
```

### Bước 6: Troubleshooting

**Lỗi: "Email configuration is not set"**
- **Nguyên nhân:** Thiếu `NODE_MAILER_EMAIL` trong `.env.local`
- **Giải pháp:** Thêm biến môi trường và restart server

**Lỗi: "Failed to send email"**
- **Nguyên nhân:** 
  - `NODE_MAILER_APP_PASSWORD` sai hoặc chưa set
  - SMTP configuration không đúng
- **Giải pháp:** 
  - Kiểm tra App Password từ Zoho
  - Kiểm tra `ZOHO_SMTP_HOST` và `ZOHO_SMTP_PORT`
  - Xem terminal logs để biết lỗi chi tiết

**Lỗi: "Cấu hình Mailchimp chưa được thiết lập"**
- **Nguyên nhân:** Thiếu một trong các biến: `MAILCHIMP_API_KEY`, `MAILCHIMP_SERVER_PREFIX`, `MAILCHIMP_AUDIENCE_ID`
- **Giải pháp:** Thêm đầy đủ các biến môi trường và restart server

**Lỗi: "401 Unauthorized" từ Mailchimp**
- **Nguyên nhân:** API Key không đúng hoặc không có quyền
- **Giải pháp:** 
  - Kiểm tra lại API Key trong Mailchimp
  - Đảm bảo API Key có format: `xxxxx-us1` (có server prefix)

**Lỗi: "404 Not Found" từ Mailchimp**
- **Nguyên nhân:** 
  - `MAILCHIMP_AUDIENCE_ID` sai
  - `MAILCHIMP_SERVER_PREFIX` không đúng với API Key
- **Giải pháp:** 
  - Kiểm tra Audience ID trong Mailchimp Dashboard
  - Kiểm tra server prefix trong API Key (phần sau dấu `-`)

### Lưu ý

- **Lỗi "Could not establish connection. Receiving end does not exist":** Đây là lỗi từ browser extension, không phải từ code. Có thể bỏ qua nếu không ảnh hưởng đến chức năng.

- **Logs chỉ hiển thị trong Development mode:** Khi chạy `npm run dev`, logs sẽ hiển thị. Khi build production (`npm run build`), logs sẽ không hiển thị.

- **Restart server sau khi thay đổi `.env.local`:** Sau khi thay đổi biến môi trường, cần restart dev server để áp dụng thay đổi.

## 📄 License

Liên hệ với tác giả để được toàn quyền sử dụng bộ source này.

---

**Tác giả**: Nguyễn Hữu Phước  
**Website**: [nguyenhuuphuoc.com](https://nguyenhuuphuoc.com)  
**Email**: lienhe@nguyenhuuphuoc.com
