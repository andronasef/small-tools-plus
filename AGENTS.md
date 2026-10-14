# AGENTS.md — Developer & AI Agent Context Guide

> **To any AI agent or developer continuing this project:**  
> Read this document carefully before making changes. It outlines the architectural foundations, core constraints, invariants, and guidelines for `small-tools-plus`.

---

## 1. Project Overview & Philosophy

- **Name:** Small Tools Plus (`small.andronasef.com`)
- **Repository:** `https://github.com/andronasef/small-tools-plus`
- **Domain:** `small.andronasef.com` (managed via `CNAME` for GitHub Pages).
- **Core Principle:** **Zero-backend, 100% client-side, offline-first.**
- **Tool Architecture:** Built with **Astro** SSG (Static Site Generator) using Bun. Tools are native `.astro` pages in `src/pages/tools/` compiled down to self-contained HTML pages in `dist/tools/`.
- **Package Manager / Tooling Rule:** **Always use Bun** (`bun`) for package management, local development (`bun dev`), building (`bun run build`), and previewing (`bun run preview`). Never use npm/yarn/pnpm unless explicitly instructed by the user.

---

## 2. Architecture & File Layout

```text
small-tools-plus/
├── .github/workflows/deploy.yml  # Automated GitHub Actions deployment with Bun & Astro
├── astro.config.mjs              # Astro configuration (site: small.andronasef.com, format: file)
├── AGENTS.md                     # This handover document
├── package.json                  # Scripts & dependencies (astro@7.3.8)
├── public/                       # Static public assets (copied directly to dist/)
│   ├── CNAME                     # GitHub Pages custom domain (small.andronasef.com)
│   ├── style.css                 # Unified Design System tokens & global dark theme
│   ├── icons/                    # App-level PNGs (192, 512, maskable) & Lucide tool SVGs/PNGs
│   └── workout-media/            # Local MP4 videos and GIFs (pre-cached for offline use)
├── src/
│   ├── data/
│   │   └── tools.ts              # Single Source of Truth for all tools catalog metadata
│   └── pages/
│       ├── index.astro           # Dynamic central dashboard & catalog
│       ├── manifest.webmanifest.ts   # Dynamic Master PWA manifest generator
│       ├── [manifest].webmanifest.ts # Dynamic Standalone PWA manifest generator for mobile tools
│       ├── sw.js.ts              # Dynamic Service Worker generator (precache list + HTTP 206)
│       └── tools/                # Native Astro tool pages
│           ├── daily-workout.astro
│           ├── feelings-wheel-ar.astro
│           ├── interactive_week_month_calendar.astro
│           ├── notion-copy-helper.astro
│           ├── sleep-calculator.astro
│           ├── store-localizer.astro
│           └── tithe-forever.astro
└── dist/                         # Compiled static output deployed to GitHub Pages
```

---

## 3. Key Components & How They Work

### A. Single Source of Truth (`src/data/tools.ts`)
- All tools metadata is centralized here: `id`, `title`, `titleAr`, `description`, `category`, `icon`, `mobile`, `tags`, etc.
- When you add a new tool or edit flags (e.g. enabling standalone mobile PWA), you update **only** this file!
- The dashboard, master manifest, standalone manifests, and Service Worker precache list are all generated automatically from this single file during build time.

### B. Dynamic Astro Endpoints
- **Master Manifest (`src/pages/manifest.webmanifest.ts`):** Emits `dist/manifest.webmanifest` with shortcuts dynamically mapped to all tools.
- **Standalone Mobile Manifests (`src/pages/[manifest].webmanifest.ts`):** Uses Astro `getStaticPaths()` to generate standalone manifests (`dist/manifest-calendar.webmanifest`, `manifest-feelings.webmanifest`, `manifest-workout.webmanifest`, `manifest-tithe.webmanifest`) for tools with `mobile: true`.
- **Dynamic Service Worker (`src/pages/sw.js.ts`):** Emits `dist/sw.js` with:
  - Cache name versioning derived from asset checksums/timestamp.
  - Automatic `PRECACHE_MANIFEST` collecting all tool HTML files, icons (SVGs & PNGs), workout media, and Google/FontAwesome CDN links.
  - **HTTP 206 Partial Content Logic:** Implements manual ArrayBuffer slicing for HTML5 `<video>` range requests (`Range: bytes=...`). Critical for offline video playback on iOS WebKit and Blink. **Never remove this logic.**

### C. The Dashboard (`src/pages/index.astro`)
- Dynamically iterates over `TOOLS` from `src/data/tools.ts`.
- **Search & Filtering:** Real-time client-side search across tool titles, filenames, and tags, plus category pills (including a dedicated `📱 Mobile` tab).
- **Live Preview Workbench:** An embedded `<iframe>` drawer allowing users to preview and test tools inline without navigating away.
- **Keyboard Shortcuts:** `1`–`9` to open tools, `/` to focus filter, `D` for dark/light toggle, `Esc` to close preview/modal.
- **PWA Installation:** Master app installation prompt + standalone install triggers for mobile-ready tools.
- **Offline Cache Manager:** Provides a one-click button that dynamically fetches all remote resources and caches them into Cache Storage with real-time progress feedback.

### D. Standalone Mobile PWA Tools
- Tools flagged with `mobile: true` in `src/data/tools.ts` have their own `<link rel="manifest" href="/manifest-[id].webmanifest">` and a mobile install button (`#pwaInstallToolBtn`) inside the tool itself.
- Users can install the specific tool directly to their phone's home screen as an independent app without installing the entire dashboard.
- Currently enabled mobile tools:
  1. WeekTrack Calendar (`interactive_week_month_calendar`)
  2. عجلة المشاعر العربية (`feelings-wheel-ar`)
  3. DevFit Workout Guide (`daily-workout`)
  4. Tithe Forever (`tithe-forever`)
  5. Sleep Cycle Calculator (`sleep-calculator`)

---

## 4. Invariants & Guardrails (DO NOT BREAK)

1. **Maintain 100% Offline Capability:**
   - Tools must function with the network turned off.
   - Any new media or assets should be placed in `public/` and referenced in `src/data/tools.ts` or `src/pages/sw.js.ts`.

2. **Standalone Navigation Safety:**
   - In standalone PWA mode, the browser address bar is hidden. Every individual tool page **MUST** have a top return link back to `/` (`← All Tools` / `← الأدوات`).

3. **No Redundant Static Files in `public/tools/`:**
   - Do **NOT** put `.html` files in `public/tools/`. Tool pages live exclusively in `src/pages/tools/*.astro`. Astro compiles them to `dist/tools/*.html`. Putting HTML files in `public/tools/` will cause Astro to skip building the `.astro` pages.

4. **Script & Style Inlining in Astro:**
   - Tool pages use interactive vanilla JavaScript and custom CSS. Always use `<script is:inline>` and `<style is:inline>` to preserve inline onclick handlers and prevent Rollup scoping collisions.

5. **Icon Integrity:**
   - Strict rule: **Never handcraft or draw custom icons.** Use official Lucide SVGs placed in `public/icons/`.

6. **Dark Mode by Default & Unified Palette:**
   - Every tool must be **dark mode by default** (`<html class="dark">`).
   - All tools and dashboard must link to and utilize the shared tokens from `/style.css` (`--stp-canvas`, `--stp-surface`, `--stp-border-subtle`, `--stp-text-primary`, `--stp-text-secondary`, etc.).
   - Standard navigation back links must use the `.stp-nav-back` class.

---

## 5. Development & CI/CD Commands

All commands use **Bun**:

```bash
# Start local Astro development server
bun dev

# Build static production bundle into dist/
bun run build

# Preview the built dist/ locally
bun run preview

# Or serve dist with bun serve
bun x serve dist

# Check git status
git status -s
```

### GitHub Actions Deployment
- Configured in `.github/workflows/deploy.yml`.
- Automatically triggers on `push` to `master`.
- Uses `oven-sh/setup-bun@v2`, runs `bun run build`, and deploys `dist/` directly to GitHub Pages for `small.andronasef.com`.
