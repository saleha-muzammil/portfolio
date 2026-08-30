/* =========================================================================
   Saleha's Desktop — window manager, dock, drag & drop
   You shouldn't need to edit this file. Content lives in js/config.js.
   ========================================================================= */
(function () {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, c =>
  ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
// Uses the built-in SVG sprite unless CONFIG.icons names an image file for that id.
// Escapes each paragraph, then links words from CONFIG.me.bioLinks in order.
// A cursor advances past each inserted <a>, so a URL can never be re-matched.
const reEsc = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function bioHtml (paras, links) {
  const queue = (links || []).slice();
  return [].concat(paras).map(p => {
    let out = esc(p), pos = 0;
    while (queue.length) {
      const { word, url } = queue[0];
      const re = new RegExp('\\b' + reEsc(esc(word)) + '\\b', 'g');
      re.lastIndex = pos;
      const m = re.exec(out);
      if (!m) break;                       // not in this paragraph — try the next one
      queue.shift();
      const a = `<a href="${url}" target="_blank" rel="noopener">${m[0]}</a>`;
      out = out.slice(0, m.index) + a + out.slice(m.index + m[0].length);
      pos = m.index + a.length;
    }
    return `<p>${out}</p>`;
  }).join('');
}

const svg = (id, cls = '') => {
  const custom = (typeof CONFIG !== 'undefined' && CONFIG.icons) ? CONFIG.icons[id] : null;
  return custom
    ? `<img class="ico ${cls}" src="${custom}" alt="" draggable="false">`
    : `<svg class="${cls}" viewBox="0 0 64 64" aria-hidden="true"><use href="#i-${id}"/></svg>`;
};

const desktopEl = $('#desktop');
const winLayer  = $('#windows');

/* ===================== 1. MENU BAR CLOCK ===================== */
function tickClock () {
  const d = new Date();
  $('#clock').textContent = d.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  }) + '  ' + d.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit'
  });
}
tickClock();
setInterval(tickClock, 10000);

/* ===================== 2. WINDOW MANAGER ===================== */
let zTop = 100;
const openWins = new Map();   // id -> element

function focusWin (el) {
  $$('.win').forEach(w => w.classList.add('inactive'));
  el.classList.remove('inactive');
  el.style.zIndex = ++zTop;
}

function closeWin (el) {
  el.classList.add('closing');
  el.addEventListener('animationend', () => {
    openWins.delete(el.dataset.winId);
    el.remove();
    syncDockDots();
    const rest = $$('.win');
    if (rest.length) focusWin(rest[rest.length - 1]);
  }, { once: true });
}

/* Cascade placement so windows don't stack perfectly */
let cascade = 0;
function nextPos (w, h) {
  const pad = 34;
  const maxX = Math.max(pad, window.innerWidth  - w - pad);
  const maxY = Math.max(40,  window.innerHeight - h - 100);
  const step = (cascade++ % 6) * 28;
  // clear the about card (left ~46px + 334px wide) on roomy screens
  const startX = window.innerWidth > 1100 ? 428 : Math.round(window.innerWidth * 0.14);
  return {
    x: Math.max(pad, Math.min(maxX, startX + step)),
    y: Math.min(maxY, 70 + step)
  };
}

/**
 * open({ id, title, icon, body, w, h, className })
 * Re-focuses an already-open window rather than duplicating it.
 */
function open (opts) {
  const id = opts.id;
  if (openWins.has(id)) { focusWin(openWins.get(id)); return openWins.get(id); }

  const w = Math.min(opts.w || 620, window.innerWidth  - 24);
  const h = Math.min(opts.h || 460, window.innerHeight - 130);
  const { x, y } = nextPos(w, h);

  const el = document.createElement('section');
  el.className = 'win ' + (opts.className || '');
  el.dataset.winId = id;
  el.style.cssText = `left:${x}px; top:${y}px; width:${w}px; height:${h}px; z-index:${++zTop}`;
  el.innerHTML =
    `<header class="titlebar">
       <div class="lights">
         <button class="light red"    aria-label="Close window"></button>
         <button class="light yellow" aria-label="Minimise window"></button>
         <button class="light green"  aria-label="Zoom window"></button>
       </div>
       <div class="win-title">${opts.icon ? svg(opts.icon) : ''}<span>${esc(opts.title)}</span></div>
       <div class="lights" style="visibility:hidden"><span class="light"></span><span class="light"></span><span class="light"></span></div>
     </header>
     <div class="win-body">${opts.body}</div>
     ${opts.status ? `<div class="finder-status">${esc(opts.status)}</div>` : ''}
     <div class="resize-handle" title="Resize"></div>`;

  winLayer.appendChild(el);
  openWins.set(id, el);
  focusWin(el);
  syncDockDots();

  /* traffic lights */
  $('.light.red', el).addEventListener('click', e => { e.stopPropagation(); closeWin(el); });
  $('.light.yellow', el).addEventListener('click', e => {
    e.stopPropagation();
    el.classList.add('minimizing');
    el.addEventListener('animationend', () => closeWin(el), { once: true });
  });
  $('.light.green', el).addEventListener('click', e => { e.stopPropagation(); zoomWin(el); });

  el.addEventListener('pointerdown', () => focusWin(el));
  makeDraggable(el, $('.titlebar', el));
  makeResizable(el, $('.resize-handle', el));
  return el;
}

function zoomWin (el) {
  if (el.dataset.zoomed) {
    el.style.cssText = el.dataset.prev + `;z-index:${el.style.zIndex}`;
    delete el.dataset.zoomed;
  } else {
    el.dataset.prev = `left:${el.offsetLeft}px;top:${el.offsetTop}px;width:${el.offsetWidth}px;height:${el.offsetHeight}px`;
    el.dataset.zoomed = '1';
    const mb = 26, dock = 88;
    el.style.left = '12px';
    el.style.top  = mb + 12 + 'px';
    el.style.width  = (window.innerWidth - 24) + 'px';
    el.style.height = (window.innerHeight - mb - dock - 12) + 'px';
  }
}

/* --- generic pointer drag, constrained to the viewport --- */
function makeDraggable (el, handle) {
  handle.addEventListener('pointerdown', e => {
    if (e.target.closest('.light') || e.button !== 0) return;
    if (window.innerWidth <= 860) return;               // windows are full-bleed on mobile
    const sx = e.clientX, sy = e.clientY;
    const ox = el.offsetLeft, oy = el.offsetTop;
    handle.classList.add('dragging');
    handle.setPointerCapture(e.pointerId);

    const move = ev => {
      const nx = ox + ev.clientX - sx;
      const ny = oy + ev.clientY - sy;
      el.style.left = Math.max(-el.offsetWidth + 90, Math.min(window.innerWidth - 90, nx)) + 'px';
      el.style.top  = Math.max(26, Math.min(window.innerHeight - 44, ny)) + 'px';
    };
    const up = () => {
      handle.classList.remove('dragging');
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
      handle.removeEventListener('pointercancel', up);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
    handle.addEventListener('pointercancel', up);
  });
}

function makeResizable (el, grip) {
  grip.addEventListener('pointerdown', e => {
    e.stopPropagation();
    const sx = e.clientX, sy = e.clientY;
    const ow = el.offsetWidth, oh = el.offsetHeight;
    grip.setPointerCapture(e.pointerId);
    const move = ev => {
      el.style.width  = Math.max(340, ow + ev.clientX - sx) + 'px';
      el.style.height = Math.max(200, oh + ev.clientY - sy) + 'px';
    };
    const up = () => {
      grip.removeEventListener('pointermove', move);
      grip.removeEventListener('pointerup', up);
    };
    grip.addEventListener('pointermove', move);
    grip.addEventListener('pointerup', up);
  });
}

/* ===================== 3. WINDOW CONTENTS ===================== */
const iconForKind = k =>
  k === 'pdf' ? 'pdf' : k === 'link' ? 'safari' : k === 'image' ? 'photos' : 'doc';

function openEmail () {
  const { address, note } = CONFIG.email;
  const el = open({
    id: 'email', title: 'Mail', icon: 'mail', w: 520, h: 430,
    body:
      `<div class="mail-pane">
         ${svg('mail')}
         <h2>Say hello</h2>
         <p class="note">${esc(note)}</p>
         <div class="mail-addr"><span id="the-addr">${esc(address)}</span>
           <button class="copy-btn" id="copy-email">Copy</button></div>
         <div class="mail-actions">
           <a href="mailto:${esc(address)}">Open in Mail</a>
         </div>
       </div>`
  });
  const btn = $('#copy-email', el);
  btn && btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      const r = document.createRange(); r.selectNode($('#the-addr', el));
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      try { document.execCommand('copy'); } catch {}
      s.removeAllRanges();
    }
    btn.textContent = 'Copied!'; btn.classList.add('done');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1800);
  });
}

// escape first, then turn any bare http(s) URL into a link
const linkify = (t) => esc(t).replace(/https?:\/\/[^\s<]+/g,
  u => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);

function openDoc (file) {
  open({
    id: 'doc:' + file.name, title: file.name, icon: iconForKind(file.kind), w: 580, h: 440,
    body: `<div class="prose"><h2>${esc(file.name)}</h2>
             ${(file.body || []).map(p => `<p>${linkify(p)}</p>`).join('')}
             ${file.url ? `<p><a class="doc-link" href="${esc(file.url)}"
                 target="_blank" rel="noopener">${esc(file.url)}</a></p>` : ''}</div>`
  });
}

function openPdf (file) {
  open({
    id: 'pdf:' + file.name, title: file.name, icon: 'pdf', w: 700, h: 560,
    body:
      `<object class="pdf-frame" data="${esc(file.url)}" type="application/pdf">
         <div class="prose"><h2>${esc(file.name)}</h2>
           <p class="sub">This file hasn't been uploaded yet.</p>
           <p>Drop the PDF at <code>${esc(file.url)}</code> and it will show up right here.</p>
           <p><a class="copy-btn" style="display:inline-block;text-decoration:none"
                 href="${esc(file.url)}" target="_blank" rel="noopener">Try opening it anyway</a></p>
         </div>
       </object>`
  });
}

function openImage (file) {
  open({
    id: 'img:' + file.name, title: file.name, icon: 'photos', w: 760, h: 600,
    className: 'is-image',
    status: file.note || file.name,
    body: `<div class="img-view"><img src="${esc(file.url)}" alt="${esc(file.note || file.name)}"></div>`
  });
}

function openFile (file) {
  if (file.kind === 'link') { window.open(file.url, '_blank', 'noopener'); return; }
  if (file.kind === 'pdf')   { openPdf(file); return; }
  if (file.kind === 'image') { openImage(file); return; }
  openDoc(file);
}

function openFolder (folder) {
  const files = folder.files || [];
  const sidebar =
    `<aside class="finder-side">
       <div class="side-h">Favourites</div>
       ${CONFIG.folders.map(f =>
         `<button class="side-item ${f.id === folder.id ? 'active' : ''}" data-folder="${esc(f.id)}">
            ${svg('folder')}<span>${esc(f.name)}</span></button>`).join('')}
       <div class="side-h">Me</div>
       <button class="side-item" data-act="email">${svg('mail')}<span>Email</span></button>
     </aside>`;

  const main = files.length
    ? `<div class="file-grid">${files.map((f, i) =>
         `<button class="f-item" data-file="${i}">${
            f.kind === 'image'
              ? `<img class="thumb" src="${esc(f.thumb || f.url)}" alt="" loading="lazy">`
              : svg(iconForKind(f.kind))}
            <span class="lbl">${esc(f.name)}</span></button>`).join('')}</div>`
    : `<p class="finder-empty">This folder is empty — for now.</p>`;

  const el = open({
    id: 'folder:' + folder.id, title: folder.name, icon: 'folder', w: 720, h: 470,
    className: 'is-finder',
    status: `${files.length} item${files.length === 1 ? '' : 's'}`,
    body: `<div class="finder">${sidebar}<div class="finder-main">${main}</div></div>`
  });

  const bar = $('.finder-status', el);
  const count = `${files.length} item${files.length === 1 ? '' : 's'}`;
  $$('.f-item', el).forEach(b => {
    b.addEventListener('click', () => {
      $$('.f-item', el).forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      const f = files[+b.dataset.file];
      if (bar) bar.textContent = f.note || f.name;
    });
    b.addEventListener('dblclick', () => openFile(files[+b.dataset.file]));
  });
  $('.finder-main', el).addEventListener('click', e => {
    if (e.target.closest('.f-item')) return;
    $$('.f-item', el).forEach(x => x.classList.remove('selected'));
    if (bar) bar.textContent = count;
  });
  $$('.side-item', el).forEach(b => b.addEventListener('click', () => {
    if (b.dataset.folder) {
      const f = CONFIG.folders.find(x => x.id === b.dataset.folder);
      if (f) { closeWin(el); openFolder(f); }
    } else if (b.dataset.act === 'email') openEmail();
  }));
}

function openPhotos () {
  const shots = CONFIG.photos || [];
  open({
    id: 'photos', title: 'Photos', icon: 'photos', w: 640, h: 470,
    status: `${shots.length} item${shots.length === 1 ? '' : 's'}`,
    body: shots.length
      ? `<div class="finder-main"><div class="photo-grid">${shots.map(ph =>
          `<figure class="photo"><img src="${esc(ph.src)}" alt="${esc(ph.caption || '')}" loading="lazy">
             <figcaption>${esc(ph.caption || '')}</figcaption></figure>`).join('')}</div></div>`
      : `<div class="prose"><h2>Photos</h2>
           <p class="sub">Nothing in here yet.</p>
           <p>Drop images into <code>assets/</code> and list them under <code>photos</code>
              in <code>js/config.js</code> to fill this window.</p></div>`
  });
}

/* ---------------- Notes app: to-do + guestbook ---------------- */
const TODO_KEY = 'desk.todo.v1';
const GUEST_KEY = 'desk.guestbook.v1';

const store = {
  get (k, fallback) {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

function todoItems () {
  const seeded = (CONFIG.notesApp.todo.items || []).map(t => ({ t, done: false }));
  return store.get(TODO_KEY, seeded);
}

function todoStamp () { return store.get(TODO_KEY + '.at', null); }

function renderTodo (pane) {
  const items = todoItems();
  pane.innerHTML =
    `<div class="np-date">${esc(noteDate(todoStamp()))}</div>
     <h2 class="np-title">${esc(CONFIG.notesApp.todo.title)}</h2>
     <ul class="np-check">${items.map((it, i) =>
       `<li class="${it.done ? 'done' : ''}">
          <button class="tick" data-i="${i}" aria-label="Toggle"></button>
          <span class="tx">${esc(it.t)}</span>
          <button class="del" data-del="${i}" aria-label="Delete">&times;</button>
        </li>`).join('')}
       <li class="add"><span class="tick ghost"></span>
         <input class="tx" placeholder="New item" maxlength="140"></li>
     </ul>`;

  const save = a => { store.set(TODO_KEY, a); store.set(TODO_KEY + '.at', Date.now()); };
  $$('.tick[data-i]', pane).forEach(b => b.addEventListener('click', () => {
    const a = todoItems(); a[+b.dataset.i].done = !a[+b.dataset.i].done;
    save(a); renderTodo(pane);
  }));
  $$('.del', pane).forEach(b => b.addEventListener('click', () => {
    const a = todoItems(); a.splice(+b.dataset.del, 1); save(a); renderTodo(pane);
  }));
  const inp = $('.add input', pane);
  inp.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const t = inp.value.trim(); if (!t) return;
    const a = todoItems(); a.push({ t, done: false }); save(a);
    renderTodo(pane); $('.add input', pane).focus();
  });
}

/* --- guestbook backends. Each returns/accepts plain {name, body, at} --- */
const guestbook = {
  cfg: () => CONFIG.notesApp.guestbook,

  async list () {
    const g = guestbook.cfg();
    if (g.backend === 'supabase') {
      const { url, anonKey, table } = g.supabase;
      const r = await fetch(`${url}/rest/v1/${table}?select=*&order=at.desc&limit=50`,
        { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } });
      if (!r.ok) throw new Error('Could not load notes (' + r.status + ')');
      return await r.json();
    }
    return store.get(GUEST_KEY, []);
  },

  async add (note) {
    const g = guestbook.cfg();
    if (g.backend === 'formspree') {
      const r = await fetch(g.formspree.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: note.name, message: note.body })
      });
      if (!r.ok) throw new Error('Could not send (' + r.status + ')');
      return;
    }
    if (g.backend === 'supabase') {
      const { url, anonKey, table } = g.supabase;
      const r = await fetch(`${url}/rest/v1/${table}`, {
        method: 'POST',
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`,
                   'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(note)
      });
      if (!r.ok) throw new Error('Could not save (' + r.status + ')');
      return;
    }
    const all = store.get(GUEST_KEY, []);
    all.unshift(note);
    store.set(GUEST_KEY, all.slice(0, 50));
  }
};

function noteDate (at) {
  const d = at ? new Date(at) : new Date();
  const today = new Date();
  const same = d.toDateString() === today.toDateString();
  return (same ? 'Today' : d.toLocaleDateString('en-US',
           { month: 'short', day: 'numeric', year: 'numeric' })) +
         '  ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function renderGuestbook (pane) {
  const g = CONFIG.notesApp.guestbook;
  pane.innerHTML =
    `<div class="np-date">${esc(noteDate())}</div>
     <h2 class="np-title">${esc(g.title)}</h2>
     <p class="np-body">${esc(g.intro)}</p>
     <textarea class="gb-body" placeholder="Write your note here…" rows="3" maxlength="1000"></textarea>
     <p class="np-hint"><span class="gb-status" role="status"></span><span class="gb-tip">${esc(g.hint)}</span></p>
     ${g.showWall && g.backend !== 'formspree' ? '<div class="np-wall" hidden></div>' : ''}
     ${g.backend === 'local'
        ? '<p class="np-fine">Saved in this browser only — not yet sent anywhere.</p>' : ''}`;

  const box    = $('.gb-body', pane);
  const status = $('.gb-status', pane);
  const tip    = $('.gb-tip', pane);
  const wall   = $('.np-wall', pane);

  async function paint () {
    if (!wall) return;
    try {
      const notes = await guestbook.list();
      wall.hidden = !notes.length;
      wall.innerHTML = notes.map(n =>
        `<div class="np-note"><div class="np-who">Anonymous
           <span>${esc(noteDate(n.at))}</span></div>
           <div class="np-text">${esc(n.body)}</div></div>`).join('');
    } catch (err) {
      wall.hidden = false;
      wall.innerHTML = `<p class="np-fine">${esc(err.message)}</p>`;
    }
  }
  paint();

  async function send () {
    const body = box.value.trim();
    if (!body) return;
    box.disabled = true; tip.hidden = true; status.textContent = 'Posting…';
    try {
      await guestbook.add({ name: 'Anonymous', body, at: new Date().toISOString() });
      box.value = '';
      status.textContent = CONFIG.notesApp.guestbook.thanks;
      paint();
    } catch (err) { status.textContent = err.message; }
    finally {
      box.disabled = false;
      setTimeout(() => { status.textContent = ''; tip.hidden = false; }, 4000);
    }
  }
  box.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
}

function openNotes (which) {
  const el = open({
    id: 'notes', title: 'Notes', icon: 'notes', w: 700, h: 500,
    body:
      `<div class="notes-app">
         <aside class="notes-side">
           <button class="note-item active" data-note="todo">
             <span class="ni-t">${esc(CONFIG.notesApp.todo.title)}</span>
             <span class="ni-s"><em>${esc(noteDate(todoStamp()).split('  ')[0])}</em>
               ${esc((todoItems().find(i => !i.done) || { t: 'All done' }).t)}</span></button>
           <button class="note-item" data-note="guest">
             <span class="ni-t">${esc(CONFIG.notesApp.guestbook.title)}</span>
             <span class="ni-s"><em>Today</em> ${esc(CONFIG.notesApp.guestbook.intro)}</span></button>
         </aside>
         <div class="notes-main" id="notes-main"></div>
       </div>`
  });
  const pane = $('#notes-main', el);
  const show = key => {
    $$('.note-item', el).forEach(b => b.classList.toggle('active', b.dataset.note === key));
    key === 'todo' ? renderTodo(pane) : renderGuestbook(pane);
  };
  $$('.note-item', el).forEach(b => b.addEventListener('click', () => show(b.dataset.note)));
  show(which === 'guest' ? 'guest' : 'todo');
  return el;
}

/* ===================== 4. DESKTOP ICONS ===================== */
function buildDesktopIcons () {
  const grid = $('#icon-grid');
  const items = [
    ...CONFIG.folders.map(f => ({ icon: 'folder', label: f.name, act: () => openFolder(f) })),
    { icon: 'mail',  label: 'Email Me',  act: openEmail },
    ...(CONFIG.desktopFiles || []).map(f => ({
      icon: iconForKind(f.kind), label: f.name, act: () => openFile(f)
    })),
  ];

  grid.innerHTML = items.map((it, i) =>
    `<button class="d-icon" data-i="${i}">${svg(it.icon)}<span class="lbl">${esc(it.label)}</span></button>`
  ).join('');

  const touch = matchMedia('(hover: none)').matches;
  $$('.d-icon', grid).forEach(btn => {
    const it = items[+btn.dataset.i];
    btn.addEventListener('click', e => {
      e.stopPropagation();
      $$('.d-icon').forEach(x => x.classList.remove('selected'));
      btn.classList.add('selected');
      if (touch) it.act();                    // single tap on touch devices
    });
    btn.addEventListener('dblclick', () => it.act());
  });
}

/* ===================== 5. DOCK ===================== */
function buildDock () {
  const dock = $('#dock');
  const items = [
    { icon: 'finder',   label: 'Finder',   act: () => openFolder(CONFIG.folders[0]) },
    { icon: 'notes',    label: 'Notes',    act: openNotes },
    { icon: 'photos',   label: 'Photos',   act: openPhotos },
    { icon: 'mail',     label: 'Mail',     act: openEmail, id: 'email' },
    { sep: true },
    { icon: 'github',   label: 'GitHub',   href: CONFIG.links.github },
    { icon: 'linkedin', label: 'LinkedIn', href: CONFIG.links.linkedin },
  ];

  dock.innerHTML = items.map((it, i) => it.sep
    ? '<li class="dock-sep" aria-hidden="true"></li>'
    : `<li data-i="${i}"><span class="dock-tip">${esc(it.label)}</span>
         <button class="dock-btn" aria-label="${esc(it.label)}">${svg(it.icon)}</button>
         <span class="run-dot"></span></li>`
  ).join('');

  $$('#dock li[data-i]').forEach(li => {
    const it = items[+li.dataset.i];
    $('.dock-btn', li).addEventListener('click', () => {
      if (it.href) window.open(it.href, '_blank', 'noopener');
      else it.act();
    });
  });

  /* Genie-ish magnification: scale by cursor distance */
  const btns = $$('#dock .dock-btn');
  const RANGE = 115, MAXSCALE = 1.4;
  dock.addEventListener('pointermove', e => {
    if (matchMedia('(hover: none)').matches) return;
    btns.forEach(b => {
      const r = b.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      // cosine falloff: peaks smoothly under the cursor and eases to 1 at the edge
      const t = d >= RANGE ? 0 : (Math.cos((d / RANGE) * Math.PI) + 1) / 2;
      const sc = 1 + (MAXSCALE - 1) * t;
      b.style.transform = `scale(${sc.toFixed(3)}) translateY(${(-(sc - 1) * 17).toFixed(1)}px)`;
    });
  });
  dock.addEventListener('pointerleave', () => btns.forEach(b => (b.style.transform = '')));
}

/* running-app dots under dock icons */
function syncDockDots () {
  $$('#dock li[data-i]').forEach(li => {
    const label = $('.dock-tip', li).textContent.toLowerCase();
    const on = [...openWins.keys()].some(k =>
      k.toLowerCase().includes(label) ||
      (label === 'finder' && k.startsWith('folder:')) ||
      (label === 'mail'   && k === 'email') ||
      (label === 'about me' && k === 'about'));
    li.classList.toggle('running', on);
  });
}

/* ===================== 6. MENU BAR DROPDOWNS ===================== */
const MENUS = {
  apple: [
    ['Contact Saleha…', openEmail, '⌘E'],
    ['Search…',          () => slOpen(), '⌘K'],
    '-',
    ['Close All Windows', () => $$('.win').forEach(closeWin), '⌥⌘W'],
  ],
  finder: [['Notes', () => openNotes('todo'), '⌘,'], '-', ['Leave a note', () => openNotes('guest')]],
  file:   [['New Finder Window', () => openFolder(CONFIG.folders[0]), '⌘N'],
           ['Open Résumé', () => (CONFIG.desktopFiles[0] && openFile(CONFIG.desktopFiles[0]))],
           '-',
           ['Close Window', () => { const w = $$('.win').pop(); w && closeWin(w); }, '⌘W']],
  edit:   [['Undo', null, '⌘Z'], ['Redo', null, '⇧⌘Z'], '-',
           ['Copy Email Address', () => { navigator.clipboard?.writeText(CONFIG.email.address); openEmail(); }, '⌘C']],
  view:   [['Show About Card', () => { const w = $('#about-widget'); w.hidden = false; w.classList.remove('collapsed'); }],
           ['Close All Windows', () => $$('.win').forEach(closeWin)],
           ['Show Notes', () => openNotes('todo')]],
  go:     [...CONFIG_go()],
  help:   [['How does this work?', openNotes], '-', ['Email me instead', openEmail]],
};
function CONFIG_go () {
  return CONFIG.folders.map(f => [f.name, () => openFolder(f)]).concat([['Notes', () => openNotes('todo')]]);
}

const dd = $('#mb-dropdown');
function closeDropdown () { dd.hidden = true; $$('.mb-item').forEach(b => b.classList.remove('open')); }

$$('.menubar [data-menu]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const wasOpen = btn.classList.contains('open');
    closeDropdown();
    if (wasOpen) return;
    btn.classList.add('open');
    const rows = MENUS[btn.dataset.menu] || [];
    dd.innerHTML = rows.map((r, i) => r === '-' ? '<hr>' :
      `<button data-r="${i}" ${r[1] ? '' : 'disabled'}>
         <span>${esc(r[0])}</span>${r[2] ? `<span class="k">${esc(r[2])}</span>` : ''}</button>`).join('');
    dd.hidden = false;
    dd.style.left = Math.min(btn.getBoundingClientRect().left, window.innerWidth - 240) + 'px';
    $$('button[data-r]', dd).forEach(b => b.addEventListener('click', () => {
      const fn = rows[+b.dataset.r][1]; closeDropdown(); fn && fn();
    }));
  });
});

/* ===================== 7. DESKTOP CONTEXT MENU ===================== */
const ctx = $('#ctx-menu');
function hideCtx () { ctx.hidden = true; }

desktopEl.addEventListener('contextmenu', e => {
  if (e.target.closest('.win') || e.target.closest('.about-widget')) return;
  e.preventDefault();
  const showCard = () => { const w = $('#about-widget'); w.hidden = false; w.classList.remove('collapsed'); };
  const rows = [
    ['Show About Card', showCard],
    ['Email Me',        openEmail],
    ['Notes',           openNotes],
    '-',
    ['Close All Windows', () => $$('.win').forEach(closeWin)],
  ];
  ctx.innerHTML = rows.map((r, i) => r === '-' ? '<hr>' :
    `<button data-r="${i}">${esc(r[0])}</button>`).join('');
  ctx.hidden = false;
  ctx.style.left = Math.min(e.clientX, window.innerWidth  - 226) + 'px';
  ctx.style.top  = Math.min(e.clientY, window.innerHeight - 190) + 'px';
  $$('button[data-r]', ctx).forEach(b => b.addEventListener('click', () => {
    const fn = rows[+b.dataset.r][1]; hideCtx(); fn && fn();
  }));
});

document.addEventListener('click', e => {
  hideCtx();
  if (!e.target.closest('.menubar')) closeDropdown();
  if (!e.target.closest('.d-icon')) $$('.d-icon').forEach(x => x.classList.remove('selected'));
});
document.addEventListener('keydown', e => {
  const typing = /^(INPUT|TEXTAREA)$/.test(e.target.tagName);
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); slOpen(); return; }
  if (e.key === '/' && !typing) { e.preventDefault(); slOpen(); return; }
  if (e.key === 'Escape') {
    if (!$('#spotlight').hidden) { slClose(); return; }
    hideCtx(); closeDropdown(); const w = $$('.win').pop(); w && closeWin(w);
  }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') { e.preventDefault(); openEmail(); }
});

/* ===================== 8. ABOUT WIDGET ===================== */
function hydrateWidget () {
  const me = CONFIG.me;
  $('#aw-name').textContent   = me.name;
  $('#aw-role').textContent   = me.role;
  $('#aw-bio').innerHTML      = bioHtml(me.bio, me.bioLinks);
  const av = $('#aw-avatar');
  av.textContent = me.initials || me.name[0];
  if (me.avatar) {                       // only swap in the photo once it actually loads
    const img = new Image();
    img.onload = () => {
      av.style.backgroundImage = `url('${me.avatar}')`;
      av.textContent = '';
      av.classList.add('has-photo');
    };
    img.src = me.avatar;
  }

  const wgt = $('#about-widget');

  /* window controls */
  $('#aw-close').addEventListener('click', e => { e.stopPropagation(); wgt.hidden = true; });
  $('#aw-min').addEventListener('click',   e => { e.stopPropagation(); wgt.classList.toggle('collapsed'); });
  $('#aw-zoom').addEventListener('click',  e => { e.stopPropagation(); wgt.classList.toggle('zoomed'); });

  /* draggable — but never steal a click meant for a link or a control */
  wgt.addEventListener('pointerdown', e => {
    if (e.target.closest('a, button') || window.innerWidth <= 860 || e.button !== 0) return;
    const r = wgt.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    wgt.classList.add('dragging');
    wgt.style.left = r.left + 'px'; wgt.style.top = r.top + 'px';
    wgt.setPointerCapture(e.pointerId);
    const move = ev => {
      wgt.style.left = Math.max(6, Math.min(window.innerWidth  - r.width  - 6, r.left + ev.clientX - sx)) + 'px';
      wgt.style.top  = Math.max(30, Math.min(window.innerHeight - r.height - 6, r.top  + ev.clientY - sy)) + 'px';
    };
    const up = () => {
      wgt.classList.remove('dragging');
      wgt.removeEventListener('pointermove', move);
      wgt.removeEventListener('pointerup', up);
    };
    wgt.addEventListener('pointermove', move);
    wgt.addEventListener('pointerup', up);
  });
}

/* ===================== 9. SPOTLIGHT SEARCH ===================== *
 * Everything on the site lives in CONFIG, which is already in the browser,
 * so the whole index is built client-side — no server needed.
 * ---------------------------------------------------------------- */
function buildIndex () {
  const ix = [];
  const push = (title, sub, icon, text, act) =>
    ix.push({ title, sub, icon, text: (title + ' ' + sub + ' ' + text).toLowerCase(), act });

  CONFIG.folders.forEach(f => {
    push(f.name, 'Folder', 'folder', (f.files || []).map(x => x.name).join(' '), () => openFolder(f));
    (f.files || []).forEach(file =>
      push(file.name, f.name, iconForKind(file.kind),
           (file.body || []).join(' ') + ' ' + (file.note || '') + ' ' + (file.url || ''),
           () => openFile(file)));
  });
  (CONFIG.desktopFiles || []).forEach(file =>
    push(file.name, 'Desktop', iconForKind(file.kind), file.url || '', () => openFile(file)));

  push(CONFIG.email.address, 'Email address', 'mail',
       'email contact mail reach hello ' + [].concat(CONFIG.me.bio).join(' '), openEmail);
  push(CONFIG.notesApp.todo.title, 'Notes', 'notes',
       (CONFIG.notesApp.todo.items || []).join(' ') + ' todo tasks list', () => openNotes('todo'));
  push(CONFIG.notesApp.guestbook.title, 'Notes', 'notes',
       'guestbook leave a note message comment say hi', () => openNotes('guest'));
  push('Photos', 'Gallery', 'photos',
       (CONFIG.photos || []).map(p => p.caption || '').join(' '), openPhotos);
  return ix;
}

const SL = { el: $('#spotlight'), input: $('#sl-input'), list: $('#sl-results'),
             index: [], hits: [], sel: 0 };

function slRank (q) {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return SL.index
    .map(it => {
      const title = it.title.toLowerCase();
      let score = 0;
      if (title === t) score = 100;
      else if (title.startsWith(t)) score = 80;
      else if (title.includes(t)) score = 60;
      else if (it.text.includes(t)) score = 30;
      return score ? { it, score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.it.title.localeCompare(b.it.title))
    .slice(0, 8)
    .map(r => r.it);
}

function slRender () {
  const q = SL.input.value;
  SL.hits = slRank(q);
  SL.sel = 0;
  if (!q.trim()) { SL.list.innerHTML = ''; return; }
  if (!SL.hits.length) {
    SL.list.innerHTML = `<li class="sl-empty">No results for “${esc(q.trim())}”</li>`;
    return;
  }
  SL.list.innerHTML = SL.hits.map((h, i) =>
    `<li class="${i === 0 ? 'on' : ''}"><button data-i="${i}">${svg(h.icon)}
       <span class="sl-row"><span class="sl-title">${esc(h.title)}</span>
       <span class="sl-sub">${esc(h.sub)}</span></span></button></li>`).join('');
  $$('#sl-results button').forEach(b =>
    b.addEventListener('click', () => slRun(+b.dataset.i)));
}

function slMove (d) {
  if (!SL.hits.length) return;
  SL.sel = (SL.sel + d + SL.hits.length) % SL.hits.length;
  $$('#sl-results li').forEach((li, i) => li.classList.toggle('on', i === SL.sel));
  const on = $('#sl-results li.on');
  on && on.scrollIntoView({ block: 'nearest' });
}

function slRun (i) {
  const hit = SL.hits[i != null ? i : SL.sel];
  if (!hit) return;
  slClose();
  hit.act();
}

function slOpen () {
  if (!SL.index.length) SL.index = buildIndex();
  SL.el.hidden = false;
  SL.input.value = '';
  SL.list.innerHTML = '';
  SL.input.focus();
}
function slClose () { SL.el.hidden = true; SL.input.blur(); }

$('#btn-search').addEventListener('click', e => { e.stopPropagation(); slOpen(); });
SL.input.addEventListener('input', slRender);
SL.el.addEventListener('pointerdown', e => { if (e.target === SL.el) slClose(); });
SL.input.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); slMove(1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); slMove(-1); }
  else if (e.key === 'Enter') { e.preventDefault(); slRun(); }
  else if (e.key === 'Escape') { e.preventDefault(); slClose(); }
});

/* ===================== 10. BOOT ===================== */
hydrateWidget();
buildDesktopIcons();
buildDock();

/* deep links: saleha.com/#email, /#projects, ... */
function routeHash () {
  const h = decodeURIComponent(location.hash.replace(/^#/, '')).toLowerCase();
  if (!h) return;
  const routes = {
    email: openEmail, contact: openEmail,
    notes: openNotes, photos: openPhotos,
    guestbook: () => openNotes('guest'), todo: () => openNotes('todo')
  };
  if (routes[h]) return routes[h]();
  const f = CONFIG.folders.find(x => x.id.toLowerCase() === h);
  if (f) openFolder(f);
}
routeHash();
addEventListener('hashchange', routeHash);

/* first-visit hint on small screens */
if (window.innerWidth <= 860) {
  const hint = $('#rotate-hint');
  hint.style.display = 'flex';
  $('#rotate-dismiss').addEventListener('click', () => (hint.style.display = 'none'));
}

/* keep windows on-screen when the viewport shrinks */
addEventListener('resize', () => {
  $$('.win').forEach(w => {
    w.style.left = Math.min(w.offsetLeft, Math.max(0, window.innerWidth  - 90)) + 'px';
    w.style.top  = Math.min(w.offsetTop,  Math.max(26, window.innerHeight - 44)) + 'px';
  });
});

})();
