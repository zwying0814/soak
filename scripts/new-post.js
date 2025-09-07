#!/usr/bin/env node

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createInterface } from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

/**
 * 生成文件名安全的字符串
 * @param {string} title - 文章标题
 * @returns {string} 安全的文件名
 */
function generateSafeFilename(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '') // 保留中英文、数字、空格和连字符
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/-+/g, '-') // 多个连字符合并为一个
    .replace(/^-|-$/g, ''); // 移除开头和结尾的连字符
}

/**
 * 生成文章模板
 * @param {string} title - 文章标题
 * @param {string} description - 文章描述
 * @returns {string} MDX文件内容
 */
function generatePostTemplate(title, slug, description = '') {
  const now = new Date();
  // 转换为东八区时间（北京时间）
  const beijingTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
  const year = beijingTime.getUTCFullYear();
  const month = String(beijingTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(beijingTime.getUTCDate()).padStart(2, '0');
  const hours = String(beijingTime.getUTCHours()).padStart(2, '0');
  const minutes = String(beijingTime.getUTCMinutes()).padStart(2, '0');
  const seconds = String(beijingTime.getUTCSeconds()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
  return `---
title: "${title}"
slug: "${slug}"
description: "${description}"
created: ${formattedDate}
updated: ${formattedDate}
draft: false
comment: true
toc: true
thumbnail: "/images/img-2.jpg"
tags: []
categories: []
---

## 章节标题

你的内容...

## 另一个章节

更多内容...
`;
}

/**
 * 创建新文章
 * @param {string} slug - 文章slug（必需）
 * @param {string} title - 文章标题
 * @param {string} description - 文章描述（可选）
 */
function createNewPost(slug, title, description = '') {
  if (!slug || slug.trim() === '') {
    console.error('❌ 请提供文章slug');
    console.log('💡 使用方法: npm run new-post "slug" "文章标题" ["文章描述"]');
    process.exit(1);
  }

  if (!title || title.trim() === '') {
    console.error('❌ 请提供文章标题');
    console.log('💡 使用方法: npm run new-post "slug" "文章标题" ["文章描述"]');
    process.exit(1);
  }

  // 确保 content/posts 目录存在
  const contentDir = join(projectRoot, 'content');
  const postsDir = join(contentDir, 'posts');
  
  if (!existsSync(contentDir)) {
    mkdirSync(contentDir, { recursive: true });
    console.log('📁 创建 content 目录');
  }
  
  if (!existsSync(postsDir)) {
    mkdirSync(postsDir, { recursive: true });
    console.log('📁 创建 content/posts 目录');
  }

  // 验证slug格式（只允许字母、数字、连字符和下划线）
  const slugPattern = /^[a-zA-Z0-9_-]+$/;
  if (!slugPattern.test(slug.trim())) {
    console.error('❌ slug只能包含字母、数字、连字符和下划线');
    process.exit(1);
  }

  const cleanSlug = slug.trim();
  const postDir = join(postsDir, cleanSlug);
  const filepath = join(postDir, 'index.mdx');
  
  // 检查文件夹是否已存在
  if (existsSync(postDir)) {
    console.error(`❌ 文章目录已存在: ${cleanSlug}`);
    console.log('💡 请使用不同的slug或手动删除现有目录');
    process.exit(1);
  }

  // 生成文章内容
  const content = generatePostTemplate(title.trim(), cleanSlug, description.trim());
  
  try {
    // 创建文章目录
    mkdirSync(postDir, { recursive: true });
    console.log(`📁 创建文章目录: ${cleanSlug}`);
    
    // 写入文件
    writeFileSync(filepath, content, 'utf8');
    
    console.log('🎉 新文章创建成功！');
    console.log(`📄 文件路径: content/posts/${cleanSlug}/index.mdx`);
    console.log(`🔗 Slug: ${cleanSlug}`);
    console.log(`📝 标题: ${title}`);
    if (description) {
      console.log(`📋 描述: ${description}`);
    }
    console.log('\n💡 你现在可以开始编辑文章内容了！');
    console.log(`💡 文章相关的图片可以放在 content/posts/${cleanSlug}/ 目录下`);
    
  } catch (error) {
    console.error('❌ 创建文件失败:', error.message);
    process.exit(1);
  }
}

/**
 * 创建readline接口
 */
function createReadlineInterface() {
  return createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * 提示用户输入
 * @param {object} rl - readline接口
 * @param {string} question - 问题
 * @returns {Promise<string>} 用户输入
 */
function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * 交互式创建文章
 */
async function interactiveCreatePost() {
  const rl = createReadlineInterface();
  
  try {
    console.log('📝 创建新文章\n');
    
    // 输入slug
    let slug = '';
    while (!slug) {
      slug = await askQuestion(rl, '🔗 请输入文章slug（用作文件夹名和文件名，只能包含字母、数字、连字符和下划线）: ');
      
      if (!slug) {
        console.log('❌ slug不能为空，请重新输入');
        continue;
      }
      
      const slugPattern = /^[a-zA-Z0-9_-]+$/;
      if (!slugPattern.test(slug)) {
        console.log('❌ slug只能包含字母、数字、连字符和下划线，请重新输入');
        slug = '';
        continue;
      }
      
      // 检查是否已存在
      const contentDir = join(projectRoot, 'content');
      const postsDir = join(contentDir, 'posts');
      const postDir = join(postsDir, slug);
      
      if (existsSync(postDir)) {
        console.log(`❌ 文章目录已存在: ${slug}，请使用不同的slug`);
        slug = '';
        continue;
      }
    }
    
    // 输入标题
    let title = '';
    while (!title) {
      title = await askQuestion(rl, '📝 请输入文章标题: ');
      if (!title) {
        console.log('❌ 标题不能为空，请重新输入');
      }
    }
    
    // 输入描述（可选）
    const description = await askQuestion(rl, '📋 请输入文章描述（可选，直接回车跳过）: ');
    
    console.log('\n📋 文章信息确认:');
    console.log(`🔗 Slug: ${slug}`);
    console.log(`📝 标题: ${title}`);
    if (description) {
      console.log(`📋 描述: ${description}`);
    }
    console.log(`📁 文件路径: content/posts/${slug}/index.mdx\n`);
    
    const confirm = await askQuestion(rl, '✅ 确认创建文章？(Y/n): ');
    
    if (confirm === '' || confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
      createNewPost(slug, title, description);
    } else {
      console.log('❌ 已取消创建文章');
    }
    
  } catch (error) {
    console.error('❌ 创建文章时发生错误:', error.message);
  } finally {
    rl.close();
  }
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  
  // 如果提供了参数，使用旧的命令行模式
  if (args.length > 0) {
    if (args.length < 2) {
      console.error('❌ 参数不足');
      console.log('💡 使用方法: npm run new-post "slug" "文章标题" ["文章描述"]');
      console.log('💡 或者直接运行 npm run new-post 进入交互模式');
      process.exit(1);
    }
    
    const slug = args[0];
    const title = args[1];
    const description = args[2] || '';
    
    createNewPost(slug, title, description);
  } else {
    // 交互模式
    interactiveCreatePost();
  }
}

// 处理未捕获的错误
process.on('uncaughtException', (error) => {
  console.error('❌ 未捕获的异常:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ 未处理的 Promise 拒绝:', reason);
  process.exit(1);
});

// 运行主函数
if (import.meta.url.startsWith('file://') && process.argv[1] && import.meta.url.includes(process.argv[1].replace(/\\/g, '/'))) {
  main();
}

export { createNewPost };