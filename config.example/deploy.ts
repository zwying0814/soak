export interface DeployConfig {
  // Git 仓库 URL
  repository: string;
  // 分支名称
  branch: string;
  // 提交信息
  commitMessage?: string;
  // 构建输出目录
  buildDir?: string;
  // Git 用户信息
  git?: {
    name?: string;
    email?: string;
  };
  // 是否在部署前清理目标分支
  cleanBranch?: boolean;
}

export const deployConfig: DeployConfig = {
  // 目标 Git 仓库 URL（请替换为你的仓库地址）
  repository: "https://github.com/username/repo.git",
  // 部署分支
  branch: "gh-pages",
  // 提交信息模板
  commitMessage: "Deploy: {timestamp}",
  // 构建输出目录（默认使用 astro.config.ts 中的 outDir）
  buildDir: ".deploy",
  // Git 用户信息（可选，如果不设置将使用全局配置）
  git: {
    name: "Deploy Bot",
    email: "deploy@example.com"
  },
  // 是否在部署前清理目标分支
  cleanBranch: true
};