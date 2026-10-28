/* welter.sk – štítok „Nové“ (do 45 dní od dátumu výstupu) a filter archívu médií.
   Bez JS sa zobrazí celý archív a štítky „Nové“ ostanú skryté. */
(function () {
  'use strict';
  var DAY = 864e5, NEW_DAYS = 45, now = Date.now();
  document.querySelectorAll('[data-new]').forEach(function (el) {
    var t = Date.parse(el.getAttribute('data-new') + 'T00:00:00');
    if (!isNaN(t) && now - t >= 0 && now - t <= NEW_DAYS * DAY) el.hidden = false;
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-media-out]');
    if (a && typeof window.gtag === 'function') window.gtag('event', 'click_media_out', { link_url: a.href });
  });

  var box = document.querySelector('[data-filters]');
  if (!box) return;
  var st = { typ: 'all', tema: 'all' };
  var btns = box.querySelectorAll('.btn-filter');
  var cards = document.querySelectorAll('.cards > [data-typ]');
  var rows = document.querySelectorAll('.reg tbody tr');
  var years = document.querySelectorAll('.year');
  var count = document.getElementById('count');

  function ok(el) {
    return (st.typ === 'all' || el.getAttribute('data-typ') === st.typ) &&
           (st.tema === 'all' || el.getAttribute('data-tema') === st.tema);
  }
  function apply(push) {
    btns.forEach(function (b) {
      b.setAttribute('aria-pressed', st[b.getAttribute('data-f')] === b.getAttribute('data-v') ? 'true' : 'false');
    });
    var k = 0;
    cards.forEach(function (el) { var v = ok(el); el.hidden = !v; if (v) k++; });
    rows.forEach(function (el) { el.hidden = !ok(el); });
    years.forEach(function (s) { s.hidden = !s.querySelector('.cards > [data-typ]:not([hidden])'); });
    count.textContent = 'Zobrazených ' + k + ' z ' + cards.length + ' výstupov';
    if (push && window.history && history.replaceState) {
      var q = [];
      if (st.typ !== 'all') q.push('typ=' + encodeURIComponent(st.typ));
      if (st.tema !== 'all') q.push('tema=' + encodeURIComponent(st.tema));
      history.replaceState(null, '', location.pathname + (q.length ? '?' + q.join('&') : '') + location.hash);
    }
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      st[b.getAttribute('data-f')] = b.getAttribute('data-v'); apply(true);
      if (typeof window.gtag === 'function') window.gtag('event', 'media_filter', { filter_type: b.getAttribute('data-f'), filter_value: b.getAttribute('data-v') });
    });
  });
  var p = new URLSearchParams(location.search);
  ['typ', 'tema'].forEach(function (k) {
    var v = p.get(k);
    if (v && box.querySelector('.btn-filter[data-f="' + k + '"][data-v="' + v.replace(/[^a-z-]/g, '') + '"]')) st[k] = v;
  });
  if (st.typ !== 'all' || st.tema !== 'all') apply(false);
})();
