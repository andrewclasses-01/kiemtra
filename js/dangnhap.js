/* dangnhap.js — màn đăng nhập trang KIỂM TRA ĐẦU VÀO. Đăng nhập xong ⇒ bai.html (vào thẳng trang làm bài).
   Thầy chốt 02/10: KHÔNG bắt đổi mật khẩu lần đầu. Tài khoản không phải KTĐV (học sinh đang học) ⇒ báo vào andrewclasses.com. */
(function () {
  'use strict';
  var P = window.KTP;
  var $ = function (s) { return document.querySelector(s); };
  var KHOA_NHO = 'kt_ma';
  function man(ten) { document.querySelectorAll('.man').forEach(function (m) { m.classList.toggle('hien', m.id === ten); }); }
  function loi(chu) { var p = $('#loiVao'); p.hidden = !chu; p.textContent = chu || ''; }

  // con mắt hiện/ẩn mật khẩu (y trang chính)
  var IC_MAT = '<svg viewBox="0 0 24 24"><path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/></svg>';
  var IC_MAT_TAT = '<svg viewBox="0 0 24 24"><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c4.97 0 8.46 3.37 9.94 6.65a1 1 0 0 1 0 .7 10.8 10.8 0 0 1-1.44 2.49"/><path d="M14.08 14.16a3 3 0 0 1-4.24-4.24"/><path d="M17.48 17.5A10.75 10.75 0 0 1 2.06 12.35a1 1 0 0 1 0-.7 10.8 10.8 0 0 1 4.45-5.14"/><path d="m2 2 20 20"/></svg>';
  (function () {
    var o = $('#inMk'), nut = document.createElement('button');
    nut.type = 'button'; nut.className = 'id-eye';
    o.insertAdjacentElement('afterend', nut);
    var dat = function (hien) { o.type = hien ? 'text' : 'password'; nut.innerHTML = hien ? IC_MAT_TAT : IC_MAT; nut.setAttribute('aria-label', hien ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'); };
    dat(false);
    nut.addEventListener('mousedown', function (e) { e.preventDefault(); });
    nut.addEventListener('click', function () { dat(o.type === 'password'); o.focus(); });
  })();
  ['#inMa', '#inMk'].forEach(function (s) {
    var o = $(s);
    o.addEventListener('focus', function () { o.placeholder = ''; });
    o.addEventListener('blur', function () { if (!o.value) o.placeholder = o.getAttribute('data-goi'); });
  });
  var inMa = $('#inMa');
  inMa.addEventListener('input', function () { this.value = this.value.toUpperCase(); });
  inMa.onkeydown = function (e) { if (e.key === 'Enter') { if (!$('#inMk').value) $('#inMk').focus(); else vao(); } };
  $('#inMk').onkeydown = function (e) { if (e.key === 'Enter') vao(); };
  $('#btnVao').onclick = vao;
  var moLienHe = function () { var h = $('#lienHe'); h.hidden = !h.hidden; };
  $('#btnLienHe').onclick = moLienHe;
  $('#btnQuenMk').onclick = function () { $('#lienHe').hidden = false; };

  var dang = false;
  async function vao() {
    if (dang) return;
    var ma = P.chuanMa(inMa.value), mk = $('#inMk').value;
    if (!ma) { loi('Em nhập ID nhé.'); inMa.focus(); return; }
    if (!mk) { loi('Em nhập mật khẩu nhé.'); $('#inMk').focus(); return; }
    dang = true; loi(''); $('#btnVao').disabled = true; $('#btnVao').textContent = 'ĐANG VÀO…';
    try {
      await P.dangNhap(ma, mk);
      var p = await P.phien(true);
      if (!p) {
        await P.thoat()['catch'](function () { });
        loi('Tài khoản này không phải tài khoản kiểm tra đầu vào. Học sinh đang học vào andrewclasses.com nhé.');
      } else {
        try { localStorage.setItem(KHOA_NHO, p.ma); } catch (e) { }
        location.replace('bai.html');
        return;
      }
    } catch (e) { loi(P.chuLoi(e)); }
    dang = false; $('#btnVao').disabled = false; $('#btnVao').textContent = 'ĐĂNG NHẬP';
  }

  // máy đã giữ phiên KTĐV ⇒ vào thẳng trang làm bài
  P.phien().then(function (p) {
    if (p) { location.replace('bai.html'); return; }
    man('manVao');
    try { var nho = localStorage.getItem(KHOA_NHO); if (nho) { inMa.value = nho; $('#inMk').focus(); return; } } catch (e) { }
    inMa.focus();
  })['catch'](function () { man('manVao'); loi('Chưa kết nối được. Em kiểm tra mạng rồi tải lại trang nhé.'); });
})();
