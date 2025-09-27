import Pjax from "~/plugin/pjax";
import topbar from "~/plugin/topbar";
import viewImage from "~/plugin/view-image";
import { themeChange } from "theme-change";

export default class InitApp {
    constructor() {
        this.init()
    }
    init() {
        themeChange();
        document.addEventListener("DOMContentLoaded", () => {
            this.initPjax()
            this.initViewImage()
            this.backTopHiddenListeners()
        })
    }
    // 初始化pjax
    initPjax() {
        window.pjax = new Pjax({
            selectors: ["title", "meta", "main", "[data-hero-box]"],
        });

        document.addEventListener("pjax:complete", () => {
            const drawer = document.getElementById("my-drawer") as HTMLInputElement;
            if (drawer) {
                drawer.checked = false;
            }
            topbar.hide();
        });
        document.addEventListener("pjax:send", () => {
            topbar.show();
        });
    }
    // 初始化ViewImage
    initViewImage() {
        viewImage.init('article[data-article] img');

        // 在pjax页面切换后重新初始化ViewImage
        document.addEventListener("pjax:complete", () => {
            viewImage.init('article[data-article] img');
        });
    }
    // 滚动监听函数
    backTopHiddenListeners() {
        // 监听滚动事件
        const backToTopBtn = document.getElementById("back-to-top");
        let lastScrollY = 0;
        window.addEventListener("scroll", () => {
            const currentScrollY = window.scrollY;
            // 只有向下滚动且超过200px时才显示按钮
            if (backToTopBtn && currentScrollY > lastScrollY && currentScrollY > 200) {
                backToTopBtn.classList.remove("opacity-0", "invisible");
                backToTopBtn.classList.add("opacity-100", "visible");
            }
            // 当滚动到顶部50px范围内时隐藏按钮
            else if (backToTopBtn && currentScrollY <= 50) {
                backToTopBtn.classList.add("opacity-0", "invisible");
                backToTopBtn.classList.remove("opacity-100", "visible");
            }

            lastScrollY = currentScrollY;
        });
    }
}

