# Hướng Dẫn Upload Source Code lên GitHub

## 📋 Kiểm tra trước khi upload

### 1. Đảm bảo các file nhạy cảm đã được ignore
Các file sau đã được thêm vào `.gitignore`:
- `.env` và `.env*.local` (chứa API keys, secrets)
- `node_modules/` (dependencies)
- `.next/` (build files)
- `.vercel/` (deployment config)

### 2. Kiểm tra trạng thái Git
```bash
cd D:\PHUOC\Websites\web2
git status
```

## 🚀 Các bước upload lên GitHub

### Bước 1: Kiểm tra remote repository
```bash
git remote -v
```

Nếu chưa có remote, thêm remote:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Bước 2: Thêm tất cả các file thay đổi
```bash
git add .
```

Hoặc thêm từng file cụ thể:
```bash
# Các file đã sửa đổi
git add actions/posts/queries.ts
git add app/(public)/(home)/page.tsx
git add app/(public)/layout.tsx
git add app/globals.css
git add app/layout.tsx
git add components/
git add tailwind.config.ts

# Các file mới
git add app/(public)/(home)/_components/
git add app/(public)/dich-vu/
git add app/(public)/gioi-thieu/
git add components/providers/
git add components/public/layout/header/theme-toggle.tsx
git add components/public/layout/header/search-button.tsx
```

### Bước 3: Commit với message mô tả
```bash
git commit -m "Redesign homepage: Update header, footer, add new components and pages

✨ Features:
- Redesign header with new menu layout (Trang chủ, Giới thiệu, Dịch vụ, Liên hệ)
- Add theme toggle with moon/sun icons (light mode shows moon, dark mode shows sun)
- Add search button with dialog
- Update footer with social media links (Facebook, YouTube, Zalo)
- Create hero section component with featured posts
- Create discover category component with filtering
- Create newsletter component
- Add Giới thiệu and Dịch vụ pages

🌐 Localization:
- Translate all UI text to Vietnamese
- Update menu items to Vietnamese
- Update category and newsletter sections

🐛 Fixes:
- Fix theme provider hydration issues
- Fix logo flash issue when switching themes
- Hide circle background in dark mode
- Improve responsive design

🎨 UI/UX Improvements:
- Improve menu layout and spacing
- Optimize header layout for better responsiveness
- Update color scheme to match design requirements
- Enhance dark mode support"
```

### Bước 4: Push lên GitHub

#### Nếu đây là lần đầu push:
```bash
git push -u origin main
```

#### Nếu đã có remote:
```bash
git push origin main
```

#### Nếu có conflict, pull trước:
```bash
git pull origin main --rebase
git push origin main
```

#### Nếu cần force push (cẩn thận!):
```bash
git push origin main --force
```

## 📝 Tạo Branch mới (Khuyến nghị)

Nếu muốn tạo branch mới trước khi merge vào main:

```bash
# Tạo và chuyển sang branch mới
git checkout -b feature/homepage-redesign

# Commit các thay đổi
git add .
git commit -m "Redesign homepage..."

# Push branch mới lên GitHub
git push origin feature/homepage-redesign
```

Sau đó tạo Pull Request trên GitHub để review trước khi merge.

## 🔍 Kiểm tra sau khi upload

1. Vào GitHub repository và kiểm tra:
   - Tất cả file đã được upload
   - Commit message rõ ràng
   - Không có file nhạy cảm (.env, etc.)

2. Kiểm tra trên GitHub:
   ```bash
   git log --oneline -5
   ```

## ⚠️ Lưu ý quan trọng

1. **KHÔNG commit file `.env`** - Chứa thông tin nhạy cảm
2. **KHÔNG commit `node_modules/`** - Quá lớn, không cần thiết
3. **KHÔNG commit `.next/`** - Build files, sẽ được generate lại
4. **Kiểm tra kỹ trước khi force push** - Có thể ghi đè code của người khác

## 🛠️ Script tự động (PowerShell)

Chạy file `upload-to-github.ps1` để tự động hóa quá trình:

```powershell
cd D:\PHUOC\Websites\web2
.\upload-to-github.ps1
```

## 📦 Files đã được thay đổi/thêm mới

### Files đã sửa đổi:
- `actions/posts/queries.ts` - Thêm author vào query
- `app/(public)/(home)/page.tsx` - Cập nhật homepage layout
- `app/(public)/layout.tsx` - Sửa layout và ẩn circle-bg trong dark mode
- `app/globals.css` - Thêm custom styles
- `app/layout.tsx` - Sửa theme provider và metadata
- `components/logo.site.tsx` - Tối ưu logo
- `components/public/layout/footer.tsx` - Cập nhật footer
- `components/public/layout/header/header.tsx` - Redesign header
- `components/public/layout/header/public-navbar-menu.tsx` - Cập nhật menu
- `components/public/layout/header/public-navbar-menu-mobile.tsx` - Cập nhật mobile menu
- `tailwind.config.ts` - Thêm custom colors

### Files mới:
- `app/(public)/(home)/_components/hero-section.tsx`
- `app/(public)/(home)/_components/blog-card.tsx`
- `app/(public)/(home)/_components/discover-category.tsx`
- `app/(public)/(home)/_components/newsletter.tsx`
- `app/(public)/dich-vu/page.tsx`
- `app/(public)/gioi-thieu/page.tsx`
- `components/providers/providers.tsx`
- `components/providers/theme-provider.tsx`
- `components/public/layout/header/theme-toggle.tsx`
- `components/public/layout/header/search-button.tsx`

## ✅ Checklist trước khi push

- [ ] Đã test tất cả tính năng mới
- [ ] Không có lỗi TypeScript/ESLint
- [ ] File `.env` đã được ignore
- [ ] Đã commit với message rõ ràng
- [ ] Đã kiểm tra `git status` trước khi push
- [ ] Đã backup code quan trọng (nếu cần)

---

**Chúc bạn upload thành công! 🎉**

