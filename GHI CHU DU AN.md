# GHI CHÚ DỰ ÁN — kiemtra (kiemtra.andrewclasses.com)

## Chặng 1 (02/10/2026) — dựng trang
Trang đăng nhập ENTRANCE EXAM + trang làm 3 bài nhúng AWord `kiemtra.html` (AWord Đợt 440). Xem README.md.

## Chặng 2 (02/10/2026 tối) — nút PHÓNG TO + chip trạng thái ngang dòng BT + "Đã nộp ✓" · phiên máy MSI
**Thầy:** (1) thêm nút zoom rộng kín cửa sổ (không phải full screen thật) ở góc dưới phải để em mở rộng nếu muốn;
(2) chip Đang mở/Chưa mở bị cao — phải nằm đúng tâm dòng BT; (3) bài đã gửi ⇒ "Đã nộp ✓" xanh lá.
Cùng đợt bên AWord (Đợt 442): không cuộn trong khung, lưu mọi lượt, khoá làm lại sau khi nộp — xem GHI CHU AWord.

**Đã làm (`js/bai.js`, `css/kiemtra.css`, `bai.html`):**
- Nút `.kb-phong` (icon Lucide maximize-2 / minimize-2) trong mỗi khung đã mở. Bấm ⇒ `.kb-khung.phong` = `position:fixed; inset:0`
  + `body.kb-dang-phong{overflow:hidden}`. KHÔNG dời iframe trong DOM ⇒ trang bài không tải lại (đã thử: phim hướng dẫn vẫn chạy tiếp).
  Thu nhỏ: bấm lại / phím Esc; tự thu khi em vừa nộp xong phần (trước khi cuộn sang phần sau).
- Tiêu đề phần: "PHẦN n / 3" dòng trên, dưới là `.kb-phan-ten` = tên bài + chip cùng hàng (flex, căn giữa). Đo lệch tâm chip ↔ h2 = 0px cả 3 phần,
  máy tính + điện thoại. Điện thoại: h2 16px, ẩn "· n câu", không xuống dòng.
- Chip xong: "Đã nộp ✓" nền #1F9D55 chữ trắng (trước: "✓ Đã xong" xanh nhạt).
- Bàn thử: `bai.html?thu=1&aword=http://localhost:<cổng>` (chỉ nhận http://localhost|127.0.0.1) ⇒ khung trỏ về AWord trên máy; origin kiểm message theo đó.
- `?v=2` cho kiemtra.css + bai.js.

**Lỗi gặp:** `sed -i` (Git Bash) đổi bai.html từ CRLF sang LF ⇒ chuyển lại bằng Python.

## VIỆC ĐANG CHỜ
- Thử bằng tài khoản KT đầu vào thật (có vé): làm dở + Làm lại + nộp ⇒ xem dashboard.
- Thử điện thoại thật.
