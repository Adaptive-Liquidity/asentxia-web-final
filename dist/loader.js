(() => {
  const overlay = document.querySelector('.site-intro');
  if (!overlay) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let firstVisit = true;
  try { firstVisit = sessionStorage.getItem('asentxia-intro-seen') !== '1'; } catch (_) {}
  if (!firstVisit) {
    overlay.classList.add('is-returning');
    document.documentElement.classList.add('return-visit');
  }
  const started = performance.now();
  const minimum = reduced ? 0 : firstVisit ? 1050 : 160;
  const ready = Promise.all([
    new Promise(resolve => document.readyState === 'complete' ? resolve() : addEventListener('load', resolve, { once: true })),
    document.fonts ? document.fonts.ready.catch(() => {}) : Promise.resolve()
  ]);
  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    const remaining = Math.max(0, minimum - (performance.now() - started));
    setTimeout(() => {
      overlay.classList.add('is-ready');
      overlay.querySelector('.intro-state').textContent = 'SYSTEM READY';
      setTimeout(() => {
        document.documentElement.classList.add('site-ready');
        overlay.setAttribute('aria-hidden', 'true');
        try { sessionStorage.setItem('asentxia-intro-seen', '1'); } catch (_) {}
      }, reduced ? 0 : firstVisit ? 290 : 40);
    }, remaining);
  }
  ready.then(finish, finish);
  setTimeout(finish, 3500);
  addEventListener('pageshow', event => {
    if (event.persisted) {
      document.documentElement.classList.add('site-ready');
      document.documentElement.classList.remove('page-leaving');
      overlay.setAttribute('aria-hidden', 'true');
    }
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || reduced || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
    event.preventDefault();
    document.documentElement.classList.add('page-leaving');
    setTimeout(() => { location.href = url.href; }, 260);
  });
})();
