# 🎨 Hướng Dẫn Thay Đổi Logo cho Web2

## 📋 Tổng Quan

Web2 đã được cập nhật để hỗ trợ 2 logo khác nhau:
- **Light mode**: Logo màu tối (hiển thị khi màn hình sáng)
- **Dark mode**: Logo màu sáng/trắng (hiển thị khi màn hình tối)

## 📁 Cấu Trúc Thư Mục

Logo cần được đặt trong thư mục:
```
web2/public/images/logo/
├── logo.svg          (Logo cho light mode - màu tối)
└── logo-white.svg    (Logo cho dark mode - màu sáng/trắng)
```

## 🔧 Các Bước Thực Hiện

### Bước 1: Tạo Thư Mục Logo (nếu chưa có)

```bash
cd D:\PHUOC\Websites\web2\public
mkdir images\logo
```

Hoặc tạo thủ công:
- Vào thư mục `web2/public`
- Tạo thư mục `images` (nếu chưa có)
- Tạo thư mục `logo` bên trong `images`

### Bước 2: Thêm Logo Files

Đặt 2 file logo vào thư mục `web2/public/images/logo/`:

1. **logo.svg** - Logo cho light mode (màu tối)
   - Hiển thị khi màn hình ở chế độ sáng
   - Nên dùng màu tối để nổi bật trên nền sáng

2. **logo-white.svg** - Logo cho dark mode (màu sáng/trắng)
   - Hiển thị khi màn hình ở chế độ tối
   - Nên dùng màu sáng/trắng để nổi bật trên nền tối

### Bước 3: Cập Nhật Config (Tùy chọn)

Nếu bạn muốn dùng logo với tên khác hoặc đường dẫn khác, chỉnh sửa file `web2/config/siteMetadata.ts`:

```typescript
const siteMetadata = {
	logoSrc: '/images/logo/logo.svg',        // Logo cho light mode
	logoDarkSrc: '/images/logo/logo-white.svg', // Logo cho dark mode
	// ... các config khác
}
```

### Bước 4: Kiểm Tra

1. Chạy dev server:
   ```bash
   npm run dev
   ```

2. Kiểm tra logo hiển thị:
   - Ở chế độ sáng: Logo màu tối (`logo.svg`)
   - Ở chế độ tối: Logo màu sáng (`logo-white.svg`)

## 📝 Lưu Ý

### Kích Thước Logo
- Logo được set mặc định: `width={135} height={35}`
- Bạn có thể thay đổi trong file `components/logo.site.tsx` nếu cần

### Định Dạng File
- Hỗ trợ: `.svg`, `.png`, `.jpg`, `.webp`
- Khuyến nghị dùng `.svg` để có chất lượng tốt nhất ở mọi kích thước

### Fallback
- Nếu không tìm thấy logo trong `siteMetadata`, sẽ dùng đường dẫn mặc định:
  - Light mode: `/images/logo/logo.svg`
  - Dark mode: `/images/logo/logo-white.svg`

## 🎯 Ví Dụ Code (Tham Khảo Web1)

Component logo đã được cập nhật tương tự như web1:

```tsx
<Link href="/">
    <Image 
        src={"/images/logo/logo.svg"} 
        alt="logo" 
        width={135} 
        height={35} 
        className="block dark:hidden"
    />
    <Image 
        src={"/images/logo/logo-white.svg"} 
        alt="logo" 
        width={135} 
        height={35} 
        className="hidden dark:block"
    />
</Link>
```

## ✅ Checklist

- [ ] Đã tạo thư mục `public/images/logo/`
- [ ] Đã thêm file `logo.svg` (logo cho light mode)
- [ ] Đã thêm file `logo-white.svg` (logo cho dark mode)
- [ ] Đã kiểm tra logo hiển thị đúng ở cả 2 chế độ
- [ ] Logo có kích thước phù hợp (khuyến nghị 135x35 hoặc tỷ lệ tương đương)

## 🔄 Nếu Muốn Dùng Logo Cũ

Nếu bạn muốn dùng logo cũ (`logo-g.png` và `logo-g-l.png`), cập nhật trong `siteMetadata.ts`:

```typescript
logoSrc: '/logo-g.png',
logoDarkSrc: '/logo-g-l.png',
```

---

**Chúc bạn thay đổi logo thành công! 🎉**


