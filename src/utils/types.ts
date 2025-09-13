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

export interface TwikooConfig {
    envId: string; // 腾讯云环境填 envId；Vercel 环境填地址（https://xxx.vercel.app）
    region?: string; // 环境地域，腾讯云环境填 ap-shanghai 或 ap-guangzhou；Vercel 环境不填
}

export interface CommentConfig {
    enabled: boolean;
    provider: 'twikoo'; // 当前仅支持 twikoo，未来可扩展 waline、disqus 等
    lang?: string; // 评论系统语言
    twikoo?: TwikooConfig;
}

// 配置验证函数
export function validateCommentConfig(config: CommentConfig | undefined): {
    valid: boolean;
    error?: string;
} {
    if (!config) return { valid: true }; // 未配置评论时，视为有效

    if (!config.enabled) return { valid: true }; // 未启用时，无需验证

    if (config.provider === 'twikoo') {
        if (!config.twikoo) {
            return {
                valid: false,
                error: 'Twikoo 提供商需要配置 twikoo 对象'
            };
        }

        if (!config.twikoo.envId) {
            return {
                valid: false,
                error: 'Twikoo envId 不能为空'
            };
        }

        // 验证 envId 格式
        const envId = config.twikoo.envId;
        const isUrl = envId.startsWith('http://') || envId.startsWith('https://');
        const isTencentId = /^[a-zA-Z0-9-]+$/.test(envId);

        if (!isUrl && !isTencentId) {
            return {
                valid: false,
                error: 'Twikoo envId 格式无效，应为 URL 或腾讯云环境ID'
            };
        }

        // 如果是腾讯云环境ID，检查是否有region配置
        if (isTencentId && !config.twikoo.region) {
            console.warn('使用腾讯云环境时建议配置 region 字段');
        }
    }

    return { valid: true };
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
    smooth_scroll?: boolean,
    support_chart?: boolean,
    icp_license?: string, // ICP备案号
    police_license?: string, // 公安备案号
    comment?: CommentConfig, // 评论系统配置
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