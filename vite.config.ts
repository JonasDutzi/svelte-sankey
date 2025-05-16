/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import IstanbulPlugin from "vite-plugin-istanbul";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "./dist/webc/",
    lib: {
      entry: ["./src/webc.index.ts"],
      formats: ["es"],
      name: "svelte-sankey",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: false,
        chunkFileNames: "[name].js",
        manualChunks: { svelte: ["svelte"] },
      },
    },
  },
  test: {
    include: ["test/unit/**/*.{test,spec}.{js,ts}"],
    coverage: {
      reporter: ["lcov", "text"],
      provider: "v8",
      reportsDirectory: "./coverage/vitest-coverage",
    },
  },
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
      },
    }),
    IstanbulPlugin({
      include: ["src/**/*.{js,ts,svelte}"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/test/**",
        "src/webc.index.ts",
        "src/main.ts",
        "src/inspector/**",
        "src/testdata/**",
      ],
      extension: [".js", ".ts", ".svelte"],
    }),
  ],
});
