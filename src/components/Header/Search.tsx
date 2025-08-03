import {type Component, createSignal} from "solid-js";
import {Portal} from "solid-js/web"

const Search: Component = () => {
    const [open, setOpen] = createSignal<boolean>(false)
    const [isComposing, setIsComposing] = createSignal<boolean>(false); // 标记输入法是否正在组合
    const [searchResult, setSearchResult] = createSignal<any[]>([]);
    const fetchResults = async (value: string) => {
        if (isComposing()) return;
        setSearchResult([]);
        if (value) {
            const search = await window.pagefind.search(value);
            const newResults = [];
            for (const item of search.results) {
                newResults.push(await item.data());
            }
            setSearchResult(newResults);
        }
    };

    const goTo = (url: string) => {
        window.pjax.load(url).then(()=>{
            setOpen(false);
            setSearchResult([]);
            const searchInput = document.getElementById("search") as HTMLInputElement;
            if (searchInput) {
                searchInput.value = "";
            }
            closeModal()
        });
    };
    let scrollTop: number = 0
    const openModal = () => {
        scrollTop = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = -scrollTop + 'px';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        setOpen(true)
    }

    const closeModal = () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.height = '';
        window.scrollTo(0, scrollTop);
        setOpen(false)
    }


    return (
        <>
            <button class="btn btn-square btn-ghost" onClick={openModal}>
                <svg class="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                </svg>
            </button>
            <Portal mount={document.body}>
                <dialog open={open()} class="modal" onClick={closeModal}>
                    <div class="modal-box" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeModal} class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕
                        </button>
                        <h3 class="text-lg font-serif mb-4">
                            全站搜索
                        </h3>
                        <label class="input w-full mb-4">
                            <svg class="size-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                 fill="currentColor">
                                <path
                                    d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                            </svg>
                            <input type="search" placeholder="输入搜索内容..." id="search"
                                   onInput={(e) => {
                                       if (!isComposing()) {
                                           fetchResults(e.target.value).then()
                                       }
                                   }}
                                   onCompositionStart={() => setIsComposing(true)} // 输入法开始
                                   onCompositionEnd={(e) => {
                                       setIsComposing(false); // 输入法结束
                                       fetchResults(e.currentTarget.value).then()
                                   }}
                            />
                        </label>
                        {searchResult().length > 0 &&
                            searchResult().map((item) => (
                                <div onClick={() => goTo(item.url)} role="presentation"
                                     class="transition cursor-pointer first-of-type:mt-2 lg:first-of-type:mt-0 group block rounded-lg text-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <div
                                        class="transition inline-flex font-bold font-serif group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                        {item.meta.title}
                                    </div>
                                    <div class="transition text-sm" innerHTML={item.excerpt}/>
                                </div>
                            ))
                        }
                    </div>
                </dialog>
            </Portal>
        </>
    );
};

export default Search;