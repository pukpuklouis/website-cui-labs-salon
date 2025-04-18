// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { imageService } from '@unpic/astro/service'; // Corrected import
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
site: "http://localhost:4321";
export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [
    partytown({ 
      config: { 
        debug: true, 
        forward: ['dataLayer.push'] } }),
    sitemap(),
    react()
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