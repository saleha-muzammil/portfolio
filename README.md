# Saleha's Desktop

A personal site laid out like a macOS desktop — draggable windows, a dock, a Finder,
and a floating about-me card. No build step, no dependencies, no framework.

## Run it

Just open `index.html` in a browser. That's it.

For a local server (nicer for testing the PDF viewer):

    python3 -m http.server 8000     # then visit http://localhost:8000

## Editing content

**Everything you'd want to change lives in [`js/config.js`](js/config.js).**
You should never need to touch `app.js` or `style.css` to update the site.

| Section in config.js | What it controls |
|---|---|
| `me` | Name, role, status line, bio, avatar — the floating card |
| `email` | The address revealed by the Mail icon, and its blurb |
| `links` | GitHub / LinkedIn URLs used by the dock |
| `folders` | Desktop folders and their contents |
| `desktopFiles` | Loose files on the desktop (e.g. Resume.pdf) |
| `notesApp` | The to-do list and the visitor guestbook |
| `photos` | Images shown in the Photos window |

### Adding a folder

```js
folders: [
  {
    id: "talks",              // used for the #talks deep link — keep it lowercase
    name: "Talks",
    files: [
      { name: "My Talk", kind: "doc",  body: ["First paragraph.", "Second paragraph."] },
      { name: "Slides",  kind: "link", url: "https://..." },
      { name: "Paper",   kind: "pdf",  url: "assets/paper.pdf" },
    ],
  },
]
```

Three file kinds: `doc` (opens a text window), `link` (opens a new tab), `pdf` (opens
an embedded viewer). A missing PDF shows a friendly placeholder instead of a 404.

## The Notes app

Notes holds two files:

**To-do** — your list. Tick, add and delete items right in the page. Changes are kept
in `localStorage`, so they persist in *your* browser but aren't published to visitors.
The starting items come from `notesApp.todo.items` in `config.js`.

**Leave me a note** — an anonymous guestbook. No name field: every note is posted as
Anonymous, and the note itself says so. There's no Send button either — press Enter to
post, Shift-Enter for a new line.

### Making the guestbook actually persist

A static site can't store anything by itself, so out of the box the guestbook runs in
`local` mode: notes save to the visitor's own browser and **never reach you**. The page
says so plainly. To make it real, pick one and set `notesApp.guestbook.backend`:

#### Option A — Formspree (easiest; notes are emailed to you)

1. Sign up at [formspree.io](https://formspree.io) and create a form.
2. Copy the endpoint it gives you (`https://formspree.io/f/abcdwxyz`).
3. In `js/config.js`:

```js
backend: "formspree",
formspree: { endpoint: "https://formspree.io/f/abcdwxyz" },
```

Free tier is 50 submissions/month. Notes go to your inbox and are not shown on the page.

#### Option B — Supabase (a real guestbook; notes appear on the page for everyone)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run:

```sql
create table notes (
  id   bigint generated always as identity primary key,
  name text,
  body text not null,
  at   timestamptz default now()
);
alter table notes enable row level security;
create policy "public read"   on notes for select using (true);
create policy "public insert" on notes for insert with check (true);
```

3. Settings → API, copy the Project URL and the **anon/public** key.
4. In `js/config.js`:

```js
backend: "supabase",
supabase: { url: "https://xxxx.supabase.co", anonKey: "eyJ...", table: "notes" },
```

The anon key is designed to be public — it's safe in client-side code, and the row-level
security policies above are what actually control access.

**Worth knowing:** those policies let anyone insert, so the guestbook is open to spam.
For a personal site that's usually fine, but you can tighten it later — add a length
check in the policy, put Cloudflare Turnstile in front, or drop the public-read policy
so notes are private to you and you read them in the Supabase dashboard.

### Using real Apple icons

The site ships with hand-drawn SVG icons (Finder, Mail, Notes, Photos, folders …)
so it works with no image files at all. To swap in real ones, drop square PNGs into
`assets/icons/` and uncomment the matching lines under `icons` in `js/config.js`:

```js
icons: {
  finder: "assets/icons/finder.png",
  mail:   "assets/icons/mail.png",
},
```

Any id you leave out keeps its built-in SVG, so you can override just one.

### Changing the wallpaper

The shipped wallpaper is `assets/wallpaper.svg` (vector, so it stays sharp at any size).
To use your own image instead, just save it as **`assets/wallpaper.jpg`** — the CSS
prefers it automatically and falls back to the SVG if it isn't there. No code change.

### Adding your photo

Save a square image as **`assets/me.jpg`** — it's already wired up. Until the file
exists the circle shows your initials, so nothing looks broken while it's missing.

### Writing your bio

`me.bio` is a list — one string per paragraph. Write plainly; no brackets, no markup.

Links live separately in `me.bioLinks`. Any phrase you list there is turned into a
link wherever it appears in the bio:

```js
bio: [
  "I am a performative aura farmer on ig.",
],
bioLinks: {
  "performative aura farmer on ig": "https://instagram.com/...",
},
```

The bio text is escaped before linking, so apostrophes and brackets in your writing
can't break the page. Links open in a new tab.

## Things it does

- **Windows** — drag by the title bar, resize from the bottom-right corner, and the
  traffic lights close / minimise / zoom. Click to bring to front.
- **The about card** — floats and bobs; drag it anywhere on the desktop.
- **Email icon** — opens a window with the address and a one-click copy button.
- **Dock** — magnifies under the cursor; a dot marks open windows.
- **Menu bar** — the Apple menu, File, Go etc. all open working dropdowns. The clock
  reads the visitor's own system time and re-checks every 10s, so the date rolls over
  by itself — nothing to maintain.
- **Search** — the magnifier (or `⌘K`, or just `/`) opens a Spotlight panel that
  searches folders, file names, file contents, your bio and your email. The index is
  built from `config.js` in the browser, so it needs no server and updates itself
  whenever you edit your content. Arrow keys to move, Enter to open, Esc to close.
- **Right-click the desktop** for a context menu. `Esc` closes the top window.
  `⌘E` opens email.
- **Deep links** — `#email`, `#notes`, `#todo`, `#guestbook`, `#photos`, or any folder
  id (`#projects`). Handy for sending someone straight to a specific window.
- **Mobile** — the desktop collapses to a scrollable grid; single tap opens things.

## Deploying

This folder *is* the `saleha-muzammil/portfolio` repo, and the site is plain static
files at its root — no build step. To publish:

```bash
git add -A
git commit -m "Replace React portfolio with desktop site"
git push
```

Then on GitHub: **Settings → Pages → Source: deploy from branch `main`, folder `/ (root)`**.
The `.nojekyll` file is there so Pages serves the folders as-is.

The old React portfolio is still in this repo's history — nothing was lost. To get a
file back: `git checkout HEAD~1 -- src/Assets/art` (or browse it on GitHub).

## Layout of the code

    index.html         markup + the hand-drawn SVG icon sprite
    css/style.css      all styling
    js/config.js       >>> your content — edit this one <<<
    js/app.js          window manager, dock, drag/resize, menus
    assets/            photo, CV, papers, wallpaper
    assets/art/        the 13 art pieces
    assets/art/thumbs/ small JPEGs used for the Finder grid
