import {createSignal} from 'solid-js';
import {toast} from "solid-toast";

export default function GuessNumberGame() {
    const [target] = createSignal(Math.floor(Math.random() * 100) + 1);
    const [guess, setGuess] = createSignal('');
    const [message, setMessage] = createSignal('');
    const [attempts, setAttempts] = createSignal(0);

    const handleGuess = () => {
        const num = parseInt(guess());
        if (isNaN(num)) {
            setMessage('请输入一个有效的数字');
            return;
        }

        setAttempts(attempts() + 1);

        if (num === target()) {
            toast.success(`🎉 猜对了！我就是 ${target()}，你用了 ${attempts() + 1} 次`)
            setMessage(`🎉 猜对了！我就是 ${target()}，你用了 ${attempts() + 1} 次`)
        } else if (num < target()) {
            toast.error(`😨太小了，再试一次！`)
            setMessage('😨太小了，再试一次！');
        } else {
            toast.error(`😨太大了，再试一次！`)
            setMessage('😨太大了，再试一次！');
        }
    };

    return (
        <div class="flex w-full justify-center mb-6">
            <div class="card bg-base-100 w-full sm:w-1/2 p-6 border-base-content/10 border">
                <h2 class="mb-4">🎯 猜一个 1 到 100 之间的数字</h2>
                <div class="flex items-center gap-2 mb-4">
                    <input placeholder="输入你的猜测" class="input" value={guess()}
                           onInput={(e) => setGuess(e.currentTarget.value)}/>
                    <button onClick={handleGuess} class="btn btn-active btn-primary">猜一下</button>
                </div>
                <p class="text-sm">{message()}</p>
            </div>
        </div>
    );
}