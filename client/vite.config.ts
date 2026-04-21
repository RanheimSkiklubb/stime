import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    envPrefix: ['REACT_APP_', 'VITE_'],
    build: {
        outDir: 'build',
    },
    server: {
        port: 3000,
        open: true,
    },
});
