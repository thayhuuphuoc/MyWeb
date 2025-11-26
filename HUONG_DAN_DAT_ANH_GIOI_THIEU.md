# Hướng dẫn đặt hình ảnh cho trang Giới thiệu

## Vị trí đặt ảnh

Để hiển thị hình ảnh cá nhân trên trang Giới thiệu, vui lòng đặt ảnh vào thư mục sau:

```
public/images/about/nguyen-huu-phuoc.jpg
```

## Yêu cầu về ảnh

- **Tên file**: `nguyen-huu-phuoc.jpg` (hoặc `.png`, `.webp`)
- **Kích thước khuyến nghị**: Tối thiểu 800x1000px (tỷ lệ 4:5)
- **Định dạng**: JPG, PNG, hoặc WebP
- **Chất lượng**: Ảnh rõ nét, chất lượng tốt

## Cách thay đổi tên file ảnh

Nếu bạn muốn sử dụng tên file khác, vui lòng chỉnh sửa file:

`app/(public)/gioi-thieu/page.tsx`

Tìm dòng:
```tsx
src="/images/about/nguyen-huu-phuoc.jpg"
```

Thay đổi thành tên file ảnh của bạn.

## Lưu ý

- Ảnh sẽ được hiển thị với tỷ lệ 4:5 (chiều rộng : chiều cao)
- Ảnh sẽ tự động resize để phù hợp với màn hình
- Trên mobile, ảnh sẽ hiển thị phía dưới nội dung
- Trên desktop, ảnh sẽ hiển thị bên trái nội dung


