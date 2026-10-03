# kiemtra — trang KIỂM TRA ĐẦU VÀO (kiemtra.andrewclasses.com)

## Mục đích
Học sinh kiểm tra đầu vào đăng nhập bằng ID + mật khẩu thầy cấp (dashboard andrewclasses.com › Kho bài › KT ĐẦU VÀO),
làm lần lượt 3 bài (BT1 cụm số ít · BT2 cụm số nhiều · BT3 tạo câu). Mỗi bài là một khung AWord `kiemtra.html`.

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
- `js/phien.js` — phiên Firebase Auth (aword-70dae) + cấp VÉ cho khung AWord (`AWORD:XIN_VE` ⇒ `AWORD:VE`).
- `css/nw.css`, `assets/`, `js/app-check.js` — chép từ myLesson web.
- `kq.html` + `js/kq.js` + `css/kq.css` — TRANG PHỤ HUYNH (không đăng nhập): `/kq?c=<mã>` đọc Firestore `ktdvChiaSe/<mã>` bằng REST, dựng bằng `js/ktdv-bc.js`.
  ⛔ `js/ktdv-bc.js` là BẢN CHÉP của myLesson web `js/ktdv-bc.js` (dashboard dùng chung) — sửa một bên phải chép sang bên kia.
- Logic làm bài (hướng dẫn, làm thử, lưu tiến độ, lượt dở, khoá đã nộp) nằm ở repo AWord: `kiemtra.js` / `kiemtra.css`.

## Khám phá quan trọng
- Nút phóng to nằm ĐÈ lên góc khung ⇒ AWord `kiemtra.css` dồn hàng nút hướng dẫn sang trái khi khung ≤820px. Đổi chỗ nút thì sửa cả bên đó.
- Repo dùng CRLF; `sed -i` trên Git Bash làm mất CRLF — sửa bằng Edit/Python `wb`.

## Roadmap
Xem mục VIỆC ĐANG CHỜ cuối `GHI CHU DU AN.md`.
