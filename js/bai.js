/* bai.js — TRANG LÀM BÀI KIỂM TRA ĐẦU VÀO: tên em + các phần của BỘ ĐỀ thầy phát, mỗi phần là một khung AWord (Đợt 440).
   ⭐ 10/10/2026 — HAI BỘ ĐỀ + PHÁT BÀI: thầy bấm PHÁT BÀI ở dashboard (hàm qlKtdv.phat ⇒ claim `phat` = 'A' | 'B').
     Chưa phát ⇒ màn "Bài kiểm tra chưa được mở, em hãy chờ thầy Andrew nhé!" + hỏi lại token mỗi 5 giây (tự mở, không tải lại).
     A = bộ cũ 3 phần (AWord kiemtra.html) · B = bộ lớp 3–4, 6 phần (AWord kiemtra2.html: giờ từng câu, Quiz, hình, phim).
   Làm lần lượt: phần sau mở khi phần trước xong. AWord báo {type:'AWORD:KT', code, trangThai:'chua'|'dang-lam'|'xong'}.
   Em vừa làm xong một phần ⇒ cuộn xuống phần kế; xong phần cuối ⇒ "Chúc mừng em đã hoàn thành, hãy chờ kết quả từ thầy Andrew". */
(function () {
  'use strict';
  var P = window.KTP;
  // ⛔ PHẢI khớp dashboard myLesson `js/ktdv-ql.js` BO_DE (mã bài giao AWord, Courses / KIEM TRA DAU VAO).
  var BO_DE = {
    A: { trang: 'kiemtra.html', bai: [
      { code: '5576de', ma: 'BT1', ten: 'Tạo cụm số ít', n: 40 },
      { code: 'bc52sb', ma: 'BT2', ten: 'Tạo cụm số nhiều', n: 20 },
      { code: 'khszvm', ma: 'BT3', ten: 'Tạo câu', n: 50 }] },
    B: { trang: 'kiemtra2.html', bai: [
      { code: 'x98bsj', ma: 'P1', ten: 'Chọn từ đúng', n: 30 },
      { code: 'xxdvu5', ma: 'P2', ten: 'Gõ từ tiếng Anh', n: 30 },
      { code: 'g3wh9q', ma: 'P3', ten: 'A, an hay không đếm được', n: 30 },
      { code: 'p3xryn', ma: 'P4', ten: 'Số ít, số nhiều', n: 30 },
      { code: 'zwfvda', ma: 'P5', ten: 'Tạo câu', n: 20 },
      { code: 'ct632d', ma: 'P6', ten: 'Nghe - hiểu - ghi nhớ', n: 10 }] }
  };
  var BAI = BO_DE.A.bai, TRANG = BO_DE.A.trang;
  var $ = function (s) { return document.querySelector(s); };
  var THU = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).get('thu') === '1';
  // Bàn thử trên máy: `bai.html?thu=1&aword=http://localhost:5591` ⇒ khung trỏ về AWord đang chạy trên máy (chỉ localhost).
  var AWORD = P.AWORD_GOC;
  if (THU && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(new URLSearchParams(location.search).get('aword') || '')) AWORD = new URLSearchParams(location.search).get('aword');
  var TT = [];   // khoa | mo | xong (dựng khi biết bộ đề)
  var SVG_TO = '<svg viewBox="0 0 24 24"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>';      // Lucide maximize-2
  var SVG_NHO = '<svg viewBox="0 0 24 24"><path d="M4 14h6v6"/><path d="M20 10h-6V4"/><path d="M14 10l7-7"/><path d="M3 21l7-7"/></svg>';    // Lucide minimize-2
  var EM = null, daCuonDau = false;

  function E(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function chuCai(t) { var w = String(t || '?').trim().split(/\s+/); return (w[w.length - 1] || '?').charAt(0).toUpperCase(); }
  function av(cls) { return EM.anh ? '<img class="kb-av ' + (cls || '') + '" src="' + E(EM.anh) + '" alt="">' : '<span class="kb-av ' + (cls || '') + '">' + E(chuCai(EM.ten)) + '</span>'; }

  function chonBo(bo) {
    var b = BO_DE[bo] || BO_DE.A;
    BAI = b.bai; TRANG = b.trang;
    TT = BAI.map(function () { return 'khoa'; });
  }
  // ---- MÀN CHỜ: thầy chưa bấm PHÁT BÀI ----
  var henCho = 0;
  function veCho(p) {
    $('#em').innerHTML = av() + '<span>' + E(EM.ten) + '</span>';
    $('#than').innerHTML = '<section class="kb-cho"><div class="kb-cho-dong">⏳</div>' + av('lon') +
      '<h1>Chào ' + E(EM.ten) + '!</h1><h2>Bài kiểm tra chưa được mở</h2><p>Em hãy chờ thầy Andrew nhé!</p>' +
      '<p class="nho">Khi thầy mở bài, trang này sẽ tự hiện bài kiểm tra — em không cần tải lại.</p></section>';
    clearTimeout(henCho);
    var hoi = function () {
      P.phien(true).then(function (q) {
        if (!q) { location.replace('index.html'); return; }
        if (q.phat) { chonBo(q.phat); veTrang(); return; }
        henCho = setTimeout(hoi, 5000);
      })['catch'](function () { henCho = setTimeout(hoi, 8000); });
    };
    henCho = setTimeout(hoi, 5000);
  }

  function veTrang() {
    $('#em').innerHTML = av() + '<span>' + E(EM.ten) + '</span>';
    var h = '<section class="kb-chao">' + av('lon') + '<div><h1>Chào ' + E(EM.ten) + '!</h1>' +
      '<p>Bài kiểm tra đầu vào gồm <b>' + BAI.length + ' phần</b>. Em làm lần lượt từng phần — mỗi phần có hướng dẫn và câu làm thử trước khi làm bài thật. ' +
      (TRANG === 'kiemtra2.html' ? 'Mỗi câu có thời gian riêng, hết giờ máy tự sang câu sau. ' : '') +
      'Em tự làm, không dùng phần mềm dịch, không hỏi người khác nhé. Thầy Andrew sẽ gửi kết quả sau.</p></div></section>';
    h += '<nav class="kb-buoc" id="buoc">' + BAI.map(function (b, i) { return '<a href="#phan' + (i + 1) + '" data-i="' + i + '"><i>' + (i + 1) + '</i><span>' + b.ma + '. ' + E(b.ten) + '</span></a>'; }).join('') + '</nav>';
    h += BAI.map(function (b, i) {
      return '<section class="kb-phan" id="phan' + (i + 1) + '"><div class="kb-phan-dau"><div class="so">PHẦN ' + (i + 1) + ' / ' + BAI.length + '</div>' +
        '<div class="kb-phan-ten"><h2>' + b.ma + '. ' + E(b.ten.toUpperCase()) + ' <small>· ' + b.n + ' câu</small></h2>' +
        '<span class="kb-chip" id="chip' + i + '"></span></div></div>' +
        '<div class="kb-khung" id="khung' + i + '"><div class="kb-khoa"><div><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Làm xong phần ' + i + ' để mở phần này</div></div></div></section>';
    }).join('');
    h += '<section class="kb-het" id="het" hidden><div class="sao">🎉</div><h2>Chúc mừng em đã hoàn thành!</h2><p>Em đã làm xong cả ' + BAI.length + ' phần của bài kiểm tra đầu vào.<br>Hãy chờ kết quả từ thầy Andrew nhé.</p></section>';
    $('#than').innerHTML = h;
    moPhan(0);
    veTrangThai();
  }
  function moPhan(i) {
    if (i >= BAI.length || TT[i] !== 'khoa') return;
    TT[i] = 'mo';
    var b = BAI[i], k = $('#khung' + i);
    var src = AWORD + '/' + TRANG + '?g=' + encodeURIComponent(b.code) + '&n=' + encodeURIComponent(EM.ten) + '&ma=' + encodeURIComponent(EM.ma) + '&nhung=1';
    k.innerHTML = '<iframe src="' + E(src) + '" title="' + E(b.ma + '. ' + b.ten) + '" allow="autoplay; clipboard-write" loading="eager"></iframe>' +
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

  // bàn thử trên máy (không đăng nhập): &bo=A|B chọn bộ đề, &cho=1 xem màn chờ
  if (THU) { EM = { ma: 'ZTESTKT', ten: 'Minh Thư', anh: '' }; var qt = new URLSearchParams(location.search); if (qt.get('cho') === '1') { $('#em').innerHTML = av() + '<span>' + E(EM.ten) + '</span>'; P.phien = function () { return Promise.resolve({ phat: '' }); }; veCho(); return; } chonBo(qt.get('bo') || 'A'); veTrang(); return; }
  P.phien().then(function (p) {
    if (!p) { location.replace('index.html'); return; }
    return p.u.reload()['catch'](function () { }).then(function () {
      EM = { ma: p.ma, ten: p.u.displayName || p.ten || 'em', anh: p.u.photoURL || '' };
      if (!p.phat) return veCho(p);
      chonBo(p.phat);
      veTrang();
    });
  })['catch'](function () {
    $('#than').innerHTML = '<div class="kb-chao"><div><h1>Chưa kết nối được</h1><p>Em kiểm tra mạng rồi tải lại trang nhé.</p></div></div>';
  });
})();
