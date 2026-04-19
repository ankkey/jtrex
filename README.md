# 🦕 Dino Enhanced — Chrome Dino Game Mod

> Bản tái tạo game khủng long offline của Google Chrome, với đồ họa pixel art trung thực và nhiều tính năng mới hấp dẫn.

---

## 🚀 Cách chơi offline

1. Tải xuống toàn bộ 3 file: `index.html`, `index.css`, `index.js`
2. Đặt chúng vào cùng một thư mục
3. Mở file `index.html` bằng trình duyệt (Chrome, Firefox, Edge...)
4. Không cần internet!

---

## 🎮 Điều khiển

| Phím | Hành động |
|------|-----------|
| `Space` / `↑` | Nhảy (nhảy 2 lần liên tiếp) |
| `↓` | Cúi người tránh pterodactyl thấp |
| `X` | Bắn súng (mở khóa ở 1000 điểm) |
| **Mobile** | Chạm phải = nhảy · Chạm trái = bắn |

---

## 🏆 Mốc mở khóa

| Điểm | Phần thưởng |
|------|------------|
| **100** | 🦅 **Pterodactyl đồng minh** — bay theo sau, tự động tiêu diệt pterodactyl địch |
| **250** | 🛸 **UFO hộ tống** — bay phía trước, tự động bắn phá chướng ngại vật (hồi 2s) |
| **500** | 📦 **Thùng gỗ xuất hiện** — va chạm gây chậm + trừ điểm; UFO có thể bắn phá |
| **600** | 🐢 **Slime ngược chiều** — chạm vào giảm tốc 20% trong 5 giây |
| **1000** | 🔫 **Súng trên lưng** — nhấn X để bắn đạn nổ, hồi chiêu 5s |

> Mỗi 100 điểm, tốc độ tăng thêm 0.5 đơn vị.

---

## ⚡ Vật phẩm ngẫu nhiên

| Icon | Tên | Hiệu ứng |
|------|-----|---------|
| ⭐ | Bất tử | Miễn tử vong trong 5 giây |
| 🛡 | Khiên bảo vệ | Hấp thụ 1 cú va chạm tử vong |

---

## 😂 Tin nhắn khi thua

Mỗi khi thua game, một câu roast ngẫu nhiên sẽ xuất hiện (không lặp lại liên tiếp):

- *"địt mẹ mày đồ ngu 😂"*
- *"AHAHA không qua được à?"*
- *"ngu vcl luôn á 💀"*
- *"Dậy múa đi, sao không múa nữa 🕺"*
- *"Phải gì ạ? Phải gì ạ? Phải gìiii? Phải chịuuuuu !!!!!"*

---

## 🌙 Chế độ ban đêm

Sau mỗi ~700 frame, màn chơi sẽ chuyển sang chế độ ban đêm tối màu (giống Chrome gốc).

---

## 📁 Cấu trúc file

```
dino-enhanced/
├── index.html    ← Giao diện chính + layout thông tin
├── index.css     ← Stylesheet cho trang
├── index.js      ← Toàn bộ logic game (canvas, physics, AI)
└── README.md     ← File này
```

> **Không cần thư viện ngoài** — 100% Vanilla JS + HTML5 Canvas.  
> Đồ họa pixel art được vẽ trực tiếp bằng Canvas API, không cần file ảnh.

---

## 🛠 Kỹ thuật

- **Rendering**: HTML5 Canvas 2D, pixel art tay tạo bằng mảng 2D
- **Physics**: AABB collision detection, double-jump, variable gravity
- **AI**: Pterodactyl đồng minh tự tìm và diệt địch; UFO auto-aim
- **Lưu điểm cao**: `localStorage`
- **Responsive**: Tự co giãn theo kích thước màn hình

---

*Made with ❤️ and too many cacti.*
