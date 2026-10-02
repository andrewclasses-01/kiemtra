/* bai.js — TRANG LÀM BÀI KIỂM TRA ĐẦU VÀO: tên em + 3 phần, mỗi phần là một khung AWord `kiemtra.html` (Đợt 440).
   Làm lần lượt: phần sau mở khi phần trước xong. AWord báo {type:'AWORD:KT', code, trangThai:'chua'|'dang-lam'|'xong'}.
   Em vừa làm xong một phần ⇒ cuộn xuống phần kế; xong phần cuối ⇒ "Chúc mừng em đã hoàn thành, hãy chờ kết quả từ thầy Andrew". */
(function () {
  'use strict';
  var P = window.KTP;
  // ⛔ PHẢI khớp dashboard myLesson `js/ktdv-ql.js` BAI (mã bài giao AWord, Courses / KIEM TRA DAU VAO).
  var BAI = [
    { code: '5576de', ma: 'BT1', ten: 'Tạo cụm số ít', n: 40 },
    { code: 'bc52sb', ma: 'BT2', ten: 'Tạo cụm số nhiều', n: 20 },
    { code: 'khszvm', ma: 'BT3', ten: 'Tạo câu', n: 50 }
  ];
  var $ = function (s) { return document.querySelector(s); };
  var THU = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).get('thu') === '1';
  // Bàn thử trên máy: `bai.html?thu=1&aword=http://localhost:5591` ⇒ khung trỏ về AWord đang chạy trên máy (chỉ localhost).
  var AWORD = P.AWORD_GOC;
  if (THU && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(new URLSearchParams(location.search).get('aword') || '')) AWORD = new URLSearchParams(location.search).get('aword');
  var TT = BAI.map(function () { return 'khoa'; });   // khoa | mo | xong
  var SVG_TO = '<svg viewBox="0 0 24 24"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>';      // Lucide maximize-2
  var SVG_NHO = '<svg viewBox="0 0 24 24"><path d="M4 14h6v6"/><path d="M20 10h-6V4"/><path d="M14 10l7-7"/><path d="M3 21l7-7"/></svg>';    // Lucide minimize-2
  var EM = null, daCuonDau = false;

  function E(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function chuCai(t) { var w = String(t || '?').trim().split(/\s+/); return (w[w.length - 1] || '?').charAt(0).toUpperCase(); }
  function av(cls) { return EM.anh ? '<img class="kb-av ' + (cls || '') + '" src="' + E(EM.anh) + '" alt="">' : '<span class="kb-av ' + (cls || '') + '">' + E(chuCai(EM.ten)) + '</span>'; }

  function veTrang() {
    $('#em').innerHTML = av() + '<span>' + E(EM.ten) + '</span>';
    var h = '<section class="kb-chao">' + av('lon') + '<div><h1>Chào ' + E(EM.ten) + '!</h1>' +
      '<p>Bài kiểm tra đầu vào gồm <b>3 phần</b>. Em làm lần lượt từng phần — mỗi phần có hướng dẫn và vài câu làm thử trước khi làm bài thật. ' +
      'Em tự làm, không dùng phần mềm dịch, không hỏi người khác nhé. Thầy Andrew sẽ gửi kết quả sau.</p></div></section>';
    h += '<nav class="kb-buoc" id="buoc">' + BAI.map(function (b, i) { return '<a href="#phan' + (i + 1) + '" data-i="' + i + '"><i>' + (i + 1) + '</i><span>' + b.ma + '. ' + E(b.ten) + '</span></a>'; }).join('') + '</nav>';
    h += BAI.map(function (b, i) {
      return '<section class="kb-phan" id="phan' + (i + 1) + '"><div class="kb-phan-dau"><div class="so">PHẦN ' + (i + 1) + ' / 3</div>' +
        '<div class="kb-phan-ten"><h2>' + b.ma + '. ' + E(b.ten.toUpperCase()) + ' <small>· ' + b.n + ' câu</small></h2>' +
        '<span class="kb-chip" id="chip' + i + '"></span></div></div>' +
        '<div class="kb-khung" id="khung' + i + '"><div class="kb-khoa"><div><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Làm xong phần ' + i + ' để mở phần này</div></div></div></section>';
    }).join('');
    h += '<section class="kb-het" id="het" hidden><div class="sao">🎉</div><h2>Chúc mừng em đã hoàn thành!</h2><p>Em đã làm xong cả 3 phần của bài kiểm tra đầu vào.<br>Hãy chờ kết quả từ thầy Andrew nhé.</p></section>';
    $('#than').innerHTML = h;
    moPhan(0);
    veTrangThai();
  }
  function moPhan(i) {
    if (i >= BAI.length || TT[i] !== 'khoa') return;
    TT[i] = 'mo';
    var b = BAI[i], k = $('#khung' + i);
    var src = AWORD + '/kiemtra.html?g=' + encodeURIComponent(b.code) + '&n=' + encodeURIComponent(EM.ten) + '&ma=' + encodeURIComponent(EM.ma) + '&nhung=1';
    k.innerHTML = '<iframe src="' + E(src) + '" title="' + E(b.ma + '. ' + b.ten) + '" allow="clipboard-write" loading="eager"></iframe>' +
      '<button type="button" class="kb-phong" title="Phóng to" aria-label="Phóng to">' + SVG_TO + '</button>';
    k.querySelector('.kb-phong').onclick = function () { phongTo(k.classList.contains('phong') ? null : k); };
  }
  // ⭐ Thầy 02/10: nút PHÓNG TO góc dưới phải — khung bài phủ kín cửa sổ trình duyệt (không phải toàn màn hình thật).
  // Chỉ đổi CSS (position:fixed), KHÔNG dời iframe trong DOM ⇒ trang bài không tải lại, em đang làm dở vẫn nguyên.
  function phongTo(k) {
    document.querySelectorAll('.kb-khung.phong').forEach(function (x) {
      x.classList.remove('phong');
      var n = x.querySelector('.kb-phong'); if (n) { n.innerHTML = SVG_TO; n.title = 'Phóng to'; n.setAttribute('aria-label', 'Phóng to'); }
    });
    document.body.classList.toggle('kb-dang-phong', !!k);
    if (!k) return;
    k.classList.add('phong');
    var n = k.querySelector('.kb-phong'); n.innerHTML = SVG_NHO; n.title = 'Thu nhỏ'; n.setAttribute('aria-label', 'Thu nhỏ');
    var f = k.querySelector('iframe'); try { f && f.focus(); } catch (e) { }
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') phongTo(null); });
  function veTrangThai() {
    BAI.forEach(function (b, i) {
      var c = $('#chip' + i), a = document.querySelector('#buoc [data-i="' + i + '"]');
      c.dataset.tt = TT[i]; a.dataset.tt = TT[i];
      c.textContent = TT[i] === 'xong' ? 'Đã nộp ✓' : TT[i] === 'mo' ? 'Đang mở' : 'Chưa mở';
      a.querySelector('i').textContent = TT[i] === 'xong' ? '✓' : String(i + 1);
    });
    $('#het').hidden = !TT.every(function (t) { return t === 'xong'; });
  }
  function cuonToi(el) { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  window.addEventListener('message', function (e) {
    if (e.origin !== AWORD) return;
    var d = e.data;
    if (!d || d.type !== 'AWORD:KT') return;
    var i = BAI.map(function (b) { return b.code; }).indexOf(d.code);
    if (i < 0) return;
    if (d.trangThai === 'xong') {
      var vuaXong = TT[i] !== 'xong' && daCuonDau;
      TT[i] = 'xong';
      moPhan(i + 1);
      veTrangThai();
      var dich = i + 1 < BAI.length ? $('#phan' + (i + 2)) : $('#het');
      if (TT.every(function (t) { return t === 'xong'; })) dich = $('#het');
      if (vuaXong) setTimeout(function () { phongTo(null); cuonToi(dich); }, 1800);   // để em kịp thấy "Chúc mừng" trong khung
    } else {
      veTrangThai();
      // lần đầu mở trang: cuộn tới phần đầu tiên chưa xong (bỏ qua các phần đã làm)
      if (!daCuonDau) { daCuonDau = true; if (i > 0) cuonToi($('#phan' + (i + 1))); }
    }
    if (TT.every(function (t) { return t === 'xong'; }) && !daCuonDau) { daCuonDau = true; cuonToi($('#het')); }
  });

  $('#thoat').onclick = function () {
    if (!confirm('Đăng xuất khỏi trang kiểm tra?')) return;
    P.thoat()['catch'](function () { }).then(function () { location.replace('index.html'); });
  };

  if (THU) { EM = { ma: 'ZTESTKT', ten: 'Minh Thư', anh: '' }; veTrang(); return; }   // bàn thử trên máy (không đăng nhập)
  P.phien().then(function (p) {
    if (!p) { location.replace('index.html'); return; }
    return p.u.reload()['catch'](function () { }).then(function () {
      EM = { ma: p.ma, ten: p.u.displayName || p.ten || 'em', anh: p.u.photoURL || '' };
      veTrang();
    });
  })['catch'](function () {
    $('#than').innerHTML = '<div class="kb-chao"><div><h1>Chưa kết nối được</h1><p>Em kiểm tra mạng rồi tải lại trang nhé.</p></div></div>';
  });
})();
