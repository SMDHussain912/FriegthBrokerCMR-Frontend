import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Every source file in this project is `.js` but contains JSX.
    //
    // Vite 7's esbuild transform defaults to `exclude: /\.js$/`, so plain
    // `.js` files are never handed to esbuild and reach the import-analysis
    // step with raw JSX in them. We must override *both* the include filter
    // (otherwise the default `/\.(m?ts|[jt]sx)$/` also excludes `.js`) and the
    // exclude filter, then force the JSX loader.
    include: /\.[jt]sx?$/,
    exclude: [],
    loader: "jsx",
    jsx: "automatic",
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.js"],
    include: ["tests/**/*.test.{js,jsx}"],
  },
});
