import {type CollectionEntry, getCollection} from "astro:content";
import {format} from "date-fns";
import { navbarConfig } from "~/config/navbar";
import type { MenuItem } from "./types";
import { format_number, word_count } from "~/plugin/soak_wasm/pkg-bundler/soak_wasm";

// 获取所有分类名称（最底层的子级），父级分类原则上不允许放文章
const getCategoryNames =(categories: readonly MenuItem[]): string[] => {
    let names: string[] = [];
    categories.forEach((category) => {
        if (category.children) {
            names = names.concat(getCategoryNames(category.children));
        } else {
            names.push(category.name);
        }
    });
    names = [...new Set(names)];
    return names;
};

// 导出文章分类最底层的name
export const postsCategories = getCategoryNames(navbarConfig.menu)

// 格式化时间
export function formatDateToYYYYMMDD(date: Date): string {
    return format(date, 'yyyy年MM月dd日')
}

// 按照时间倒叙排序文章
export async function getSortedPosts() {
    const allBlogPosts = await getAllPosts()
    return allBlogPosts.sort((a, b) => {
        const dateA = new Date(a.data.created)
        const dateB = new Date(b.data.created)
        return dateA > dateB ? -1 : 1
    })
}

// 获取文章总字数
export const getPostTotalWords = async (posts: (string | undefined)[]): Promise<number> => {
    let count = 0;
    for (const post of posts) {
        if (post) {
            const {words} = word_count(post);
            count += words;
        }
    }
    return count;
};

export function findCategorySlugByName(categories: MenuItem[], name: string): string | null {
    for (const category of categories) {
        // 检查当前分类的name
        if (category.name === name) {
            return category.slug;
        }
        // 如果有子分类，递归检查子分类
        if (category.children) {
            const result = findCategorySlugByName(category.children, name);
            if (result) {
                return result;
            }
        }
    }
    // 如果没找到，返回null
    return null;
}

export function findCategoryImageByName(categories: MenuItem[], name: string): string | undefined {
    for (const category of categories) {
        // 检查当前分类的name
        if (category.name === name) {
            return category.image;
        }
        // 如果有子分类，递归检查子分类
        if (category.children) {
            const result = findCategoryImageByName(category.children, name);
            if (result) {
                return result;
            }
        }
    }
    // 如果没找到，返回null
    return undefined;
}

// 获取随机图片链接
export function getRandomImage(): string {
    // 随机生成1~6的数字
    const randomIndex = Math.floor(Math.random() * 6) + 1;
    return `/images/img-${randomIndex}.jpg`;
}

// blur模式下图片获取逻辑
export function getBlurImage(url: string): string {
    if (url !== "") {
        return url
    } else {
        return getRandomImage()
    }
}

// 全部文章
export async function getAllPosts(): Promise<CollectionEntry<'posts'>[]> {
    return await getCollection('posts', ({data}) => {
        return import.meta.env.PROD ? data.draft !== true : true
    })
}

// 全部页面
export async function getAllPages(): Promise<CollectionEntry<'pages'>[]> {
    return await getCollection('pages', ({data}) => {
        return import.meta.env.PROD ? data.draft !== true : true
    })
}

// 侧边栏文章总数
export async function getPostCount(): Promise<string> {
    const allBlogPosts: CollectionEntry<'posts'>[] = await getAllPosts()
    return format_number(allBlogPosts.length)
}

// 侧边栏标签数
export async function getTagCount(): Promise<string> {
    const allBlogPosts = await getAllPosts()
    const tags = allBlogPosts.map(post => post.data.tags).flat()
    return format_number(new Set(tags).size)
}

// 侧边栏文字总数
export async function getWordCount(): Promise<string> {
    const allBlogPosts = await getAllPosts()
    const posts = allBlogPosts.map(post => post.body).flat()
    return format_number(await getPostTotalWords(posts))
}

// 获取最近的5篇文章
export async function getRecentPosts(): Promise<CollectionEntry<'posts'>[]> {
    const allPosts = await getSortedPosts()
    return allPosts.slice(0, 5)
}