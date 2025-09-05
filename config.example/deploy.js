/**
 * 部署配置文件
 * 请根据你的实际情况修改以下配置
 */

/**
 * Git 用户配置
 * @typedef {Object} GitConfig
 * @property {string} [name] - Git 用户名
 * @property {string} [email] - Git 邮箱
 */

/**
 * 部署配置
 * @typedef {Object} DeployConfig
 * @property {string} repository - Git 仓库 URL
 * @property {string} branch - 部署分支名称
 * @property {string} [commitMessage] - 提交信息模板，{timestamp} 会被替换为当前时间
 * @property {string} [buildDir] - 构建输出目录，默认使用 astro.config.ts 中的 outDir
 * @property {GitConfig} [git] - Git 用户信息，如果不设置将使用全局配置
 * @property {boolean} [cleanBranch] - 是否在部署前强制推送（清理目标分支）
 */

/** @type {DeployConfig} */
export const deployConfig = {
  // 目标 Git 仓库 URL（请替换为你的仓库地址）
  repository: "https://github.com/zwying0814/my-blog.git",
  
  // 部署分支
  branch: "main",
  
  // 提交信息模板
  commitMessage: "Deploy: {timestamp}",
  
  // 构建输出目录（默认使用 astro.config.ts 中的 outDir）
  buildDir: ".deploy",
  
  // Git 用户信息（必需配置）
  git: {
    name: "zwying0814",
    email: "zwying0814@gmail.com"
  }
};