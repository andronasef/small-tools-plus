import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { tools } from '../tools.config.js';

const ROOT_DIR = path.resolve('.');
const ICONS_DIR = path.join(ROOT_DIR, 'icons');
const WORKOUT_DIR = path.join(ROOT_DIR, 'workout-media');

console.log('🔄 [Sync] Starting Small Tools Plus automation build...');

// 1. Generate Dedicated Tool Manifests for Mobile-Ready Tools
for (const tool of tools) {
  if (!tool.mobile) continue;

  const manifestName = tool.manifest || `manifest-${tool.id}.webmanifest`;
  const manifestData = {
    id: `small-tools-${tool.id}`,
    name: tool.title,
    short_name: tool.shortTitle || tool.title,
    description: tool.description,
    start_url: `./${tool.file}`,
    scope: `./${tool.file}`,
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
    orientation: 'any',
    background_color: tool.accentColor.startsWith('#') ? tool.accentColor : '#0a0a0c',
    theme_color: tool.accentColor,
    lang: tool.lang || 'en',
    dir: tool.dir || 'ltr',
    categories: [tool.category.toLowerCase(), 'utilities'],
    icons: [
      {
        src: `icons/tool-${tool.id}.svg`,
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: `icons/tool-${tool.id}-192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: `icons/tool-${tool.id}-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  };

  fs.writeFileSync(
    path.join(ROOT_DIR, manifestName),
    JSON.stringify(manifestData, null, 2),
    'utf8'
  );
  console.log(`  ✓ Generated standalone manifest: ${manifestName}`);

  // Render 192 and 512 PNGs for this mobile tool
  const svgPath = path.join(ICONS_DIR, `tool-${tool.id}.svg`);
  if (fs.existsSync(svgPath)) {
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // 512x512
    const r512 = new Resvg(svgContent, { fitTo: { mode: 'width', value: 512 } });
    fs.writeFileSync(path.join(ICONS_DIR, `tool-${tool.id}-512.png`), r512.render().asPng());
    
    // 192x192
    const r192 = new Resvg(svgContent, { fitTo: { mode: 'width', value: 192 } });
    fs.writeFileSync(path.join(ICONS_DIR, `tool-${tool.id}-192.png`), r192.render().asPng());
    
    console.log(`  ✓ Rendered PNG icons for mobile tool: tool-${tool.id}`);
  }
}

// 2. Generate Master App Manifest (manifest.webmanifest)
const masterShortcuts = tools.map(tool => ({
  name: tool.title,
  short_name: tool.shortTitle || tool.title,
  description: tool.description,
  url: `./${tool.file}`,
  icons: [{ src: `icons/tool-${tool.id}.svg`, sizes: 'any', type: 'image/svg+xml' }]
}));

const masterManifest = {
  id: 'small-tools-plus',
  name: 'Small Tools Plus',
  short_name: 'SmallTools+',
  description: 'Standalone offline-first personal web utilities, calculators, and productivity tools.',
  start_url: './index.html',
  scope: './',
  display: 'standalone',
  display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
  orientation: 'any',
  background_color: '#0a0a0c',
  theme_color: '#101014',
  lang: 'en',
  dir: 'auto',
  categories: ['utilities', 'productivity', 'health', 'lifestyle'],
  icons: [
    {
      src: 'icons/icon.svg',
      sizes: 'any',
      type: 'image/svg+xml',
      purpose: 'any'
    },
    {
      src: 'icons/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: 'icons/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: 'icons/icon-maskable-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable'
    }
  ],
  shortcuts: masterShortcuts
};

fs.writeFileSync(
  path.join(ROOT_DIR, 'manifest.webmanifest'),
  JSON.stringify(masterManifest, null, 2),
  'utf8'
);
console.log('  ✓ Updated master manifest: manifest.webmanifest');

// 3. Collect all local and remote assets for Service Worker and Downloader
const localFiles = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

for (const tool of tools) {
  localFiles.push(`./${tool.file}`);
  localFiles.push(`./icons/tool-${tool.id}.svg`);
  if (tool.mobile) {
    localFiles.push(`./${tool.manifest || `manifest-${tool.id}.webmanifest`}`);
    localFiles.push(`./icons/tool-${tool.id}-192.png`);
    localFiles.push(`./icons/tool-${tool.id}-512.png`);
  }
}

if (fs.existsSync(WORKOUT_DIR)) {
  const mediaFiles = fs.readdirSync(WORKOUT_DIR);
  for (const f of mediaFiles) {
    if (!f.startsWith('.')) {
      localFiles.push(`./workout-media/${f}`);
    }
  }
}

const remoteAssets = [
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap',
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400;600&family=IBM+Plex+Sans+Arabic:wght@300;400;500&display=swap'
];

const allPrecacheAssets = Array.from(new Set([...localFiles, ...remoteAssets]));

// 4. Generate sw.js dynamically
const cacheVersion = `small-tools-plus-v${Date.now().toString(36)}`;

const swContent = `/*
  Small Tools Plus — Service Worker (Auto-generated by build system)
  Provides complete offline capabilities, PWA support,
  HTTP Range handling for videos, and aggressive asset precaching.
*/

const CACHE_NAME = '${cacheVersion}';

const PRECACHE_MANIFEST = ${JSON.stringify(allPrecacheAssets, null, 2)};

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of PRECACHE_MANIFEST) {
        try {
          const req = new Request(url, {
            mode: url.startsWith('http') && !url.includes(self.location.hostname) ? 'no-cors' : 'cors'
          });
          const res = await fetch(req);
          if (res) {
            await cache.put(url, res);
          }
        } catch (err) {
          console.warn('[SW] Could not precache:', url, err);
        }
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => {
        return Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        );
      })
    ])
  );
});

async function handleRangeRequest(request) {
  const rangeHeader = request.headers.get('range');
  const cache = await caches.open(CACHE_NAME);
  let cachedResponse = await cache.match(request.url);

  if (!cachedResponse) {
    try {
      const netRes = await fetch(request);
      return netRes;
    } catch (err) {
      return new Response('Media unavailable offline', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }

  if (!rangeHeader) {
    return cachedResponse;
  }

  const arrayBuffer = await cachedResponse.arrayBuffer();
  const totalLength = arrayBuffer.byteLength;
  const matches = rangeHeader.match(/bytes=(\\d+)-(\\d*)/);

  if (!matches) {
    return cachedResponse;
  }

  const start = parseInt(matches[1], 10);
  const end = matches[2] ? parseInt(matches[2], 10) : totalLength - 1;

  if (start >= totalLength || end >= totalLength) {
    return new Response('', {
      status: 416,
      statusText: 'Range Not Satisfiable',
      headers: {
        'Content-Range': \`bytes */\${totalLength}\`
      }
    });
  }

  const sliced = arrayBuffer.slice(start, end + 1);
  const headers = new Headers(cachedResponse.headers);
  headers.set('Content-Range', \`bytes \${start}-\${end}/\${totalLength}\`);
  headers.set('Content-Length', String(sliced.byteLength));
  headers.set('Accept-Ranges', 'bytes');
  if (!headers.get('Content-Type')) {
    headers.set('Content-Type', request.url.endsWith('.mp4') ? 'video/mp4' : 'application/octet-stream');
  }

  return new Response(sliced, {
    status: 206,
    statusText: 'Partial Content',
    headers
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  if (request.headers.get('range') || request.url.match(/\\.(mp4|webm|ogg|mp3|wav)($|\\?)/i)) {
    event.respondWith(handleRangeRequest(request));
    return;
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(request, { ignoreSearch: false });
      if (cached) {
        return cached;
      }

      const cleanUrl = request.url.split('?')[0];
      if (cleanUrl !== request.url) {
        const cachedClean = await caches.match(cleanUrl);
        if (cachedClean) return cachedClean;
      }

      try {
        const netResponse = await fetch(request);
        if (netResponse && (netResponse.status === 200 || netResponse.status === 0)) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, netResponse.clone()).catch(() => {});
        }
        return netResponse;
      } catch (err) {
        if (request.mode === 'navigate') {
          const fallback = await caches.match('./index.html');
          if (fallback) return fallback;
        }
        throw err;
      }
    })()
  );
});

self.addEventListener('message', (event) => {
  const { data } = event;
  if (data && data.action === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (data && data.action === 'CACHE_ALL_ASSETS') {
    event.waitUntil(
      (async () => {
        const client = event.source;
        const cache = await caches.open(CACHE_NAME);
        const list = Array.from(new Set([...PRECACHE_MANIFEST, ...(data.extraUrls || [])]));
        let completed = 0;
        const total = list.length;

        for (const url of list) {
          try {
            const req = new Request(url, {
              mode: url.startsWith('http') && !url.includes(self.location.hostname) ? 'no-cors' : 'cors'
            });
            const res = await fetch(req);
            if (res) {
              await cache.put(url, res);
            }
          } catch (e) {
            console.warn('[SW Download] Failed url:', url, e);
          }
          completed++;
          if (client && client.postMessage) {
            client.postMessage({
              type: 'CACHE_PROGRESS',
              current: completed,
              total,
              url,
              done: completed === total
            });
          }
        }
      })()
    );
  }
});
`;

fs.writeFileSync(path.join(ROOT_DIR, 'sw.js'), swContent, 'utf8');
console.log(`  ✓ Generated sw.js (${cacheVersion}) with ${allPrecacheAssets.length} precached assets`);

// 5. Update index.html CORE_ASSETS
let indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const assetsReplacement = `const CORE_ASSETS = ${JSON.stringify(allPrecacheAssets, null, 6)};`;
indexHtml = indexHtml.replace(/const CORE_ASSETS = \[[\s\S]*?\];/, assetsReplacement);
fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), indexHtml, 'utf8');
console.log('  ✓ Updated index.html CORE_ASSETS list for offline downloader');

console.log('🎉 [Sync] Automation build completed successfully!');
