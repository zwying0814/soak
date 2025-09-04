#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

/**
 * 执行命令并输出结果
 * @param {string} command - 要执行的命令
 * @param {object} options - 执行选项
 */
function execCommand(command, options = {}) {
  console.log(`\n🔧 执行命令: ${command}`);
  try {
    const result = execSync(command, {
      stdio: 'inherit',
      cwd: projectRoot,
      ...options
    });
    return result;
  } catch (error) {
    console.error(`❌ 命令执行失败: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

/**
 * 加载部署配置
 */
async function loadDeployConfig() {
  // 查找配置文件
  const jsConfigPath = join(projectRoot, 'config', 'deploy.js');
  const exampleJsConfigPath = join(projectRoot, 'config.example', 'deploy.js');
  const exampleTsConfigPath = join(projectRoot, 'config.example', 'deploy.ts');
  
  let configPath = null;
  
  if (existsSync(jsConfigPath)) {
    configPath = jsConfigPath;
  }
  
  if (!configPath) {
    if (existsSync(exampleJsConfigPath)) {
      console.log('⚠️  未找到 config/deploy.js，请从 config.example/deploy.js 复制');
      console.log('💡 运行命令: cp config.example/deploy.js config/deploy.js');
      console.log('💡 然后根据实际情况修改配置');
    } else if (existsSync(exampleTsConfigPath)) {
      console.log('⚠️  未找到 config/deploy.js，请从 config.example/deploy.ts 复制并转换为 JavaScript 格式');
      console.log('💡 运行命令: cp config.example/deploy.ts config/deploy.js');
      console.log('💡 然后将文件内容转换为 JavaScript 语法');
    } else {
      console.log('❌ 未找到部署配置文件');
    }
    process.exit(1);
  }

  try {
    // 动态导入 JavaScript 配置文件
    const configModule = await import(`file://${configPath}`);
    return configModule.deployConfig;
  } catch (error) {
    console.error('❌ 加载配置文件失败:', error.message);
    console.error('提示: 请确保配置文件使用正确的 JavaScript ES 模块语法');
    process.exit(1);
  }
}

/**
 * 检查必要的工具
 */
function checkRequirements() {
  try {
    execSync('git --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ Git 未安装或不在 PATH 中');
    process.exit(1);
  }
}

/**
 * 构建项目
 */
function buildProject() {
  console.log('\n📦 开始构建项目...');
  execCommand('npm run build');
  console.log('✅ 项目构建完成');
}

/**
 * 部署到 Git 仓库
 * @param {object} config - 部署配置
 */
function deployToGit(config) {
  const {
    repository,
    branch,
    commitMessage = 'Deploy: {timestamp}',
    buildDir = '.deploy',
    git
  } = config;

  const buildPath = join(projectRoot, buildDir);
  
  if (!existsSync(buildPath)) {
    console.error(`❌ 构建目录不存在: ${buildPath}`);
    process.exit(1);
  }

  console.log('\n🚀 开始部署...');
  
  // 初始化 Git 仓库（如果不存在）
  const gitPath = join(buildPath, '.git');
  if (!existsSync(gitPath)) {
    console.log('📁 初始化 Git 仓库...');
    execSync('git init', { stdio: 'inherit', cwd: buildPath });
  }
  
  // 设置 Git 用户信息（如果配置了）
  if (git?.name) {
    execSync(`git config user.name "${git.name}"`, { stdio: 'inherit', cwd: buildPath });
  }
  if (git?.email) {
    execSync(`git config user.email "${git.email}"`, { stdio: 'inherit', cwd: buildPath });
  }
  
  // 添加远程仓库
  try {
    execSync(`git remote add origin ${repository}`, { stdio: 'ignore', cwd: buildPath });
  } catch (error) {
    // 如果远程仓库已存在，更新 URL
    console.log('🔄 远程仓库已存在，更新 URL...');
    execSync(`git remote set-url origin ${repository}`, { stdio: 'inherit', cwd: buildPath });
  }
  
  // 检查是否有文件变更
  execSync('git add .', { stdio: 'inherit', cwd: buildPath });
  
  try {
    execSync('git diff --staged --quiet', { stdio: 'ignore', cwd: buildPath });
    console.log('ℹ️  没有文件变更，跳过部署');
    return;
  } catch (error) {
    // 有文件变更，继续部署
    console.log('📝 检测到文件变更，继续部署...');
  }
  
  // 生成提交信息
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const finalCommitMessage = commitMessage.replace('{timestamp}', timestamp);
  
  // 提交变更
  console.log(`📝 提交变更: ${finalCommitMessage}`);
  execSync(`git commit -m "${finalCommitMessage}"`, { stdio: 'inherit', cwd: buildPath });
  
  // 推送到远程仓库
  console.log(`📤 推送到 ${repository} 的 ${branch} 分支...`);
  execSync(`git push --force origin HEAD:${branch}`, { stdio: 'inherit', cwd: buildPath });
  
  console.log('\n🎉 部署完成！');
  console.log(`🔗 仓库地址: ${repository}`);
  console.log(`🌿 分支: ${branch}`);
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始自动化部署流程...');
  
  // 检查必要工具
  checkRequirements();
  
  // 加载配置
  const config = await loadDeployConfig();
  console.log('✅ 配置加载完成');
  
  // 构建项目
  buildProject();
  
  // 部署到 Git
  deployToGit(config);
  
  console.log('\n🎊 所有操作完成！');
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
  main().catch((error) => {
    console.error('❌ 部署失败:', error.message);
    process.exit(1);
  });
}

export { main as deploy };