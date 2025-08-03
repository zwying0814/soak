import type { RewardConfig } from "@/utils/types";
import {createSignal} from "solid-js";
import {Portal} from "solid-js/web";

interface Props {
    rewardConfig: RewardConfig
}

const Rewards = (props:Props) => {
    const [open, setOpen] = createSignal<boolean>(false)
    const [activeTab, setActiveTab] = createSignal(0);
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
            <button class="btn bg-base-100 border-base-content/10" onClick={openModal}>
                {
                    props.rewardConfig?.icon && <img src={props.rewardConfig.icon} class="size-5 me-2" alt="打赏图标" />
                }
                {
                    props.rewardConfig?.text || '打赏'
                }
            </button>
            <Portal mount={document.body}>
                <dialog open={open()} class="modal" onClick={closeModal}>
                    <div class="modal-box" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeModal} class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕
                        </button>
                        <h3 class="text-lg font-serif mb-4">
                            {props.rewardConfig?.dialog_title || '打赏'}
                        </h3>
                        <div class="mt-4">
                            <div class="overflow-hidden rounded-box border border-base-content/10 bg-base-200 p-1">
                                <ul class="flex items-center gap-2 text-sm relative">
                                    {props.rewardConfig?.data.map((item, idx) => {
                                        return (
                                            <li
                                                onClick={() => setActiveTab(idx)}
                                                class={`flex-grow flex cursor-pointer items-center gap-2 rounded-box py-2 justify-center ${activeTab() === idx ? 'bg-base-100 dark:bg-base-content/10 shadow' : ''}`}
                                            >
                                                {item.icon && <img src={item.icon} class="size-5" alt="打赏图标" />}
                                                {item.type}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div class="text-center mt-6">
                                {props.rewardConfig?.data.map((item, idx) => {
                                    return (
                                        <div class={activeTab() === idx ? '!block' : 'hidden'}>
                                            <div class="size-56 inline-block border-2 border-amber-500 rounded-box dark:border-amber-400">
                                                <img src={item.url} class="w-full p-1" alt={item.type} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </dialog>
            </Portal>
        </>
    );
};

export default Rewards;