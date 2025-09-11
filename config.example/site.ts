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
  police_license: "京公网安备 11010802012345号" // 公安备案号，请替换为实际备案号
};