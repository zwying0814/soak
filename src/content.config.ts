import { defineCollection, z } from "astro:content";
import { postsCategories } from "@/utils/func.ts";
import { postsBaseCollection, pagesBaseCollection } from "@wordma/core/content";

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