import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: "./dist/webc/",
        lib: {
            entry: ["./src/webc.index.ts"],
            formats: ["es"],
            name: "svelte-sankey"
        },
        rollupOptions: {
            output: {
                inlineDynamicImports: false,
                chunkFileNames: "[name].js",
                manualChunks: { svelte: ["svelte"] }
            }
        }
    },
    plugins: [
        svelte({
            compilerOptions: {
                customElement: true
            }
        })
    ]
});
