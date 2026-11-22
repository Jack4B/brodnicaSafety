/* Gotowość Brodnica — jedyny skrypt strony. Strona działa też bez niego (poza zapisem checklisty
   i wyszukiwaniem najbliższych schronów). Żadnej analityki, żadnych zapytań do innych serwerów. */
(function () {
  'use strict';
  var body = document.body;
  var BASE = body.getAttribute('data-base') || '/';
  var built = body.getAttribute('data-built') || '';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = function (iso) { var p = iso.slice(0, 10).split('-'); return p[2] + '.' + p[1] + '.' + p[0]; };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* tryb prywatny */ } }
  };

  // ---------- Service Worker i pasek stanu ----------
  var bar = $('#netbar'), barT = $('#netbar-t');
  function swStatus() {
    return new Promise(function (resolve) {
      if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) return resolve(null);
      var ch = new MessageChannel();
      var t = setTimeout(function () { resolve(null); }, 3000);
      ch.port1.onmessage = function (e) { clearTimeout(t); resolve(e.data); };
      navigator.serviceWorker.controller.postMessage({ type: 'status' }, [ch.port2]);
    });
  }
  function updateBar() {
    if (!bar) return;
    swStatus().then(function (st) {
      var saved = st && st.cached >= st.total;
      if (!navigator.onLine) {
        bar.setAttribute('data-state', 'offline');
        barT.textContent = 'Brak internetu · korzystasz z wersji zapisanej (treści z ' + fmt(built) + ')';
      } else if (saved) {
        bar.setAttribute('data-state', 'saved');
        barT.textContent = 'Zapisano w telefonie · działa bez internetu · treści z ' + fmt(built);
      } else {
        bar.setAttribute('data-state', 'online');
        barT.textContent = 'Treści z ' + fmt(built) + (st ? ' · zapisuję do użytku offline…' : '');
      }
      var os = $('#off-status');
      if (os) {
        if (!('serviceWorker' in navigator)) os.textContent = 'Ta przeglądarka nie obsługuje zapisu offline. Użyj wersji do druku.';
        else if (saved) os.innerHTML = '<strong>Cała strona jest zapisana w tym telefonie</strong> (' + st.total + ' plików, wersja ' + st.version + '). Działa bez internetu.';
        else if (st) os.textContent = 'Zapisano ' + st.cached + ' z ' + st.total + ' plików. Zostaw stronę otwartą na chwilę z internetem.';
        else os.textContent = 'Zapis jeszcze się nie rozpoczął. Odśwież stronę, gdy masz internet.';
      }
    });
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(BASE + 'sw.js', { scope: BASE }).then(function () {
      navigator.serviceWorker.ready.then(function () { setTimeout(updateBar, 500); });
    }).catch(function () { /* np. plik otwarty lokalnie */ });
    navigator.serviceWorker.addEventListener('message', function (e) { if (e.data && e.data.type === 'cached') updateBar(); });
  }
  window.addEventListener('online', updateBar);
  window.addEventListener('offline', updateBar);
  updateBar();

  var saveBtn = $('#off-save');
  if (saveBtn) saveBtn.addEventListener('click', function () {
    if (!navigator.serviceWorker || !navigator.serviceWorker.controller) { location.reload(); return; }
    $('#off-status').textContent = 'Zapisuję…';
    navigator.serviceWorker.controller.postMessage({ type: 'recache' });
  });

  // ---------- plecak ----------
  var pl = $('#plecak');
  if (pl) {
    var KEY = 'gb-plecak-v2';
    var st = store.get(KEY, { lvl: 'podst', dla: 'osoba', done: {} });
    var checks = $$('.check');
    var render = function () {
      $$('[data-set-lvl]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lvl') === st.lvl)); });
      $$('[data-set-dla]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set-dla') === st.dla)); });
      var total = 0, done = 0;
      checks.forEach(function (c) {
        var show = !(c.getAttribute('data-lvl') === 'rozsz' && st.lvl !== 'rozsz') && !(c.getAttribute('data-dla') === 'rodzina' && st.dla !== 'rodzina');
        c.hidden = !show;
        var cb = $('input', c); cb.checked = !!st.done[cb.getAttribute('data-id')];
        if (show) { total++; if (cb.checked) done++; }
      });
      $$('.group').forEach(function (g) { g.hidden = !$$('.check', g).some(function (c) { return !c.hidden; }); });
      $('#pl-txt').textContent = done + ' z ' + total + ' spakowane';
      $('#pl-bar').style.width = (total ? Math.round(done / total * 100) : 0) + '%';
    };
    $$('[data-set-lvl],[data-set-dla]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.hasAttribute('data-set-lvl')) st.lvl = b.getAttribute('data-set-lvl');
        if (b.hasAttribute('data-set-dla')) st.dla = b.getAttribute('data-set-dla');
        store.set(KEY, st); render();
      });
    });
    checks.forEach(function (c) {
      var cb = $('input', c);
      cb.addEventListener('change', function () { st.done[cb.getAttribute('data-id')] = cb.checked; store.set(KEY, st); render(); });
    });
    var rs = $('#pl-reset');
    if (rs) rs.addEventListener('click', function () { st.done = {}; store.set(KEY, st); render(); });
    render();
  }

  // ---------- schrony ----------
  var list = $('#sh-list');
  if (list) {
    var places = $$('.place', list);
    var q = $('#sh-q');
    var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l'); };
    q.addEventListener('input', function () {
      var v = norm(q.value.trim());
      places.forEach(function (p) { p.hidden = v && norm(p.getAttribute('data-q')).indexOf(v) < 0; });
    });
    var dist = function (a, b, c, d) {
      var R = 6371000, r = Math.PI / 180, x = (d - b) * r * Math.cos((a + c) / 2 * r), y = (c - a) * r;
      return Math.sqrt(x * x + y * y) * R;
    };
    var btn = $('#sh-near'), msg = $('#sh-status');
    btn.addEventListener('click', function () {
      if (!navigator.geolocation) { msg.textContent = 'Ten telefon nie udostępnia lokalizacji. Użyj wyszukiwarki ulic.'; return; }
      msg.textContent = 'Ustalam położenie…';
      navigator.geolocation.getCurrentPosition(function (pos) {
        var la = pos.coords.latitude, lo = pos.coords.longitude;
        places.forEach(function (p) { p._d = dist(la, lo, +p.getAttribute('data-lat'), +p.getAttribute('data-lon')); });
        places.sort(function (a, b) { return a._d - b._d; });
        places.forEach(function (p, i) {
          list.appendChild(p); p.hidden = false;
          p.classList.toggle('near', i < 5);
          $('.dist', p).textContent = ' · ' + (p._d < 1000 ? Math.round(p._d / 10) * 10 + ' m' : (p._d / 1000).toFixed(1).replace('.', ',') + ' km');
          var dot = document.querySelector('.map .pt[data-i="' + p.getAttribute('data-i') + '"]');
          if (dot) dot.classList.toggle('near', i < 5);
        });
        q.value = '';
        var near = places[0];
        msg.textContent = near._d > 20000 ? 'Jesteś daleko od Brodnicy — lista pokazuje miejsca w mieście.' : 'Najbliższe: ' + $('b', near).textContent + ' (' + $('.dist', near).textContent.replace(' · ', '') + '). Pięć najbliższych zaznaczono na czerwono.';
        // Twoja pozycja na schemacie (jeśli mieści się w obszarze)
        var svg = $('.map svg'), me = $('#sh-me');
        var ref = places.slice(0, 2).map(function (p) { return { p: p, dot: document.querySelector('.map .pt[data-i="' + p.getAttribute('data-i') + '"]') }; });
        if (svg && me && ref[0].dot && ref[1] && ref[1].dot) {
          var a = ref[0], b = ref[1];
          var ax = +a.dot.getAttribute('cx'), ay = +a.dot.getAttribute('cy'), bx = +b.dot.getAttribute('cx'), by = +b.dot.getAttribute('cy');
          var alo = +a.p.getAttribute('data-lon'), ala = +a.p.getAttribute('data-lat'), blo = +b.p.getAttribute('data-lon'), bla = +b.p.getAttribute('data-lat');
          var sx = Math.abs(blo - alo) > 1e-6 ? (bx - ax) / (blo - alo) : null, sy = Math.abs(bla - ala) > 1e-6 ? (by - ay) / (bla - ala) : null;
          if (sx && sy) { me.setAttribute('cx', ax + (lo - alo) * sx); me.setAttribute('cy', ay + (la - ala) * sy); }
        }
        list.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, function (err) {
        msg.textContent = err.code === 1 ? 'Brak zgody na lokalizację. Możesz ją włączyć w ustawieniach przeglądarki albo użyć wyszukiwarki ulic.' : 'Nie udało się ustalić położenia. Spróbuj na zewnątrz budynku albo użyj wyszukiwarki ulic.';
      }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 });
    });
  }
})();
