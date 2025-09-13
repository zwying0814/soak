import type { SiteConfig } from '@/utils/types';

export const siteConfig: SiteConfig = {
  url: "https://abc.com",
  title: "赵阿卷",
  subtitle: "多年沉淀带来的惊喜",
  description: "花有重开日，人无再少年",
  lang: "zh_CN",
  favicon: "/favicon.ico",
  since: "2020-02-18",
  author: {
    username: "赵阿卷",
    email: "zwying0814@gamil.com",
    bio: "花有重开日，人无再少年",
    avatar: "/images/avatar.svg"
  },
  smooth_scroll: true,
  support_chart: true,
  icp_license: "京ICP备12345678号-1", // ICP备案号，请替换为实际备案号
  police_license: "京公网安备 11010802012345号", // 公安备案号，请替换为实际备案号
  comment: {
    enabled: true, // 是否启用评论系统
    provider: 'twikoo', // 评论系统提供商（当前仅支持 twikoo）
    lang: 'zh-CN', // 评论界面语言
    twikoo: {
      envId: 'https://your-twikoo-server.vercel.app', // Vercel 部署填写完整URL
      // envId: 'your-tencent-env-id', // 腾讯云部署填写环境ID
      // region: 'ap-shanghai', // 腾讯云地域，如：ap-shanghai, ap-guangzhou（仅腾讯云需要）
    }
    // 注意：waline、disqus 等其他评论系统暂未实现
  }
};