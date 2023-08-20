import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: "./dist/webc/",
        lib: {
            entry: ["./src/lib/webc.index.ts"],
            formats: ["es"],
            name: "svelte-sankey",
            fileName: (format) =>
                ({
                    es: `svelte-sankey-webc.js`
                }[format])
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
