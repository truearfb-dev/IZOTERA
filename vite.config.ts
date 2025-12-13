import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Check multiple possible variable names. 
  // Priority: VITE_GEMINI_API_KEY (from your screenshot) -> API_KEY (fallback)
  const apiKey = env.VITE_GEMINI_API_KEY || env.API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});