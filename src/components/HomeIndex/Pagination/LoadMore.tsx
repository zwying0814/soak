import {createSignal, Show} from 'solid-js';
import {toast} from "solid-toast";

interface LoadMoreProps {
    total: number;
    size: number;
    currentPage: number;
    prev?: string;
    next?: string;
}

const LoadMore = (props: LoadMoreProps) => {
    const [loading, setLoading] = createSignal(false);
    const [localCurrentPage, setLocalCurrentPage] = createSignal(props.currentPage);
    const [disable, setDisable] = createSignal(!props.next);

    const hasMorePages = () => {
        return localCurrentPage() * props.size < props.total;
    };

    async function loadMore() {
        if (!props.next || !hasMorePages()) {
            setDisable(true);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/${localCurrentPage()+1}`);
            if (!response.ok) {
                toast.error('加载失败');
                return;
            }
            
            const data = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const articleList = doc.querySelector('[data-article-list]');
            
            if (!articleList) {
                toast.error('解析内容失败');
                return;
            }

            // 获取当前页面的文章列表容器
            const container = document.querySelector('[data-article-list]');
            if (container) {
                // 将新文章节点添加到现有容器中
                Array.from(articleList.childNodes).forEach((article) => {
                    if (article.nodeType === Node.ELEMENT_NODE) {
                        container.appendChild(article);
                    }
                });
            }

            // 更新当前页码
            setLocalCurrentPage(localCurrentPage() + 1);
            
            // 检查是否还有更多页面
            if (!hasMorePages()) {
                setDisable(true);
            }
        } catch (error) {
            console.error("加载更多文章失败", error);
            toast.error('加载失败');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Show
            when={!disable()}
            fallback={<button class="btn btn-wide font-serif">已加载全部文章</button>}
        >
            <button onClick={loadMore} class="btn btn-wide bg-base-100 font-serif">
                {loading() ? '加载中...' : '加载更多文章'}
            </button>
        </Show>
    );
};

export default LoadMore;