import {type CollectionEntry, getCollection} from "astro:content";
import {format} from "date-fns";
import type { MenuItem } from "./types";
import { navbarConfig } from "~/config/navbar";
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// 类型定义
interface WordCountResult {
    characters: number;
    words: number;
    paragraphs: number;
}

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

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} 年前`;
  if (months > 0) return `${months} 月前`;
  if (weeks > 0) return `${weeks} 周前`;
  if (days > 0) return `${days} 天前`;
  if (hours > 0) return `${hours} 小时前`;
  if (minutes > 0) return `${minutes} 分钟前`;
  return "刚刚";
}

export function formatDate(date: Date, style: "absolute" | "relative" = "absolute"): string {
  return style === "relative" 
    ? formatRelativeTime(date) 
    : formatDateToYYYYMMDD(date);
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
    // 读取public/images/covers目录下的所有文件
    const imageList = readdirSync(
        join(process.cwd(), 'public/images/covers')
    ).filter(file => {
        // 只保留图片文件
        return file.endsWith('.jpg') ||
            file.endsWith('.png') ||
            file.endsWith('.jpeg') ||
            file.endsWith('.webp') ||
            file.endsWith('.avif');
    });
    const randomIndex = Math.floor(Math.random() * imageList.length);
    const fileName = imageList[randomIndex];
    return `/images/covers/${fileName}`;
}

// blur模式下图片获取逻辑
export function getBlurImage(url: string | undefined): string {    
    if (url) {
        return url
    } else {
        return getRandomImage()
    }
}

// 全部文章
export async function getAllPosts(): Promise<CollectionEntry<'posts'>[]> {
    return await getCollection('posts', ({ data }: { data: any }) => {
        return import.meta.env.PROD ? data.draft !== true : true
    })
}

// 全部页面
export async function getAllPages(): Promise<CollectionEntry<'pages'>[]> {
    return await getCollection('pages', ({ data }: { data: any }) => {
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

// 检查文件是否存在
export function checkFileExists(filePath: string): boolean {
    const fullPath = join(process.cwd(), filePath);
    return existsSync(fullPath);
}

// 检查自定义CSS文件是否存在
export function hasCustomStyle(): boolean {
    return checkFileExists('public/assets/style.css');
}

// hooks加载机制
export async function loadHookComponent(componentName: string): Promise<any | null> {
    try {
        const hookPath = `/hooks/${componentName}.astro`;
        const hookModules = import.meta.glob('/hooks/*.astro');
                
        if (hookModules[hookPath]) {
            const mod = (await hookModules[hookPath]()) as { default: any };
            return mod.default;
        }
        
        return null;
    } catch (error) {
        console.warn(`Failed to load hook component: ${componentName}`, error);
        return null;
    }
}

/**
 * 格式化数字
 * 
 * @param num - 需要格式化的数字
 * @returns 格式化后的字符串
 *   - 大于等于10000时，以"W"为单位，保留一位小数
 *   - 大于等于1000时，以"K"为单位，保留一位小数
 *   - 小于1000时，直接返回数字字符串
 */
export function format_number(num: number): string {
    if (num >= 10000) {
        const formatted = (num / 10000).toFixed(1);
        // 移除不必要的.0
        return formatted.endsWith('.0') ? formatted.slice(0, -2) + 'W' : formatted + 'W';
    } else if (num >= 1000) {
        const formatted = (num / 1000).toFixed(1);
        // 移除不必要的.0
        return formatted.endsWith('.0') ? formatted.slice(0, -2) + 'K' : formatted + 'K';
    } else {
        return num.toString();
    }
}

/**
 * 获取文章摘要
 * 
 * @param content - 文章内容（Markdown格式）
 * @returns 处理后的摘要字符串
 *   - 移除所有Markdown标记
 *   - 将换行符替换为空格
 *   - 如果字符数超过180，截取前180个字符并添加省略号
 *   - 如果字符数不超过180，返回完整文本
 */
export function get_article_summary(content: string): string {
    // 移除Markdown标记的正则表达式
    let text = content
        // 移除代码块
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]*`/g, '')
        // 移除标题
        .replace(/^#{1,6}\s+.*$/gm, '')
        // 移除链接
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        // 移除图片
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        // 移除粗体和斜体
        .replace(/\*\*([^*]*)\*\*/g, '$1')
        .replace(/\*([^*]*)\*/g, '$1')
        .replace(/__([^_]*)__/g, '$1')
        .replace(/_([^_]*)_/g, '$1')
        // 移除删除线
        .replace(/~~([^~]*)~~/g, '$1')
        // 移除引用
        .replace(/^>\s+/gm, '')
        // 移除列表标记
        .replace(/^[\s]*[-*+]\s+/gm, '')
        .replace(/^[\s]*\d+\.\s+/gm, '')
        // 移除水平线
        .replace(/^[-*_]{3,}$/gm, '')
        // 移除HTML标签
        .replace(/<[^>]*>/g, '')
        // 将多个换行符替换为单个空格
        .replace(/\n+/g, ' ')
        // 移除多余的空格
        .replace(/\s+/g, ' ')
        .trim();

    // 如果字符数超过180，截取并添加省略号
    if (text.length > 180) {
        return text.substring(0, 180) + '...';
    }
    
    return text;
}

/**
 * 统计文章字数
 * 
 * @param markdown - Markdown格式的文章内容
 * @returns 包含以下统计信息的对象:
 *   - characters: 字符数（不含空格和换行）
 *   - words: 中文字数和英文单词数之和
 *   - paragraphs: 段落数
 */
export function word_count(markdown: string): WordCountResult {
    // 移除代码块和行内代码
    let text = markdown
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]*`/g, '');

    // 计算字符数（不含空格和换行）
    const characters = text.replace(/[\s\n\r]/g, '').length;

    // 计算中文字符数
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;

    // 计算英文单词数
    const englishWords = text
        .replace(/[\u4e00-\u9fff]/g, ' ') // 将中文字符替换为空格
        .match(/\b[a-zA-Z]+\b/g);
    const englishWordCount = englishWords ? englishWords.length : 0;

    // 总词数 = 中文字符数 + 英文单词数
    const words = chineseChars + englishWordCount;

    // 计算段落数（以双换行符分隔）
    const paragraphs = text
        .split(/\n\s*\n/)
        .filter(paragraph => paragraph.trim().length > 0)
        .length;

    return {
        characters,
        words,
        paragraphs
    };
}

/**
 * 获取年份
 * 
 * @param since - 开始日期字符串（格式：YYYY-MM-DD）
 * @returns 年份字符串
 *   - 如果开始日期与当前日期不同，返回开始年份到当前年份的范围字符串（格式：YYYY - YYYY）
 *   - 如果开始日期与当前日期相同，返回当前年份字符串（格式：YYYY）
 */
export function get_year(since: string): string {
    const currentYear = new Date().getFullYear();
    const sinceYear = new Date(since).getFullYear();
    
    if (sinceYear === currentYear) {
        return currentYear.toString();
    } else {
        return `${sinceYear} - ${currentYear}`;
    }
}
