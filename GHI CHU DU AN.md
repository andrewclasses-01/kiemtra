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

## Chặng 3 (03/10/2026) — TRANG PHỤ HUYNH `kq.html`: link ngắn xem kết quả ngay trên trình duyệt · phiên máy MSI
**Thầy:** (1) làm lại báo cáo kết quả cho phụ huynh: đơn giản, dễ nhìn, có biểu đồ; phần chi tiết (phân tích quá trình làm bài…) chỉ cho giáo viên,
sau một nút riêng ít dùng; (2) tạo kho riêng để khi gửi kết quả có ngay link ngắn — phụ huynh bấm là xem, không tải/mở file.

**Đã làm:**
- `kq.html` + `js/kq.js` + `css/kq.css`: trang KHÔNG đăng nhập, đọc đúng 1 tài liệu Firestore `ktdvChiaSe/<mã>` bằng REST (không nạp Firebase SDK ⇒ nhẹ).
  Link: `https://kiemtra.andrewclasses.com/kq?c=<mã 10 ký tự a-z2-9 ngẫu nhiên>`. Mã sai/đã thu hồi ⇒ "Link này không còn hiệu lực" + Zalo thầy.
  `og:` chỉ chung chung (không lộ tên con trong xem trước Zalo). Nút In / Lưu PDF.
- `js/ktdv-bc.js` — bộ dựng HTML báo cáo phụ huynh (vòng tròn % chung + 3 thanh ngang + nhận xét "Con làm tốt / Con cần cải thiện" + các câu chưa đúng gập sẵn).
  ⛔ BẢN CHÉP: có bản y hệt ở myLesson web `js/ktdv-bc.js` (dashboard dùng để xem trước + sửa nhận xét). Sửa một bên thì chép sang bên kia + tăng `?v=`.
- Mức đánh giá chung theo %: ≥85 Rất tốt · ≥70 Khá · ≥50 Trung bình · <50 Cần củng cố nền tảng (hàm `muc` trong ktdv-bc.js — thầy muốn đổi ngưỡng/từ thì sửa ở đó).
- Ảnh chụp lưu ở `ktdvChiaSe/<mã>` = `{json, capNhat}`; KHÔNG có ID đăng nhập, KHÔNG có thời gian/rời trang/nghi dịch. Dashboard (myLesson web v1.239.0 `js/ktdv-ql.js`)
  tạo/cập nhật/thu hồi link; luật Firestore đăng bằng `myLesson Web/tools/dang-luat-ktdv-chiase.js` (get = ai biết mã · list cấm · ghi = chỉ thầy).

**Lỗi gặp:** hàm tạo mã dùng `Uint8Array` chưa `getRandomValues` ở lượt đầu ⇒ mã toàn "aaaaaaaaaa" — bắt được ở bàn thử kho giả, đã sửa.

## Chặng 4 (03/10/2026 chiều) — trang phụ huynh liệt kê TỪNG CÂU như sheet Excel (đúng + sai + giải thích)
**Thầy:** trang đánh giá gửi phụ huynh phải có chi tiết câu nào sai, sai gì; câu đúng cũng liệt kê, trình bày như các sheet BT1/BT2/BT3 trong
`12.9.2026 DUNG.xlsm` (STT · Cụm từ gốc · Bài làm · Nhận xét). Khác một chút: chỉ đúng/sai, KHÔNG cho điểm từng câu; % kết luận = câu đúng / tổng số câu.

**Đã làm (`js/ktdv-bc.js` v2, bản chép ở myLesson web):**
- Ảnh chụp `v:2`: mỗi bài có `ds:[{i,q,y,c,ok,g}]` = TẤT CẢ câu (thay `sai` cũ). Mỗi bài một khối mở sẵn: bảng STT · Đề · Con viết · Nhận xét
  (✓ Đúng / ✗ Sai + lời giải thích + "Đáp án đúng"); câu sai nền hồng. Điện thoại: mỗi câu thành một thẻ xếp dọc. In/PDF mở hết.
- Bỏ nhãn mức "Trung bình/Khá…" ở vòng tròn — chỉ còn "Tỉ lệ câu đúng" + `d / n câu` (+ màu vòng theo %). Thanh từng bài ghi "x/n câu đúng · %".
- Lời giải thích câu sai (`goiY`): NHÁP tự động so từng từ (để trống · sai mạo từ a/an · dư/thiếu "s" · sai chính tả · thiếu/thừa từ · dùng từ chưa đúng) —
  thầy sửa ngay trong ô (textarea) ở bản xem trước; lưu ở `ktdvBaoCao/{ID}.ghiChu["BT1:7"]`. Chưa sửa thì ảnh chụp lấy nháp.
  Nháp chỉ là so chữ, không hiểu ngữ pháp sâu như lời Claude viết trong Excel (vd "chủ ngữ số nhiều phải dùng are") ⇒ thầy nên đọc lại câu sai trước khi gửi.
**VIỆC ĐANG CHỜ:** thầy dùng thử trên dashboard thật + đọc lại nháp giải thích; có thể muốn Claude viết lời giải thích kỹ cho từng em (như skill kiemtradauvao) rồi đổ vào `ghiChu`.

## Chặng 5 (03/10/2026 chiều) — CHẤM CHI TIẾT TỰ ĐỘNG câu sai (không cần gọi Claude)
**Thầy:** học sinh làm xong, mở dashboard là có kết quả chấm chi tiết luôn; thêm phần chấm chi tiết tự động rồi cho xem kết quả em đã nộp hôm trước.
**Đã làm (`js/ktdv-bc.js?v=3`, `js/ktdv-ql.js?v=4`):**
- `goiY` viết lại: nhận ra để trống · lệch quá nhiều ý · sai chính tả (cả khi cùng lúc sai nhiều chỗ) · sai/thiếu/thừa a/an · số ít–số nhiều (kể cả bất quy tắc foot/feet…) ·
  thêm/bớt "s" động từ · sai thì quá khứ (help→helped, sleep→slept…) · sai/thiếu "to be" · thiếu did/do/does/will/have/has/had/been/can/to · thiếu từ chỉ thời gian · dạng từ.
  Ghép từng cặp (con viết ↔ đáp án) rồi giải thích; lời trùng được gộp; tối đa 3 ý/câu.
- "Tạo nháp nhận xét": giờ nêu NHÓM LỖI CHÍNH có đếm ("chủ yếu do thiếu a/an (25 câu), để trống (6 câu)…") thay vì chép 3 ví dụ (ví dụ đã nằm ở bảng từng câu).
- Đo trên dữ liệu THẬT em Ngọc Ánh nộp 2/10 (103 câu sai): đa số ra lời cụ thể; ~4 câu lệch quá nhiều ra câu "dịch chưa đúng ý — đối chiếu đáp án".
  Dữ liệu đọc bằng khoá quản trị, CHỈ ĐỌC; bàn thử kho giả chạy đúng `ktdv-ql.js` với dữ liệu thật (file thử đã xoá, không commit).
**Giới hạn:** `correctText` chỉ là đáp án đầu trong danh sách chấp nhận ⇒ em viết từ đồng nghĩa (usually ↔ often) bị chấm sai và lời giải thích nói "đáp án dùng …" — thầy bấm Chi tiết giáo viên đổi Đúng/Sai khi cần.

## VIỆC ĐANG CHỜ
- ✅ Luật `ktdvChiaSe` đã đăng (ruleset b16182de, `--kiem` 11/11), 2 repo đã push, live kiểm bằng tài liệu thử (đã xoá).
- ⬜ Thầy thử Gửi phụ huynh bằng tài khoản thầy thật trên dashboard (phiên này chưa đăng nhập thầy được).
- Thử bằng tài khoản KT đầu vào thật (có vé): làm dở + Làm lại + nộp ⇒ xem dashboard.
- Thử điện thoại thật (mở link `kq?c=…` trên Zalo/Safari).
