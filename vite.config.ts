import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // When DISABLE_HMR is set by the agent environment, disable HMR and file
  // watching to prevent flickering during automated edits. Regular local
  // development keeps HMR enabled.
  const disableHmr = process.env.DISABLE_HMR === 'true';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      allowedHosts: ['.monkeycode-ai.live'],
      hmr: !disableHmr,
      watch: disableHmr ? null : {},
    },
  };
});
