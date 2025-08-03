import {type JSX, onMount, onCleanup, createSignal} from 'solid-js';
import type {EChartsOption, EChartsType} from "echarts";

interface EChartsProps {
    options: EChartsOption;
    style?: JSX.CSSProperties;
}

export default function EChartTable(props: EChartsProps) {
    let container!: HTMLDivElement;
    const [chart, setChart] = createSignal<EChartsType | null>(null);
    let resizeListener: (() => void) | null = null;
    
    onMount(() => {
        // 确保只在客户端中导入和初始化echarts
        if (typeof window !== 'undefined') {
            import('echarts').then((echarts) => {
                // 确保DOM元素存在
                if (container) {
                    const chartInstance = echarts.init(container);
                    chartInstance.setOption(props.options);
                    setChart(chartInstance);
                    
                    // 添加窗口调整大小的事件监听器
                    const handleResize = () => {
                        chartInstance.resize();
                    };
                    window.addEventListener('resize', handleResize);
                    resizeListener = handleResize;
                }
            });
        }
    });
    
    // 在组件顶层使用onCleanup
    onCleanup(() => {
        const currentChart = chart();
        if (currentChart) {
            currentChart.dispose();
        }
        
        if (resizeListener && typeof window !== 'undefined') {
            window.removeEventListener('resize', resizeListener);
        }
    });

    return (
        <div
            ref={container}
            style={{
                width: '100%',
                height: '400px',
                ...props.style
            }}
        />
    );
}