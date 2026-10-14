import type { APIRoute } from 'astro';
import { tools } from '../data/tools';

export const prerender = true;

export const GET: APIRoute = async () => {
  const shortcuts = tools.map((tool) => ({
    name: tool.title,
    short_name: tool.shortTitle || tool.title,
    description: tool.description,
    url: `./${tool.file}`,
    icons: [{ src: `icons/${tool.iconFile}`, sizes: 'any', type: 'image/svg+xml' }]
  }));

  const manifest = {
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
    shortcuts
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8'
    }
  });
};
