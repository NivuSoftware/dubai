import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'public-images-full-reload',
      configureServer(server) {
        const publicDir = path.resolve(__dirname, 'public') + path.sep;
        const imagePattern = /\.(avif|gif|ico|jpe?g|png|svg|webp)$/i;

        const triggerReload = (file: string) => {
          if (!file.startsWith(publicDir) || !imagePattern.test(file)) {
            return;
          }

          server.ws.send({ type: 'full-reload', path: '*' });
        };

        server.watcher.on('add', triggerReload);
        server.watcher.on('change', triggerReload);
        server.watcher.on('unlink', triggerReload);
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});
