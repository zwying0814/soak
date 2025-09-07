import type { NavbarConfig } from "@/utils/types";

export const navbarConfig: NavbarConfig = {
  navbar_style: "fixed",
  hide_navbar_on_scroll: true,
  menu: [
    {
      // name为分类名称，在文章书写时，通过指定分类的name来实现文章分类
      name: "默认分类",
      // slug为标识符，如果不指定url参数，那么将使用slug拼凑最终url结果
      slug: "default",
      // label为导航栏上显示的名称
      label: "默认",
      // url为分类的url，指定了url，那么将使用url，最好配置一下，这样和自定义url不会冲突
      // 文章分类url风格均为 /category/分类名称
      url: "/category/default"
    },
    // 子分类配置方式：
    {
      name: "电子信息",
      label: "电子信息",
      slug: "information",
      children: [
        {
          name: "计算机",
          label: "📊计算机",
          slug: "computer",
          url: "/category/computer"
        }
      ]
    },
    // 其他页面配置：
    {
      name: "朋友圈",
      label: "朋友",
      slug: "friends",
      url: "/friends"
    }
  ]
};