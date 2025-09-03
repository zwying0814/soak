# 部署脚本使用说明

## 概述

`deploy.js` 脚本用于自动化部署 Astro 项目到 Git 仓库，特别适用于部署到 GitHub Pages、GitLab Pages 等静态网站托管服务。

## 功能特性

- 🚀 自动构建 Astro 项目
- 📦 将构建产物推送到指定 Git 仓库
- ⚙️ 支持自定义配置
- 🔧 支持强制推送和增量推送
- 📝 自动生成时间戳提交信息
- ✅ 完整的错误处理和日志输出

## 快速开始

### 1. 配置部署信息

首先，复制配置模板并进行配置：

```bash
# 复制配置文件
cp config.example/deploy.ts config/deploy.ts
```

然后编辑 `config/deploy.ts` 文件，配置你的 Git 仓库信息：

```typescript
export const deployConfig: DeployConfig = {
  // 目标 Git 仓库 URL
  repository: "https://github.com/your-username/your-repo.git",
  // 部署分支
  branch: "gh-pages",
  // 提交信息模板
  commitMessage: "Deploy: {timestamp}",
  // 构建输出目录
  buildDir: ".deploy",
  // Git 用户信息（可选）
  git: {
    name: "Deploy Bot",
    email: "deploy@example.com"
  },
  // 是否强制推送（清理目标分支）
  cleanBranch: true
};
```

### 2. 执行部署

```bash
# 使用 npm 脚本
npm run deploy

# 或直接运行脚本
node scripts/deploy.js
```

## 配置选项详解

| 选项 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `repository` | string | ✅ | - | Git 仓库 URL |
| `branch` | string | ✅ | - | 目标分支名称 |
| `commitMessage` | string | ❌ | `"Deploy: {timestamp}"` | 提交信息模板，`{timestamp}` 会被替换为当前时间 |
| `buildDir` | string | ❌ | `".deploy"` | 构建输出目录 |
| `git.name` | string | ❌ | - | Git 用户名 |
| `git.email` | string | ❌ | - | Git 邮箱 |
| `cleanBranch` | boolean | ❌ | `true` | 是否强制推送（会覆盖目标分支历史） |

## 部署流程

1. **检查环境** - 验证 Git 是否安装
2. **加载配置** - 读取部署配置文件
3. **构建项目** - 执行 `npm run build`
4. **初始化 Git** - 在构建目录中初始化 Git 仓库
5. **配置 Git** - 设置用户信息和远程仓库
6. **提交变更** - 添加所有文件并提交
7. **推送部署** - 推送到目标仓库和分支

## 常见用例

### GitHub Pages 部署

```typescript
export const deployConfig: DeployConfig = {
  repository: "https://github.com/username/username.github.io.git",
  branch: "main", // 或 "gh-pages"
  commitMessage: "Deploy blog: {timestamp}",
  cleanBranch: true
};
```

### GitLab Pages 部署

```typescript
export const deployConfig: DeployConfig = {
  repository: "https://gitlab.com/username/project.git",
  branch: "pages",
  commitMessage: "Deploy: {timestamp}",
  cleanBranch: true
};
```

### 自定义服务器部署

```typescript
export const deployConfig: DeployConfig = {
  repository: "git@your-server.com:path/to/repo.git",
  branch: "production",
  commitMessage: "Production deployment: {timestamp}",
  cleanBranch: false, // 保留历史记录
  git: {
    name: "Production Bot",
    email: "production@yoursite.com"
  }
};
```

## 注意事项

1. **权限配置**：确保你有目标仓库的推送权限
2. **SSH vs HTTPS**：推荐使用 SSH 密钥进行身份验证
3. **分支保护**：如果目标分支有保护规则，可能需要调整设置
4. **构建目录**：确保 `astro.config.ts` 中的 `outDir` 与配置中的 `buildDir` 一致
5. **强制推送**：`cleanBranch: true` 会覆盖目标分支的历史记录，请谨慎使用

## 故障排除

### 常见错误

1. **Git 未安装**
   ```
   ❌ Git 未安装或不在 PATH 中
   ```
   解决：安装 Git 并确保在系统 PATH 中

2. **配置文件未找到**
   ```
   ⚠️ 未找到 config/deploy.ts
   ```
   解决：从 `config.example/deploy.ts` 复制配置文件

3. **权限被拒绝**
   ```
   Permission denied (publickey)
   ```
   解决：配置 SSH 密钥或使用 HTTPS 认证

4. **构建失败**
   ```
   ❌ 命令执行失败: npm run build
   ```
   解决：检查项目代码和依赖是否正确

### 调试技巧

- 检查构建输出目录是否存在：`ls -la .deploy/`
- 验证 Git 配置：`git config --list`
- 测试仓库连接：`git ls-remote <repository-url>`

## 扩展功能

脚本支持进一步自定义，你可以：

- 添加部署前的自定义钩子
- 集成 CI/CD 流水线
- 添加部署通知功能
- 支持多环境部署

如需更多功能，请修改 `scripts/deploy.js` 文件。