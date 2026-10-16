/* Súhlas s analytickými cookies (GA4, Consent Mode v2, prísny režim).
 * Rovnaká logika ako lišta na novystavebnyzakon.sk; dá sa zdieľať medzi webmi.
 * Konfigurácia: window.CONSENT_CFG = {key: 'kluc_v_localStorage', ga: 'G-XXXX'} (nastaví sa v <head>
 * spolu s gtag('consent','default', ... denied ...)). Lišta: <div id="consentBar" ... hidden> v HTML.
 * Vzhľad: CSS premenné --cb-bg, --cb-fg, --cb-accent, --cb-font na :root.
 * gtag.js sa načíta až po kliknutí na „Prijať“ (alebo pri návrate, ak bol súhlas uložený). */
(function () {
  var C = window.CONSENT_CFG || {}, K = C.key, ID = C.ga, loaded = false;
  var bar = document.getElementById('consentBar');
  var css = '.cb{position:fixed;left:12px;right:12px;bottom:12px;z-index:200;max-width:760px;margin:0 auto;' +
    'background:var(--cb-bg,#16213e);color:var(--cb-fg,#fff);border:1px solid rgba(255,255,255,.18);border-radius:16px;' +
    'padding:14px 16px;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;box-shadow:0 18px 40px -16px rgba(0,0,0,.7);' +
    'font:14.5px/1.45 var(--cb-font,system-ui,sans-serif)}' +
    '.cb[hidden]{display:none}.cb p{margin:0;flex:1 1 320px}.cb a{color:var(--cb-accent,#a0c4ff)}' +
    '.cb .cb-btns{display:flex;gap:8px;margin-left:auto}' +
    '.cb button{min-width:110px;border:2px solid var(--cb-accent,#a0c4ff);border-radius:999px;padding:8px 16px;' +
    'font:600 15px var(--cb-font,system-ui,sans-serif);cursor:pointer;background:transparent;color:var(--cb-fg,#fff)}' +
    '.cb button:hover,.cb button:focus-visible{background:var(--cb-accent,#a0c4ff);color:var(--cb-bg,#16213e)}' +
    '@media print{.cb{display:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function g() { if (typeof window.gtag === 'function') window.gtag.apply(null, arguments); }
  function get() { try { return localStorage.getItem(K); } catch (e) { return null; } }
  function put(v) { try { localStorage.setItem(K, v); } catch (e) {} }
  function load() {
    if (loaded || !ID || /^G-X+$/.test(ID)) return; loaded = true;
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID; document.head.appendChild(s);
  }
  function wipe() {
    var h = location.hostname, d = ['', h, '.' + h, '.' + h.replace(/^www\./, '')];
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (/^_ga/.test(n)) d.forEach(function (x) { document.cookie = n + '=; Max-Age=0; path=/' + (x ? '; domain=' + x : ''); });
    });
  }
  function apply(v) { g('consent', 'update', { analytics_storage: v }); if (v === 'granted') load(); else wipe(); }
  var v = get();
  if (v === 'granted') load(); else if (v !== 'denied' && bar) bar.hidden = false;
  if (bar) bar.addEventListener('click', function (e) {
    var b = e.target.closest('[data-c]'); if (!b) return;
    put(b.dataset.c); apply(b.dataset.c); bar.hidden = true;
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="mailto:"],a[href^="tel:"]');
    if (a) g('event', 'contact_click', { contact_type: /^tel:/.test(a.getAttribute('href')) ? 'phone' : 'email', link_url: a.href });
    var c = e.target.closest('[data-cta]');
    if (c) g('event', 'cta_click', { cta_position: c.dataset.cta, link_url: c.href });
    var o = e.target.closest('[data-consent-open]');
    if (o && bar) { e.preventDefault(); bar.hidden = false; var f = bar.querySelector('button'); if (f) f.focus(); }
  });
})();
