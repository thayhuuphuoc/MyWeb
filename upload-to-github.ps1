# Script để upload code lên GitHub
# Chạy script này trong PowerShell: .\upload-to-github.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Upload Source Code lên GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Di chuyển vào thư mục web2
Set-Location $PSScriptRoot

# Kiểm tra trạng thái
Write-Host "[1/4] Kiểm tra trạng thái Git..." -ForegroundColor Yellow
git status
Write-Host ""

# Xác nhận tiếp tục
Write-Host "Bạn có muốn tiếp tục? (Y/N)" -ForegroundColor Cyan
$confirm = Read-Host
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Đã hủy." -ForegroundColor Red
    exit
}

# Thêm tất cả file
Write-Host ""
Write-Host "[2/4] Thêm tất cả các file thay đổi..." -ForegroundColor Yellow
git add .
Write-Host "✅ Đã thêm tất cả file" -ForegroundColor Green
Write-Host ""

# Commit
Write-Host "[3/4] Commit các thay đổi..." -ForegroundColor Yellow
$commitMessage = @"
Redesign homepage: Update header, footer, add new components and pages

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
- Enhance dark mode support
"@

git commit -m $commitMessage
Write-Host "✅ Đã commit thành công" -ForegroundColor Green
Write-Host ""

# Push
Write-Host "[4/4] Push lên GitHub..." -ForegroundColor Yellow
Write-Host "Bạn có muốn push lên GitHub không? (Y/N)" -ForegroundColor Cyan
$response = Read-Host

if ($response -eq "Y" -or $response -eq "y") {
    Write-Host ""
    Write-Host "Đang push lên GitHub..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Đã push code lên GitHub thành công!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Bạn có thể kiểm tra tại: https://github.com/YOUR_USERNAME/YOUR_REPO" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "❌ Có lỗi xảy ra khi push. Vui lòng kiểm tra lại." -ForegroundColor Red
        Write-Host "Thử chạy: git push origin main" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "⚠️  Đã commit nhưng chưa push." -ForegroundColor Yellow
    Write-Host "Bạn có thể push sau bằng lệnh: git push origin main" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Hoàn tất!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

