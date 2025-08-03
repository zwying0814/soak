import { defineConfig } from "astro/config";
import baseConfig from "@wordma/core/config";
import tailwindcss from '@tailwindcss/vite';
import wasm from "vite-plugin-wasm";
import pagefindIntegration from "./plugin/pageFind.ts";
import solid from '@astrojs/solid-js';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
    ...baseConfig,
    site: "https://www.example.com",
    integrations: [
        ...(baseConfig.integrations || []),
        pagefindIntegration(),
        solid(),
        icon(),
    ],
    vite: {
        plugins: [
            wasm(),
            tailwindcss()
        ]
    },
} satisfies Parameters<typeof defineConfig>[0]);