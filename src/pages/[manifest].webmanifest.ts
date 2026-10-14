import type { APIRoute } from 'astro';
import { tools, type Tool } from '../data/tools';

export const prerender = true;

export function getStaticPaths() {
  return tools
    .filter((t) => t.mobile)
    .map((tool) => {
      const slug = (tool.manifest || `manifest-${tool.id}.webmanifest`).replace(/\.webmanifest$/, '');
      return {
        params: { manifest: slug },
        props: { tool }
      };
    });
}

export const GET: APIRoute = async ({ props }) => {
  const tool = props.tool as Tool;
  const iconBase = tool.iconFile.replace('.svg', '');

  const manifest = {
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
        src: `icons/${tool.iconFile}`,
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: `icons/${iconBase}-192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: `icons/${iconBase}-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8'
    }
  });
};
