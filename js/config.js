/* =========================================================================
   EDIT THIS FILE — it holds every piece of content on the site.
   Nothing else needs touching to change text, links, folders or files.
   ========================================================================= */

const CONFIG = {

  /* ---------- 1. YOU ---------------------------------------------------- */
  me: {
    name:     "Saleha",
    role:     "PhD student · University of Virginia",
    initials: "S",

    // Square-ish images look best (it's cropped to a circle).
    // If the file is missing, the circle falls back to your initials.
    avatar:   "assets/image.png",

    // One paragraph per line. Write plainly — no brackets, no markup.
    bio: [
      "Halo! I am Saleha. I am a second year PhD at University of Virginia, where I work on security of AI systems.",

      "My dream is to become a great aerial yogee and do yoga over the sea from a yacht someday. I am a performative aura farmer on ig.",

      "I also do art sometimes, heres my shabby ig where i made a post idk 10 years ago or something.",

      "I yap a lot, feel free to reach out if you want to yap about monet's art, history, gossip, food, the weather. In case youre not interested in any of those, then sure! we can talk about system security and AI!",
    ],

    // Each entry links the NEXT matching word in the bio, in order.
    // So the first "ig" below gets the first URL, the second "ig" the second.
    bioLinks: [
      { word: "ig", url: "https://www.instagram.com/saleha.mz/reels" },
      { word: "ig", url: "https://www.instagram.com/artbysaleha/" },
    ],
  },

  /* ---------- 2. EMAIL -------------------------------------------------- */
  // Clicking the Mail icon reveals this with a copy button.
  email: {
    address: "evz4sc@virginia.edu",
    note:    "The fastest way to reach me. I reply to most things within a day or two.",
  },

  /* ---------- 3. SOCIAL LINKS (dock, right-hand side) ------------------- */
  links: {
    github:   "https://github.com/saleha-muzammil",
    linkedin: "https://linkedin.com/in/",       // <- put your profile URL
  },

  /* ---------- 4. DESKTOP FOLDERS & FILES -------------------------------- *
   * Add / remove folders freely. Each folder opens a Finder window.
   *
   * A file can be one of:
   *   { name, kind:"doc",  body:["para", "para"] }        -> opens a text window
   *   { name, kind:"link", url:"https://..." }            -> opens in a new tab
   *   { name, kind:"pdf",  url:"assets/resume.pdf" }      -> opens the PDF
   * ---------------------------------------------------------------------- */
  folders: [
    {
      id: "inspiration",
      name: "inspirational-stuff",
      files: [
        { name: "Freetown Christiania.png", kind: "image", url: "assets/piece2.png",
          note: "Freetown Christiania — Copenhagen, Denmark" },

        { name: "Liberty Leading the People.png", kind: "image", url: "assets/piece1.png",
          note: "Eugène Delacroix, Liberty Leading the People (1830) — Musée du Louvre, Paris" },
      ],
    },
    {
      id: "art",
      name: "Art",
      files: [
        { name: "im1.png", kind: "image", url: "assets/art/im1.png",
          thumb: "assets/art/thumbs/im1.jpg" },
        { name: "im2.png", kind: "image", url: "assets/art/im2.png",
          thumb: "assets/art/thumbs/im2.jpg" },
        { name: "im3.png", kind: "image", url: "assets/art/im3.png",
          thumb: "assets/art/thumbs/im3.jpg" },
        { name: "im4.png", kind: "image", url: "assets/art/im4.png",
          thumb: "assets/art/thumbs/im4.jpg" },
        { name: "im5.png", kind: "image", url: "assets/art/im5.png",
          thumb: "assets/art/thumbs/im5.jpg" },
        { name: "im6.png", kind: "image", url: "assets/art/im6.png",
          thumb: "assets/art/thumbs/im6.jpg" },
        { name: "im7.png", kind: "image", url: "assets/art/im7.png",
          thumb: "assets/art/thumbs/im7.jpg" },
        { name: "im8.png", kind: "image", url: "assets/art/im8.png",
          thumb: "assets/art/thumbs/im8.jpg" },
        { name: "im9.png", kind: "image", url: "assets/art/im9.png",
          thumb: "assets/art/thumbs/im9.jpg" },
        { name: "im10.png", kind: "image", url: "assets/art/im10.png",
          thumb: "assets/art/thumbs/im10.jpg" },
        { name: "im11.png", kind: "image", url: "assets/art/im11.png",
          thumb: "assets/art/thumbs/im11.jpg" },
        { name: "im12.png", kind: "image", url: "assets/art/im12.png",
          thumb: "assets/art/thumbs/im12.jpg" },
        { name: "im13.png", kind: "image", url: "assets/art/im13.png",
          thumb: "assets/art/thumbs/im13.jpg" },
      ],
    },
    {
      id: "writing",
      name: "Writing",
      files: [
        { name: "Educative.txt", kind: "doc",
          body: [
            "About 5 years ago I used to write programming articles on Educative.",
            "They're still up if you want a look:",
          ],
          url: "https://www.educative.io/profile/view/6734745937641472" },
      ],
    },
    {
      id: "research",
      name: "Research",
      files: [
        { name: "Source Code Hotspots.pdf", kind: "pdf", url: "assets/software-hotspots.pdf",
          note: "Source Code Hotspots: A Diagnostic Method for Quality Issues — " +
                "Saleha Muzammil, Mughees Ur Rehman, Zoe Kotti, Diomidis Spinellis (2026)" },

        { name: "Small Language Models for SOC.pdf", kind: "pdf", url: "assets/threat-hunting.pdf",
          note: "Towards Small Language Models for Security Query Generation in SOC Workflows — " +
                "Saleha Muzammil*, Rahul Reddy*, Vishal Kamalakrishnan, Hadi Ahmadi, " +
                "Wajih Ul Hassan · arXiv:2512.06660" },

        { name: "MIRAGE.pdf", kind: "pdf", url: "assets/mirage.pdf",
          note: "Private Yet Accurate: A Decentralized Approach to System Intrusion Detection — " +
                "Jinghan Zhang*, Mati Ur Rehman*, Sharon Biju, Saleha Muzammil, " +
                "Wajih Ul Hassan · University of Virginia" },
      ],
    },
  ],

  /* ---------- 5. LOOSE DESKTOP FILES ------------------------------------ */
  desktopFiles: [
    { name: "Resume.pdf", kind: "pdf", url: "assets/saleha_muzammil.pdf" },
  ],

  /* ---------- 6. CUSTOM ICONS (optional) -------------------------------- *
   * The site ships with hand-drawn SVG icons that need no files. To use real
   * image files instead, drop them in assets/icons/ and name them here.
   * Any id you leave out keeps the built-in SVG. Use square PNGs (512px+).
   *   ids: folder finder mail notes photos safari doc pdf github linkedin
   * ---------------------------------------------------------------------- */
  icons: {
    // finder: "assets/icons/finder.png",
    // mail:   "assets/icons/mail.png",
    // notes:  "assets/icons/notes.png",
    // photos: "assets/icons/photos.png",
  },

  /* ---------- 7. NOTES APP --------------------------------------------- *
   * Two notes: your to-do list, and a pad where visitors leave you a note.
   * ---------------------------------------------------------------------- */
  notesApp: {

    todo: {
      title: "To-do",
      // Starting items. You can tick, add and delete them live in the browser;
      // your changes are remembered in YOUR browser (localStorage).
      items: [
        "Fill in the Projects folder",
        "Add my resume to assets/resume.pdf",
        "Swap in a real photo",
        "Pick a guestbook backend",
      ],
    },

    guestbook: {
      title:  "Leave me a note",
      intro:  "This is completely anonymous — I have no idea who writes what. " +
              "Say hi, leave feedback, or write absolute junk. All of it is welcome.",
      hint:   "Press Enter to post  ·  Shift-Enter for a new line",
      thanks: "Posted. Thank you.",

      /* ---- WHERE THE NOTES GO ------------------------------------------ *
       * "local"     works with zero setup, but notes stay in the visitor's
       *             own browser and never reach you. Fine for trying it out.
       * "formspree" notes are emailed to you. Easiest real option.
       * "supabase"  notes are saved to a database and shown on the page for
       *             everyone, like a real guestbook.
       * See README.md for the two-minute setup for each.
       * ------------------------------------------------------------------ */
      backend: "local",

      // backend: "formspree"  ->  paste your form endpoint here
      formspree: { endpoint: "" },

      // backend: "supabase"  ->  paste your project URL and anon (public) key
      supabase: { url: "", anonKey: "", table: "notes" },

      // Show the notes on the page? (supabase and local only; formspree emails them)
      showWall: true,
    },
  },

  /* ---------- 8. PHOTOS ------------------------------------------------- *
   * Drop images in assets/ and list them here. Leave empty to show a hint.  */
  photos: [
    // { src: "assets/photo1.jpg", caption: "Somewhere good" },
  ],
};
