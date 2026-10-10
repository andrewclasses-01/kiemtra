/* ============================================================
   phien.js — PHIÊN ĐĂNG NHẬP trang KIỂM TRA ĐẦU VÀO (kiemtra.andrewclasses.com, 02/10/2026)

   Chép rút gọn từ myLesson web `js/nw-phien.js` (cùng Firebase app aword-70dae, cùng cách băm email):
     email = sha256(ID)[0..24] + '@id.andrewclasses.com' · tài khoản do dashboard tạo (hàm qlKtdv, claim ktdv:true).
   ⛔ Trang này CHỈ nhận tài khoản kiểm tra đầu vào (claim `ktdv`). Học sinh đang học vào andrewclasses.com.
   ⭐ CẤP VÉ cho khung AWord nhúng (`kiemtra.html` của AWord, Đợt 440): AWord xin {type:'AWORD:XIN_VE', ma} ⇒ trang này trả
     {type:'AWORD:VE', ma, token, het} — CHỈ cho đúng origin AWord và CHỈ khi phiên đang mở đúng ID xin (luật kho điểm `hsDung`).
   ============================================================ */
(function () {
  'use strict';
  var SDK = 'https://www.gstatic.com/firebasejs/12.9.0';
  var CAU_HINH = {
    apiKey: 'AIzaSyAV_yoyAQM2fKKdOsJyuAxxf4AN7MsF7XY',
    authDomain: 'aword-70dae.firebaseapp.com',
    projectId: 'aword-70dae',
    storageBucket: 'aword-70dae.firebasestorage.app',
    messagingSenderId: '399279049436',
    appId: '1:399279049436:web:b9b34dcfb34732aa744219'
  };
  var DUOI_EMAIL = '@id.andrewclasses.com';
  var AWORD_GOC = 'https://aword.andrewclasses.com';

  var _p = null;
  function fb() {
    if (!_p) {
      _p = (async function () {
        var appMod = await import(SDK + '/firebase-app.js');
        var au = await import(SDK + '/firebase-auth.js');
        var app = (appMod.getApps && appMod.getApps().length) ? appMod.getApp() : appMod.initializeApp(CAU_HINH);
        var auth = au.getAuth(app);
        try { await au.setPersistence(auth, au.browserLocalPersistence); } catch (e) { }
        return { au: au, auth: auth };
      })();
      _p['catch'](function () { _p = null; });
    }
    return _p;
  }
  function chuanMa(s) { return String(s || '').replace(/\s+/g, '').toUpperCase(); }
  async function emailTuMa(ma) {
    var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(chuanMa(ma)));
    var hex = Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    return hex.slice(0, 24) + DUOI_EMAIL;
  }
  function userHienTai() {
    return fb().then(function (f) {
      if (f.auth.currentUser) return f.auth.currentUser;
      return new Promise(function (res) { var stop = f.au.onAuthStateChanged(f.auth, function (u) { stop(); res(u || null); }); });
    });
  }
  // Phiên KTĐV hiện tại: { u, ma, ten, anh } hoặc null (chưa đăng nhập / không phải tài khoản kiểm tra đầu vào).
  async function phien(epMoi) {
    var u = await userHienTai();
    if (!u || !u.email || u.email.slice(-DUOI_EMAIL.length) !== DUOI_EMAIL) return null;
    var r = await u.getIdTokenResult(!!epMoi);
    var c = r.claims || {};
    if (c.ktdv !== true || !c.ma) return null;
    // ⭐ 10/10/2026 — `phat` = bộ đề thầy đã PHÁT ('A' | 'B'); trống ⇒ em phải chờ (bai.js hiện màn chờ, hỏi lại token)
    return { u: u, ma: String(c.ma), ten: u.displayName || '', anh: u.photoURL || '', phat: c.phat === 'A' || c.phat === 'B' ? c.phat : '' };
  }
  async function dangNhap(ma, mk) {
    var f = await fb();
    var r = await f.au.signInWithEmailAndPassword(f.auth, await emailTuMa(ma), mk);
    return r.user;
  }
  async function thoat() { var f = await fb(); await f.au.signOut(f.auth); }

  // ---------- cấp vé cho khung AWord ----------
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.type !== 'AWORD:XIN_VE' || e.origin !== AWORD_GOC || !e.source) return;
    var ma = chuanMa(d.ma);
    if (!ma) return;
    phien().then(function (p) {
      if (!p || chuanMa(p.ma) !== ma) return null;
      return p.u.getIdTokenResult().then(function (r) { return (Date.parse(r.expirationTime) - Date.now() < 120000) ? p.u.getIdTokenResult(true) : r; });
    }).then(function (r) {
      if (!r) return;
      e.source.postMessage({ type: 'AWORD:VE', ma: ma, token: r.token, het: Date.parse(r.expirationTime) }, e.origin);
    })['catch'](function (err) { console.warn('[phien] không cấp được vé AWord', err); });
  });

  function chuLoi(e) {
    var c = (e && e.code) || '';
    if (c === 'auth/invalid-credential' || c === 'auth/wrong-password' || c === 'auth/user-not-found' || c === 'auth/invalid-email' || c === 'auth/invalid-login-credentials')
      return 'ID hoặc mật khẩu chưa đúng.';
    if (c === 'auth/too-many-requests') return 'Em nhập sai nhiều lần quá. Đợi vài phút rồi thử lại nhé.';
    if (c === 'auth/user-disabled') return 'Tài khoản đã đóng. Em liên hệ thầy Andrew nhé.';
    if (c === 'auth/network-request-failed') return 'Mạng đang chập chờn. Em thử lại nhé.';
    return 'Có lỗi, em thử lại nhé.' + (c ? ' (' + c + ')' : '');
  }

  window.KTP = { fb: fb, chuanMa: chuanMa, phien: phien, dangNhap: dangNhap, thoat: thoat, chuLoi: chuLoi, AWORD_GOC: AWORD_GOC };
})();
