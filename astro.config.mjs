// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { imageService } from '@unpic/astro/service'; // Corrected import
import tailwindcss from '@tailwindcss/vite';

// Markdown plugins
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import remarkToc from 'remark-toc';
  

// https://astro.build/config
export default defineConfig({
  site: "https://www.labcui.com",
  adapter: cloudflare({
    platformProxy: {
      mode: 'directory',
      functionPerRoute: true,
      runtime: {
        mode: 'local',
        type: 'pages',
        bindings: {
          // Add any environment variables your app needs
        }
      },
      enabled: true
    },
    // Add compatibility flags for MessageChannel
    compatibility: {
      flags: ["nodejs_compat"]
    }
  }),
  markdown: {
    gfm: true,
    smartypants: true,
    toc: true,
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'append' }],
      [rehypeExternalLinks, { target: '_blank', rel: ['nofollow', 'noopener', 'noreferrer'] }]
    ],
    remarkPlugins: [
      remarkGfm,
      remarkSmartypants,
      [remarkToc, { heading: 'contents', tight: true }]
    ]
  },
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
        plugins: [
          tailwindcss()
        ],
        optimizeDeps: {  
          include: ['simple-parallax-js']  
        },
    resolve: {
      // 只在 production 時 alias
      alias: import.meta.env.PROD && {
        "react-dom/server": "react-dom/server.edge",
      },
    },
  },
  image: {
    service: imageService()
  }
});