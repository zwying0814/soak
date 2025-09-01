import { defineConfig } from "astro/config";
import tailwindcss from '@tailwindcss/vite';
import wasm from "vite-plugin-wasm";
import pagefindIntegration from "./plugin/pageFind.ts";
import solid from '@astrojs/solid-js';
import icon from 'astro-icon';
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import rehypeMathjax from 'rehype-mathjax';
import rehypeExternalLinks from "rehype-external-links";
import codeHighlightIntegration from "./plugin/codeHighlight.ts";
import { siteConfig } from "./config/site.ts";

// https://astro.build/config
export default defineConfig({
    site: siteConfig.url,
    outDir: '.deploy',
    output: 'static',
        markdown: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeMathjax, [
            rehypeExternalLinks,
            {
                target: '_blank',
                rel: ['noopener', 'noreferrer']
            },
        ]],
        syntaxHighlight: {
            excludeLangs: ['echarts'],
        }
    },
    integrations: [
        codeHighlightIntegration(),
        mdx(),
        sitemap(),
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