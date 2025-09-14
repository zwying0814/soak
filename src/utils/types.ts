export interface HomeConfig {
    title: string
    subtitle_mode: 'simple' | 'hitokoto' | 'poem',
    subtitle: string
    top_image?: string,
    top_image_height: string,
    article_list_style: 'simple' | 'card' | 'blur',
    article_list_page_size: number,
    article_list_load_type: 'ajax' | 'pagination',
}

export interface MenuItem {
    name: string; // 菜单项名称
    slug: string; // 菜单项标识符
    label?: string; // 菜单项在导航栏显示的标签（可选）
    url?: string; // 菜单项链接（可选）
    image?: string; // 菜单项图片（可选）
    children?: MenuItem[]; // 子菜单项（可选）
}

export interface NavbarConfig {
    navbar_style: "fixed" | "static"; // 导航栏样式，这里限制为 "fixed" 或其他字符串
    hide_navbar_on_scroll: boolean; // 是否在滚动时隐藏导航栏
    menu: MenuItem[]; // 菜单项数组
}

interface RewardDataItem {
    type: string;
    icon: string;
    url: string;
}

export interface RewardConfig {
    // 打赏按钮的文字
    text?: string;
    // 打赏按钮的图标
    icon?: string;
    // 打赏弹窗标题
    dialog_title?: string;
    // 打赏弹窗描述
    dialog_description?: string;
    data: RewardDataItem[];
}

export interface SidebarConfig {
    sidebar_position: 'left' | 'right',
    recent_article_style: 'card' | 'simple',
    sidebar: boolean,
    sidebar_view_on_article_list: boolean,
    sidebar_view_on_article: boolean,
    profile_background?: string,
    mobile_top_image?: string,
    mobile_top_image_height?: string,
    mobile_profile_signature: string,
    mobile_profile_image: string,
    mobile_profile_nickname: string
}

export interface Author {
    avatar?: string
    username: string
    email: string
    bio: string
}

export interface SiteConfig {
    url: string;
    title: string
    subtitle: string
    lang: string
    description: string,
    logo?: string,
    favicon?: string,
    since: string,
    author: Author,
    support_chart?: boolean,
    icp_license?: string, // ICP备案号
    police_license?: string, // 公安备案号
}

export interface AllConfigs {
    home: HomeConfig;
    navbar: NavbarConfig;
    reward: RewardConfig;
    sidebar: SidebarConfig;
    site: SiteConfig;
}

export interface WordCount {
    characters: number;
    words: number;
    paragraphs: number;
}