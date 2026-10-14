import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://small.andronasef.com',
  base: '/',
  trailingSlash: 'never',
  build: {
    format: 'file'
  }
});
