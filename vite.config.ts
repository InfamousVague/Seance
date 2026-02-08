import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@wisp/ui": path.resolve(__dirname, "../Wisp/src"),
      "react-native": path.resolve(__dirname, "node_modules/react-native-web"),
      "react-native-svg": path.resolve(
        __dirname,
        "./src/shims/react-native-svg.tsx"
      ),
      // Force all React imports to use Seance's React (prevents duplicate React issue with Wisp)
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
    extensions: [".web.tsx", ".web.ts", ".web.js", ".tsx", ".ts", ".js"],
    dedupe: ["react", "react-dom"],
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
  },
  optimizeDeps: {
    exclude: ["react-native-svg"],
  },
  build: {
    target: "esnext",
    sourcemap: false,
  },
  server: {
    fs: {
      allow: [
        path.resolve(__dirname, "."),
        path.resolve(__dirname, "../Wisp"),
      ],
    },
  },
});
