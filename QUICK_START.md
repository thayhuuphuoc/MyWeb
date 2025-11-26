# 🚀 Hướng Dẫn Nhanh Upload lên GitHub

## Cách 1: Dùng Script Tự Động (Khuyến nghị)

1. Mở PowerShell trong thư mục `web2`
2. Chạy lệnh:
   ```powershell
   .\upload-to-github.ps1
   ```
3. Làm theo hướng dẫn trên màn hình

## Cách 2: Chạy Lệnh Thủ Công

Mở PowerShell hoặc Terminal và chạy các lệnh sau:

```powershell
# 1. Di chuyển vào thư mục web2
cd D:\PHUOC\Websites\web2

# 2. Kiểm tra trạng thái
git status

# 3. Thêm tất cả file
git add .

# 4. Commit
git commit -m "Redesign homepage: Update header, footer, add new components and pages"

# 5. Push lên GitHub
git push origin main
```

## ⚠️ Lưu ý

- Đảm bảo file `.env` đã được ignore (đã có trong .gitignore)
- Nếu chưa có remote, thêm bằng:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
  ```

## 📖 Xem hướng dẫn chi tiết

Xem file `GITHUB_UPLOAD_GUIDE.md` để biết thêm chi tiết.


