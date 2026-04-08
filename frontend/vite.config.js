// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
    
//     hmr: {
//       overlay: false, // optional, for suppressing overlay
//     },
//   },
//   css: {
//     devSourcemap: true, // ✅ required by Tailwind v4
//   },
// });







import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // ✅ allows access from other devices (phone)
    port: 5173,   // optional, default is 5173
    hmr: {
      overlay: false, // optional, disable red error overlay
    },
  },
  css: {
    devSourcemap: true, // ✅ required by Tailwind v4
  },
})

