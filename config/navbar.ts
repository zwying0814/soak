import type { NavbarConfig } from '../src/utils/types';

export const navbarConfig: NavbarConfig = {
  navbar_style: "fixed",
  hide_navbar_on_scroll: true,
  menu: [
    {
      name: "默认分类",
      slug: "default"
    },
    {
      name: "电子信息",
      slug: "information",
      children: [
        {
          name: "计算机",
          slug: "computer",
          url: "/category/computer"
        }
      ]
    },
    {
      name: "我的作品",
      slug: "works",
      url: "/category/works"
    },
    {
      name: "朋友圈",
      slug: "friends",
      url: "/friends"
    }
  ]
};