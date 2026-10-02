# kiemtra.andrewclasses.com — Trang KIỂM TRA ĐẦU VÀO (Andrew Classes)

Thầy Andrew chốt 02/10/2026. Học sinh kiểm tra đầu vào đăng nhập bằng ID + mật khẩu thầy cấp trên dashboard
(Kho bài › KT ĐẦU VÀO), vào thẳng trang làm 3 bài.

- `index.html` + `js/dangnhap.js` — màn đăng nhập (giao diện y andrewclasses.com, chữ ENTRANCE EXAM). Chỉ nhận tài khoản có claim `ktdv`.
- `bai.html` + `js/bai.js` — trang làm bài: tên em + 3 phần, mỗi phần nhúng AWord `kiemtra.html?g=<mã bài giao>` (AWord Đợt 440).
  Mã 3 bài giao nằm ở `BAI` trong `js/bai.js` (⛔ khớp myLesson web `js/ktdv-ql.js`).
- `js/phien.js` — phiên Firebase Auth (aword-70dae) + CẤP VÉ cho khung AWord (`AWORD:XIN_VE` ⇒ `AWORD:VE`).
- `js/app-check.js` — bản chép myLesson web. `css/nw.css` + `assets/` — chép từ myLesson web (giao diện đăng nhập).

⛔ Kho này KHÔNG chứa dữ liệu học sinh. Bàn thử trên máy: `bai.html?thu=1` (localhost, không đăng nhập).
Hồ sơ + kết quả + báo cáo: dashboard andrewclasses.com (hàm máy chủ `qlKtdv`, kho `ktdvHoSo` / `ktdvBaoCao`).
