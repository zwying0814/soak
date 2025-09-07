import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const postsBaseCollection = defineCollection({
    loader: glob({
        base: "./content/posts",
        pattern: "**/*.{md,mdx}",
    }),
    schema: z.object({
        title: z.string(),
        created: z.date(),
        updated: z.date().optional(),
        draft: z.boolean().optional().default(false),
        comment: z.boolean().optional().default(true),
        toc: z.boolean().optional().default(true),
        description: z.string().optional().default(""),
        thumbnail: z.string().optional().default("/images/img-2.jpg"),
        tags: z.array(z.string()).optional().default([]),
        categories: z.array(z.string()).optional().default([])
    }),
})

const pagesBaseCollection = defineCollection({
    loader: glob({
        base: "./content/pages",
        pattern: "**/*.{md,mdx}",
    }),
    schema: z.object({
        title: z.string(),
        created: z.date(),
        updated: z.date().optional(),
        draft: z.boolean().optional().default(false),
        comment: z.boolean().optional().default(true),
        toc: z.boolean().optional().default(true),
        description: z.string().optional().default(""),
        thumbnail: z.string().optional().default("/images/img-2.jpg"),
    }),
})

const postsCollection = defineCollection({
    ...postsBaseCollection,
})

const pagesCollection = defineCollection({
    ...pagesBaseCollection,
})

export const collections = {
    posts: postsCollection,
    pages: pagesCollection,
}