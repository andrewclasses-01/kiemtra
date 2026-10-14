# kiemtra — trang KIỂM TRA ĐẦU VÀO (kiemtra.andrewclasses.com)

## Mục đích
Học sinh kiểm tra đầu vào đăng nhập bằng ID + mật khẩu thầy cấp (dashboard andrewclasses.com › Kho bài › KT ĐẦU VÀO),
làm lần lượt các phần của BỘ ĐỀ thầy PHÁT (A = bộ cũ 3 phần, AWord `kiemtra.html` · B = lớp 3–4, 6 phần · C = B1, 8 phần có nghe — B/C dùng AWord `kiemtra2.html`).
Chưa phát ⇒ em thấy màn chờ "Bài kiểm tra chưa được mở", trang hỏi lại token mỗi 5 s; thầy bấm PHÁT BÀI ở dashboard ⇒ claim `phat` ⇒ trang tự mở bài.

## Chạy / thử
- GitHub Pages (nhánh `main`, CNAME kiemtra.andrewclasses.com). Đẩy lên là live sau ~1 phút.
- Trên máy: `python -m http.server 8136 --directory "E:/LAP TRINH APP/kiemtra"` (launch.json `kiemtra-me` ở D:\OTHERS\CLAUDE\.claude)
  rồi mở `bai.html?thu=1` (không đăng nhập, em giả ZTESTKT). Thêm `&aword=http://localhost:5591` để khung trỏ về AWord đang chạy trên máy.
- ⛔ Sửa CSS/JS ⇒ TĂNG số `?v=` trong `bai.html` / `index.html` (máy học sinh giữ bản cũ).

## Kiến trúc
- `index.html` + `js/dangnhap.js` — đăng nhập (chỉ nhận tài khoản có claim `ktdv`).
- `bai.html` + `js/bai.js` — tên em + 3 phần; phần sau mở khi phần trước báo `xong` (postMessage `AWORD:KT` từ AWord).
  Mã 3 bài giao ở `BAI` — ⛔ phải khớp myLesson web `js/ktdv-ql.js`.
  Nút PHÓNG TO góc dưới phải mỗi khung (CSS `.kb-khung.phong`, không dời iframe ⇒ không tải lại).
- `js/phien.js` — phiên Firebase Auth (aword-70dae) + cấp VÉ cho khung AWord (`AWORD:XIN_VE` ⇒ `AWORD:VE`). ⛔ LỌC claim `phat` theo danh sách bộ (`/^[ABC]$/`) — thêm bộ phải sửa cả đây.
- `css/nw.css`, `assets/`, `js/app-check.js` — chép từ myLesson web.
- `kq.html` + `js/kq.js` + `css/kq.css` — TRANG PHỤ HUYNH (không đăng nhập): `/kq?c=<mã>` đọc Firestore `ktdvChiaSe/<mã>` bằng REST, dựng bằng `js/ktdv-bc.js`.
  ⛔ `js/ktdv-bc.js` là BẢN CHÉP của myLesson web `js/ktdv-bc.js` (dashboard dùng chung) — sửa một bên phải chép sang bên kia.
- **Claude chấm lại bài KT đầu vào (khi thầy yêu cầu):** `E:\LAP TRINH APP\myLesson Web\tools\claude-cham-lai.js` — `--ds [--ngay D/M] [--ten …]` xem ai nộp ngày nào ·
  `--xuat <ID>` ra JSON để đọc · `--ghi file.json` ghi lời giải thích kỹ như cột "Nhận xét" Excel + đổi Đúng/Sai vào `ktdvBaoCao/<ID>` · `--go <ID>` gỡ. Chi tiết đầu file tool. Link PH đã gửi chỉ đổi khi thầy bấm "Cập nhật link PH".
- Logic làm bài (hướng dẫn, làm thử, lưu tiến độ, lượt dở, khoá đã nộp) nằm ở repo AWord: `kiemtra.js` / `kiemtra.css`.

## Khám phá quan trọng
- ⛔⛔ **THÊM BỘ ĐỀ MỚI ⇒ sửa ĐỦ 6 chỗ ở 3 repo** (14/10/2026 quên `phien.js` ⇒ em được phát Bộ B1 kẹt mãi màn chờ, lỗi IM LẶNG — xem Chặng 9 GHI CHU):
  1. kiemtra `js/bai.js` BO_DE · 2. kiemtra `js/phien.js` (lọc claim `phat`) · 3. myLesson Web `js/ktdv-ql.js` BO_DE · 4. myLesson Web `tools/claude-cham-lai.js` BO_DE ·
  5. myLesson `may-chu/functions/ktdv.js` BO_DE (+ deploy function) · 6. myLesson `may-chu/functions/xoa-ktdv-thu.js` CODES. Trang thử andrewclasses-thu chép bằng `dong-bo-trang-thu.py`.
  Rà: grep một mã bài bộ cũ (vd `x98bsj`) ở cả 3 repo. Thử bằng ĐƯỜNG THẬT (tài khoản thử → PHÁT → đăng nhập kiemtra), vì `bai.html?thu=1&bo=X` bỏ qua `phien.js`.
- Dashboard "Đã phát" mà em vẫn ở màn chờ ⇒ soi `phien.js` trước. Sửa JS trang này thì em đang mở trang phải F5 (màn chờ không tự tải mã mới).
- Nút phóng to nằm ĐÈ lên góc khung ⇒ AWord `kiemtra.css` dồn hàng nút hướng dẫn sang trái khi khung ≤820px. Đổi chỗ nút thì sửa cả bên đó.
- Repo dùng CRLF; `sed -i` trên Git Bash làm mất CRLF — sửa bằng Edit/Python `wb`.

## Roadmap
Xem mục VIỆC ĐANG CHỜ cuối `GHI CHU DU AN.md`.
