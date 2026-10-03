/* ============================================================
   kq.js — TRANG PHỤ HUYNH xem kết quả kiểm tra đầu vào (kiemtra.andrewclasses.com/kq?c=<mã>), 03/10/2026.
   KHÔNG đăng nhập, KHÔNG nạp Firebase SDK (nhẹ cho điện thoại phụ huynh): đọc đúng MỘT tài liệu bằng REST
     GET .../documents/ktdvChiaSe/<mã>?key=<khoá web công khai>
   Luật Firestore: `ktdvChiaSe/{mã}` — get = ai cũng được (phải biết mã 10 ký tự ngẫu nhiên), list = cấm, ghi = chỉ thầy.
   Tài liệu: { json: "<ảnh chụp>", capNhat }. Ảnh chụp KHÔNG có ID đăng nhập / dữ liệu quá trình làm bài (xem js/ktdv-bc.js).
   Thầy thu hồi link = xoá tài liệu ⇒ trang này báo "link không còn hiệu lực".
   ============================================================ */
(function () {
  'use strict';
  var API_KEY = 'AIzaSyAV_yoyAQM2fKKdOsJyuAxxf4AN7MsF7XY';   // khoá web CÔNG KHAI (cùng config.js myLesson web)
  var DOC = 'https://firestore.googleapis.com/v1/projects/aword-70dae/databases/(default)/documents/ktdvChiaSe/';
  var khung = document.getElementById('kq'), nutIn = document.getElementById('in');

  function loi(tieu, chu) { khung.innerHTML = '<div class="kq-loi"><b>' + tieu + '</b>' + chu + '</div>'; }
  var m = /[?&]c=([A-Za-z0-9]{6,20})/.exec(location.search);
  if (!m) return loi('Chưa có mã kết quả', 'Phụ huynh vui lòng mở đúng đường link thầy Andrew đã gửi.');
  var ma = m[1].toLowerCase();

  function doc(lan) {
    return fetch(DOC + encodeURIComponent(ma) + '?key=' + API_KEY, { cache: 'no-store' }).then(function (r) {
      if (r.status === 404 || r.status === 403) { var e = new Error('KHONG_CO'); e.mat = true; throw e; }
      if (!r.ok) throw new Error('HTTP_' + r.status);
      return r.json();
    })['catch'](function (e) { if (!e.mat && lan < 2) return new Promise(function (ok) { setTimeout(ok, 900); }).then(function () { return doc(lan + 1); }); throw e; });
  }
  doc(0).then(function (d) {
    var s = JSON.parse(d.fields.json.stringValue);
    var st = document.createElement('style'); st.textContent = window.KTDV_BC.css; document.head.appendChild(st);
    khung.innerHTML = window.KTDV_BC.html(s);
    document.title = 'Kết quả kiểm tra đầu vào — ' + (s.ten || 'Andrew Classes');
    nutIn.hidden = false; nutIn.onclick = function () { window.print(); };
  }, function (e) {
    if (e && e.mat) loi('Link này không còn hiệu lực', 'Link có thể đã được thu hồi hoặc nhập chưa đúng. Phụ huynh vui lòng nhắn thầy Andrew qua Zalo 0359.769.765 để được gửi lại.');
    else loi('Chưa mở được kết quả', 'Phụ huynh kiểm tra mạng rồi tải lại trang giúp thầy. Nếu vẫn lỗi, nhắn thầy Andrew qua Zalo 0359.769.765.');
  });
})();
