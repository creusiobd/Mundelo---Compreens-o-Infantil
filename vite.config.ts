import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ command }) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(command === 'build'
        ? [
            {
              name: 'exclude-security-lab-in-prod',
              enforce: 'pre' as const,
              resolveId(id: string) {
                if (id.includes('SecurityLabScreen')) {
                  return '\0virtual:empty-security-lab';
                }
                return null;
              },
              load(id: string) {
                if (id === '\0virtual:empty-security-lab') {
                  return 'export const SecurityLabScreen = () => null;';
                }
                return null;
              },
            },
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
