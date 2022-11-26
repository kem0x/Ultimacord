import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // minify: true
  },
  plugins: [
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        name: 'Ultimacord',
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'notYetMan',
        match: ['*://*.discord.com/*'],
        "run-at": "document-start",
        grant: [
          "unsafeWindow"
        ]
      },
    }),
  ],
});
