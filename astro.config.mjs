// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { imageService } from '@unpic/astro/service'; // Corrected import
import tailwindcss from '@tailwindcss/vite';
  

// https://astro.build/config
export default defineConfig({
  site: "https://website-cui-labs-salon.pages.dev",
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
    react({
      experimentalReactChildren: true,
      include: ['**/react/*'],
    })
  ],
  vite: {
    optimizeDeps: {  
      include: ['simple-parallax-js']  
    } ,
    plugins: [
      tailwindcss()
    ]
  },
  image: {
    service: imageService()
  }
});