# Hướng dẫn Upload Code lên GitHub

## Các bước thực hiện:

### 1. Kiểm tra trạng thái hiện tại
```bash
cd D:\PHUOC\Websites\web2
git status
```

### 2. Thêm tất cả các file đã thay đổi và file mới
```bash
git add .
```

Hoặc thêm từng file cụ thể:
```bash
git add actions/posts/queries.ts
git add app/(public)/(home)/page.tsx
git add app/(public)/layout.tsx
git add app/globals.css
git add app/layout.tsx
git add components/
git add tailwind.config.ts
git add app/(public)/(home)/_components/
git add app/(public)/dich-vu/
git add app/(public)/gioi-thieu/
```

### 3. Commit các thay đổi
```bash
git commit -m "Redesign homepage: Update header, footer, add new components and pages

- Redesign header with new menu layout (Trang chủ, Giới thiệu, Dịch vụ, Liên hệ)
- Add theme toggle with moon/sun icons
- Add search button
- Update footer with social media links
- Create hero section component
- Create discover category component
- Create newsletter component
- Add Giới thiệu and Dịch vụ pages
- Update all text to Vietnamese
- Fix theme provider hydration issues
- Improve responsive design"
```

### 4. Push lên GitHub
```bash
git push origin main
```

Nếu có conflict hoặc cần force push:
```bash
git push origin main --force
```

## Lưu ý:
- Đảm bảo file `.env` và `.env.local` đã được ignore (đã có trong .gitignore)
- Không commit file nhạy cảm như API keys, passwords
- Nếu muốn tạo branch mới trước khi merge:
  ```bash
  git checkout -b feature/homepage-redesign
  git push origin feature/homepage-redesign
  ```

