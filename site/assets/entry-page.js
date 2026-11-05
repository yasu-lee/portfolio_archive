/*
 * STUDY FILES — standalone entry page (site/<cat>/<slug>.html).
 * The page declares <body data-entry="<id>" data-base="../">.
 */
(function () {
  const D = window.Dossier;
  const id = document.body.dataset.entry;
  const base = document.body.dataset.base ?? '../';
  const s = D.BY_ID[id];
  const overlay = document.getElementById('overlay');
  const sheet = document.getElementById('sheet');
  if (!s) { sheet.innerHTML = '<p style="padding:80px">이 파일을 찾을 수 없습니다.</p>'; overlay.classList.add('open'); return; }

  document.title = `${s.no} ${s.title} — STUDY FILES`;
  sheet.innerHTML = D.render(s, { mode: 'page', base });
  D.bind(sheet);
  overlay.addEventListener('scroll', () => { overlay.scrollTop = 0; overlay.scrollLeft = 0; });
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('open')));

  const go = (e) => { location.href = base + e.page; };
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') location.href = `${base}index.html#${s.id}`;
    if (e.key === 'ArrowRight') go(D.stepFrom(s, 1));
    if (e.key === 'ArrowLeft') go(D.stepFrom(s, -1));
  });
})();
