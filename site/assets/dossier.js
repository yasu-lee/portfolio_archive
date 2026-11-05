/*
 * STUDY FILES — dossier sheet (shared by the cabinet overlay and the standalone entry pages).
 */
(function () {
  const { CATS, ENTRIES, BY_ID, pad } = window.STUDY;
  const CONFIG = Object.assign({ pageTurn: 'flip', highlight: 'marker', showThumbs: true }, window.STUDY_CONFIG || {});
  const HL_KEY = 'studyfiles.highlights';

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const short = (t) => (Array.from(t).length > 16 ? Array.from(t).slice(0, 15).join('') + '…' : t);
  const siblingsOf = (s) => ENTRIES.filter((e) => e.cat === s.cat);
  const stepFrom = (s, d) => { const l = siblingsOf(s); const i = l.findIndex((e) => e.id === s.id); return l[(i + d + l.length) % l.length]; };

  function loadHL() { try { return JSON.parse(localStorage.getItem(HL_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function saveHL(hl) { try { localStorage.setItem(HL_KEY, JSON.stringify(hl)); } catch (e) {} }

  /**
   * Inner HTML of a `.sheet`.
   * mode 'overlay': navigation uses buttons with data-jump / data-step / data-close (handled by app.js).
   * mode 'page':    navigation uses real links relative to `base` (e.g. '../').
   */
  function render(s, { mode = 'overlay', base = '', hl = loadHL() } = {}) {
    const link = mode === 'page';
    const cat = CATS.find((c) => c.key === s.cat);
    const sibs = siblingsOf(s);
    const href = (e) => esc(base + e.page);
    const nav = (e, cls, attrs, inner, title) => link
      ? `<a class="${cls}" href="${href(e)}"${title ? ` title="${esc(title)}"` : ''} ${attrs}>${inner}</a>`
      : `<button type="button" class="${cls}" data-jump="${e.id}"${title ? ` title="${esc(title)}"` : ''} ${attrs}>${inner}</button>`;

    const idx = sibs.map((e) => {
      const cur = e.id === s.id;
      return nav(e, `itab${cur ? ' cur' : ''}`, `style="background:${cur ? '#FDFAF7' : e.color};color:${cur ? '#141414' : e.fg}"${cur ? ' aria-current="page"' : ''}`,
        esc(`${e.no}  ${short(e.title)}`), e.title);
    }).join('');
    const ctabs = CATS.filter((c) => c.key !== s.cat).map((c) => {
      const first = ENTRIES.find((e) => e.cat === c.key);
      return first ? nav(first, 'ctab', `style="background:${c.color};color:${c.fg}"`, esc(c.name)) : '';
    }).join('');

    const prev = stepFrom(s, -1), next = stepFrom(s, 1);
    const stepBtn = (e, d, label) => link
      ? `<a class="step" href="${href(e)}" aria-label="${d < 0 ? '이전' : '다음'} 파일">${label}</a>`
      : `<button type="button" class="step" data-step="${d}" aria-label="${d < 0 ? '이전' : '다음'} 파일">${label}</button>`;
    const back = link
      ? `<a class="back" href="${esc(base)}index.html#${s.id}">← CABINET · ESC</a>`
      : `<button type="button" class="back" data-close>← CABINET · ESC</button>`;

    const meta = [
      ['FILE', s.no], ['CATEGORY', cat.name], ['SOURCE', s.source], ['DATE', s.date],
      ['FORMAT', s.fmt], ['TAGS', s.tags.join(', ')], ['PATH', s.path],
    ].map(([k, v]) => `<div><span class="k">${k}</span><span class="v">${esc(v)}</span></div>`).join('');

    const actions = s.format.map((f) => {
      if (f === 'HTML') {
        // The entry's own HTML file. On the standalone page it is the current file, so skip it there.
        return link ? '' : `<a class="act" href="${href(s)}" target="_blank" rel="noopener">HTML 열기 ↗</a>`;
      }
      if (f === 'Demo') return s.demo ? `<a class="act" href="${esc(s.demo)}" target="_blank" rel="noopener">데모 열기 ↗</a>` : '';
      if (f === 'Guide') return '';
      const target = f === 'PPT' ? `/${s.page.replace(/\.html$/, '.pptx')}` : s.path;
      const label = f === 'PPT' ? 'PPT 경로 복사 ↓' : `${f} 경로 복사`;
      return `<button type="button" class="act" data-copy="${esc(target)}" data-label="${esc(label)}">${esc(label)}</button>`;
    }).join('');

    const chars = Array.from(s.summary);
    const points = s.points.map((t, i) => {
      const key = `${s.id}-${i}`, on = !!hl[key];
      return `<button type="button" class="pt${on ? ' on' : ''}" data-hl="${key}" aria-pressed="${on}">
        <span class="n">${pad(i + 1)}</span><span><span class="txt">${esc(t)}</span></span><span class="mk">${on ? '■' : '□'}</span></button>`;
    }).join('');
    const hlCount = s.points.filter((_, i) => hl[`${s.id}-${i}`]).length;

    const thumb = CONFIG.showThumbs ? `
      <div class="thumb">
        <svg width="26" height="64" viewBox="0 0 26 64" aria-hidden="true"><path d="M9 22 V9 a6 6 0 0 1 12 0 V50 a8 8 0 0 1 -16 0 V16" fill="none" stroke="#6f6f6f" stroke-width="2.4" stroke-linecap="round"></path></svg>
        <div class="img" style="${s.image
          ? `background-image:url('${esc(base + s.image)}')`
          : `background-image:repeating-linear-gradient(135deg,${s.color}40 0 1px,transparent 1px 9px)`}">${s.image ? '' : esc(s.thumb)}</div>
        <div class="cap"><span>${esc(s.no)}</span><span>${esc(s.date)}</span></div>
      </div>` : '';

    return `
      <div class="holes" aria-hidden="true"></div>
      <nav class="idx" aria-label="인덱스 탭">${idx}<span class="gap"></span>${ctabs}</nav>
      <div class="sheet-scroll">
        <article class="turn${CONFIG.highlight === 'block' ? ' hl-block' : ''}">
          <div class="bar">
            ${back}
            <span class="crumb"><span class="sw" style="background:${s.color}"></span>${esc(s.no)} · ${esc(cat.name.toUpperCase())}</span>
            <span class="nav">${stepBtn(prev, -1, '←')}<span class="ctr">${pad(sibs.findIndex((e) => e.id === s.id) + 1)} / ${pad(sibs.length)}</span>${stepBtn(next, 1, '→')}</span>
          </div>
          <div class="cols">
            <div class="col-l">
              ${thumb}
              <div class="meta">${meta}</div>
              ${actions ? `<div class="actions">${actions}</div>` : ''}
            </div>
            <div class="col-r">
              <div class="head">
                <span class="src" style="color:${s.ink}">${esc(s.source)} — ${esc(s.date)}</span>
                <h2>${esc(s.title)}</h2>
              </div>
              <p class="body"><span class="dropcap" style="color:${s.ink}">${esc(chars[0])}</span>${esc(chars.slice(1).join(''))}</p>
              <div class="kt">
                <div class="kt-head"><span>KEY TAKEAWAYS</span><span class="lbl">${hlCount ? `${hlCount}개 표시됨` : '클릭해서 하이라이트'}</span></div>
                ${points}
              </div>
            </div>
          </div>
        </article>
      </div>`;
  }

  /** Wires highlight toggles and copy buttons inside a sheet. Updates in place so transitions play. */
  function bind(sheet) {
    let ct;
    sheet.addEventListener('click', (ev) => {
      const pt = ev.target.closest('[data-hl]');
      if (pt) {
        const hl = loadHL();
        const key = pt.dataset.hl;
        hl[key] = !hl[key];
        if (!hl[key]) delete hl[key];
        saveHL(hl);
        const on = !!hl[key];
        pt.classList.toggle('on', on);
        pt.setAttribute('aria-pressed', on);
        pt.querySelector('.mk').textContent = on ? '■' : '□';
        const n = sheet.querySelectorAll('.pt.on').length;
        const lbl = sheet.querySelector('.kt-head .lbl');
        if (lbl) lbl.textContent = n ? `${n}개 표시됨` : '클릭해서 하이라이트';
        return;
      }
      const cp = ev.target.closest('[data-copy]');
      if (cp) {
        const text = cp.dataset.copy;
        (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).catch(() => {
          const ta = document.createElement('textarea');
          ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); } catch (e) {}
          ta.remove();
        });
        sheet.querySelectorAll('[data-copy].done').forEach((b) => { b.classList.remove('done'); b.textContent = b.dataset.label; });
        cp.classList.add('done');
        cp.textContent = '복사됨 ✓';
        clearTimeout(ct);
        ct = setTimeout(() => { cp.classList.remove('done'); cp.textContent = cp.dataset.label; }, 1600);
      }
    });
  }

  /** Inline transform/opacity/transition for the page-turn states. */
  function turnStyle(state) {
    const flip = CONFIG.pageTurn === 'flip';
    return {
      idle: { t: 'none', o: 1, tr: 'transform .45s cubic-bezier(.2,.8,.2,1), opacity .35s' },
      out: flip ? { t: 'perspective(1800px) rotateY(-16deg) translateX(-5%)', o: 0, tr: 'transform .26s ease-in, opacity .22s' }
                : { t: 'translateY(-14px)', o: 0, tr: 'transform .24s ease-in, opacity .22s' },
      pre: flip ? { t: 'perspective(1800px) rotateY(10deg) translateX(5%)', o: 0, tr: 'none' }
                : { t: 'translateY(14px)', o: 0, tr: 'none' },
    }[state];
  }
  function applyTurn(el, state) {
    if (!el) return;
    const T = turnStyle(state);
    el.style.transition = T.tr; el.style.transform = T.t; el.style.opacity = T.o;
  }

  window.Dossier = { render, bind, applyTurn, stepFrom, esc, CONFIG, BY_ID };
})();
