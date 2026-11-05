/*
 * STUDY FILES — cabinet view + dossier overlay (index.html).
 */
(function () {
  const { CATS, ENTRIES, BY_ID, pad } = window.STUDY;
  const D = window.Dossier;
  const esc = D.esc;

  const state = { openCat: null, query: '', fmt: 'All', open: false, openId: ENTRIES[0].id, busy: false };
  const cabinet = document.getElementById('cabinet');
  const overlay = document.getElementById('overlay');
  const sheet = document.getElementById('sheet');

  function match(e) {
    const { query, fmt } = state;
    if (fmt !== 'All' && !e.format.includes(fmt)) return false;
    const q = query.trim().toLowerCase();
    return !q || [e.title, e.source, e.summary, ...e.tags].join(' ').toLowerCase().includes(q);
  }

  /* ── Cabinet ─────────────────────────────────────── */
  function renderCabinet() {
    cabinet.innerHTML = CATS.map((c, i) => {
      const all = ENTRIES.filter((e) => e.cat === c.key);
      const formats = ['All', ...new Set(all.flatMap((e) => e.format))];
      return `
      <div class="folder" data-cat="${c.key}" style="--c:${c.color};--fg:${c.fg};z-index:${i + 1}">
        <div class="tabs" style="padding-left:calc(12px + ${i * 5}%)"></div>
        <div class="folder-body">
          <div class="folder-head" role="button" tabindex="0" aria-expanded="false" data-toggle>
            <span class="num">${pad(i + 1)}</span>
            <span class="names"><span class="name">${esc(c.name)}</span><span class="ko">${esc(c.ko)}</span></span>
            <span class="spacer"></span>
            <span class="zone" data-hover>
              <span class="count">${all.length} FILES</span>
              <span class="circle" aria-hidden="true"><span class="fill"></span><span class="arrow">↓</span></span>
            </span>
          </div>
          <div class="acc"><div><div class="acc-inner">
            <div class="acc-tools">
              <p>${esc(c.desc)}</p>
              <div class="ctl">
                <input class="search" type="text" autocomplete="off" placeholder="이 폴더에서 검색" aria-label="${esc(c.name)} 폴더에서 검색" tabindex="-1">
                <div class="chips">${formats.map((f) => `<button type="button" class="chip${f === 'All' ? ' on' : ''}" data-fmt="${esc(f)}" tabindex="-1">${esc(f)}</button>`).join('')}</div>
              </div>
            </div>
            <div class="list"></div>
          </div></div></div>
        </div>
      </div>`;
    }).join('');
    CATS.forEach((c) => renderFolderEntries(c.key));
    cabinet.querySelectorAll('.tabs').forEach(bindTabRow);
  }

  function renderFolderEntries(key) {
    const el = cabinet.querySelector(`.folder[data-cat="${key}"]`);
    const all = ENTRIES.filter((e) => e.cat === key);
    const isOpen = state.openCat === key;
    const list = isOpen ? all.filter(match) : all;
    el.querySelector('.tabs').innerHTML = list.map((e) =>
      `<button type="button" class="tab" data-open="${e.id}" title="${esc(e.title)}"><span class="no">${esc(e.no)}</span><span class="t">${esc(e.title)}</span></button>`).join('');
    el.querySelector('.list').innerHTML = list.map((e) =>
      `<button type="button" class="row" data-open="${e.id}"${isOpen ? '' : ' tabindex="-1"'}><span class="no">${esc(e.no)}</span><span class="t">${esc(e.title)}</span><span class="f">${esc(e.fmt)} →</span></button>`).join('')
      + (isOpen && !list.length ? '<p class="empty">검색 결과가 없습니다.</p>' : '');
    el.querySelectorAll('.chip').forEach((b) => b.classList.toggle('on', b.dataset.fmt === state.fmt));
  }

  function setOpenCat(key) {
    const prev = state.openCat;
    state.openCat = key; state.query = ''; state.fmt = 'All';
    cabinet.querySelectorAll('.folder').forEach((f) => {
      const on = f.dataset.cat === key;
      f.classList.toggle('open', on);
      f.classList.remove('filling');
      f.querySelector('[data-toggle]').setAttribute('aria-expanded', on);
      const input = f.querySelector('.search');
      input.value = '';
      input.tabIndex = on ? 0 : -1;
      f.querySelectorAll('.chip').forEach((b) => { b.tabIndex = on ? 0 : -1; });
    });
    [prev, key].filter(Boolean).forEach(renderFolderEntries);
  }

  // Hover the count + arrow for 1.5s to open a folder.
  let hoverTimer;
  cabinet.addEventListener('mouseover', (ev) => {
    const zone = ev.target.closest('[data-hover]');
    if (!zone || zone.contains(ev.relatedTarget)) return;
    const folder = zone.closest('.folder');
    if (state.openCat === folder.dataset.cat) return;
    clearTimeout(hoverTimer);
    cabinet.querySelectorAll('.folder.filling').forEach((f) => f.classList.remove('filling'));
    folder.classList.add('filling');
    hoverTimer = setTimeout(() => setOpenCat(folder.dataset.cat), 1500);
  });
  cabinet.addEventListener('mouseout', (ev) => {
    const zone = ev.target.closest('[data-hover]');
    if (!zone || zone.contains(ev.relatedTarget)) return;
    clearTimeout(hoverTimer);
    zone.closest('.folder').classList.remove('filling');
  });

  cabinet.addEventListener('click', (ev) => {
    const open = ev.target.closest('[data-open]');
    if (open) return jump(open.dataset.open);
    const chip = ev.target.closest('[data-fmt]');
    if (chip) { state.fmt = chip.dataset.fmt; return renderFolderEntries(chip.closest('.folder').dataset.cat); }
    const head = ev.target.closest('[data-toggle]');
    if (head) {
      clearTimeout(hoverTimer);
      const key = head.closest('.folder').dataset.cat;
      setOpenCat(state.openCat === key ? null : key);
    }
  });
  cabinet.addEventListener('keydown', (ev) => {
    const head = ev.target.closest('[data-toggle]');
    if (head && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); head.click(); }
  });
  cabinet.addEventListener('input', (ev) => {
    if (!ev.target.classList.contains('search')) return;
    state.query = ev.target.value;
    renderFolderEntries(ev.target.closest('.folder').dataset.cat);
  });

  // Tab rows: wheel scrolls sideways, click-drag scrolls, and a drag never opens a file.
  let dragged = false;
  function bindTabRow(el) {
    el.addEventListener('wheel', (ev) => {
      if (el.scrollWidth <= el.clientWidth) return;
      const d = Math.abs(ev.deltaX) > Math.abs(ev.deltaY) ? ev.deltaX : ev.deltaY;
      const atStart = el.scrollLeft <= 0, atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if ((d < 0 && atStart) || (d > 0 && atEnd)) return;
      ev.preventDefault();
      el.scrollLeft += d;
    }, { passive: false });
    el.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      const sx = e.clientX, sl = el.scrollLeft;
      dragged = false;
      el.classList.add('dragging');
      const mv = (ev) => { const dx = ev.clientX - sx; if (Math.abs(dx) > 4) dragged = true; el.scrollLeft = sl - dx; };
      const up = () => { el.classList.remove('dragging'); window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up); };
      window.addEventListener('mousemove', mv);
      window.addEventListener('mouseup', up);
    });
    el.addEventListener('click', (e) => { if (dragged) { e.stopPropagation(); e.preventDefault(); dragged = false; } }, true);
  }

  /* ── Dossier overlay ─────────────────────────────── */
  let lastFocus = null;
  function paintSheet(turn) {
    sheet.innerHTML = D.render(BY_ID[state.openId], { mode: 'overlay', base: '' });
    D.applyTurn(sheet.querySelector('.turn'), turn);
  }
  let turnTimer;
  function jump(id) {
    if (!BY_ID[id]) return;
    if (!state.open) {
      lastFocus = document.activeElement;
      state.open = true; state.openId = id;
      paintSheet('idle');
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('locked');
      history.replaceState(null, '', `#${id}`);
      setTimeout(() => sheet.querySelector('.back')?.focus({ preventScroll: true }), 50);
      return;
    }
    if (id === state.openId) return;
    clearTimeout(turnTimer);
    D.applyTurn(sheet.querySelector('.turn'), 'out');
    turnTimer = setTimeout(() => {
      state.openId = id;
      paintSheet('pre');
      history.replaceState(null, '', `#${id}`);
      const t = sheet.querySelector('.turn');
      requestAnimationFrame(() => requestAnimationFrame(() => D.applyTurn(t, 'idle')));
    }, 260);
  }
  function close() {
    if (!state.open) return;
    state.open = false;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('locked');
    history.replaceState(null, '', location.pathname + location.search);
    lastFocus?.focus?.({ preventScroll: true });
  }
  const step = (d) => jump(D.stepFrom(BY_ID[state.openId], d).id);

  D.bind(sheet);
  // The overlay clips the sheet; never let focus or scrollIntoView shift it.
  overlay.addEventListener('scroll', () => { overlay.scrollTop = 0; overlay.scrollLeft = 0; });
  overlay.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-close]')) return close();
    const j = ev.target.closest('[data-jump]');
    if (j) return jump(j.dataset.jump);
    const s = ev.target.closest('[data-step]');
    if (s) step(Number(s.dataset.step));
  });
  window.addEventListener('keydown', (e) => {
    if (!state.open) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });

  renderCabinet();
  paintSheet('idle');

  // Deep links: index.html#n1 opens that file.
  const openFromHash = () => { const id = decodeURIComponent(location.hash.slice(1)); if (BY_ID[id]) jump(id); };
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();
