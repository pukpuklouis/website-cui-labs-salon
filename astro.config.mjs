// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import { imageService } from '@unpic/astro/service'; // Corrected import
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [ 
    partytown(), 
    sitemap()
  ],
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  image: {
    service: imageService()
  }
}); 