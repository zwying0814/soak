/**
 * @license MIT
 * topbar 3.0.0
 * http://buunguyen.github.io/topbar
 * Copyright (c) 2024 Buu Nguyen
 */

interface TopbarOptions {
  autoRun?: boolean;
  barThickness?: number;
  barColors?: Record<string, string>;
  shadowBlur?: number;
  shadowColor?: string;
  className?: string | null;
}

interface TopbarInstance {
  config(opts: Partial<TopbarOptions>): void;
  show(delay?: number): void;
  progress(): number;
  progress(to: number | string): number;
  hide(): void;
}

class Topbar implements TopbarInstance {
  private canvas: HTMLCanvasElement | null = null;
  private currentProgress: number = 0;
  private showing: boolean = false;
  private progressTimerId: number | null = null;
  private fadeTimerId: number | null = null;
  private delayTimerId: number | null = null;

  private options: TopbarOptions = {
    autoRun: true,
    barThickness: 3,
    barColors: {
      "0": "rgba(26,  188, 156, .9)",
      ".25": "rgba(52,  152, 219, .9)",
      ".50": "rgba(241, 196, 15,  .9)",
      ".75": "rgba(230, 126, 34,  .9)",
      "1.0": "rgba(211, 84,  0,   .9)",
    },
    shadowBlur: 10,
    shadowColor: "rgba(0,   0,   0,   .6)",
    className: null,
  };

  private addEvent(elem: Element | Window, type: string, handler: EventListener): void {
    if ('addEventListener' in elem) {
      elem.addEventListener(type, handler, false);
    } else if ('attachEvent' in elem) {
      (elem as any).attachEvent("on" + type, handler);
    } else {
      (elem as any)["on" + type] = handler;
    }
  }

  private repaint(): void {
    if (!this.canvas) return;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = (this.options.barThickness || 3) * 5; // need space for shadow

    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    ctx.shadowBlur = this.options.shadowBlur || 10;
    ctx.shadowColor = this.options.shadowColor || "rgba(0,   0,   0,   .6)";

    const lineGradient = ctx.createLinearGradient(0, 0, this.canvas.width, 0);
    const barColors = this.options.barColors || {};
    for (const stop in barColors) {
      lineGradient.addColorStop(parseFloat(stop), barColors[stop]);
    }
    
    ctx.lineWidth = this.options.barThickness || 3;
    ctx.beginPath();
    ctx.moveTo(0, (this.options.barThickness || 3) / 2);
    ctx.lineTo(
      Math.ceil(this.currentProgress * this.canvas.width),
      (this.options.barThickness || 3) / 2
    );
    ctx.strokeStyle = lineGradient;
    ctx.stroke();
  }

  private createCanvas(): void {
    this.canvas = document.createElement("canvas");
    const style = this.canvas.style;
    style.position = "fixed";
    style.top = style.left = style.right = style.margin = style.padding = "0";
    style.zIndex = "100001";
    this.canvas.hidden = true;
    if (this.options.className) {
      this.canvas.classList.add(this.options.className);
    }
    this.addEvent(window, "resize", () => this.repaint());
  }

  config(opts: Partial<TopbarOptions>): void {
    Object.assign(this.options, opts);
  }

  show(delay?: number): void {
    if (this.showing) return;
    
    if (delay) {
      if (this.delayTimerId) return;
      this.delayTimerId = window.setTimeout(() => this.show(), delay);
    } else {
      this.showing = true;
      if (this.fadeTimerId !== null) {
        window.cancelAnimationFrame(this.fadeTimerId);
      }
      if (!this.canvas) {
        this.createCanvas();
      }
      if (this.canvas && !this.canvas.parentElement) {
        document.body.appendChild(this.canvas);
      }
      if (this.canvas) {
        this.canvas.style.opacity = "1";
        this.canvas.hidden = false;
      }
      this.progress(0);
      if (this.options.autoRun) {
        const loop = (): void => {
          this.progressTimerId = window.requestAnimationFrame(loop);
          this.progress("+" + 0.05 * Math.pow(1 - Math.sqrt(this.currentProgress), 2));
        };
        loop();
      }
    }
  }

  progress(): number;
  progress(to: number | string): number;
  progress(to?: number | string): number {
    if (typeof to === "undefined") return this.currentProgress;
    
    let newProgress: number;
    if (typeof to === "string") {
      newProgress = (to.indexOf("+") >= 0 || to.indexOf("-") >= 0
        ? this.currentProgress
        : 0) + parseFloat(to);
    } else {
      newProgress = to;
    }
    
    this.currentProgress = newProgress > 1 ? 1 : newProgress;
    this.repaint();
    return this.currentProgress;
  }

  hide(): void {
    if (this.delayTimerId) {
      clearTimeout(this.delayTimerId);
      this.delayTimerId = null;
    }
    if (!this.showing) return;
    
    this.showing = false;
    if (this.progressTimerId !== null) {
      window.cancelAnimationFrame(this.progressTimerId);
      this.progressTimerId = null;
    }
    
    const loop = (): void => {
      if (this.progress("+.1") >= 1) {
        if (this.canvas) {
          const currentOpacity = parseFloat(this.canvas.style.opacity) || 1;
          this.canvas.style.opacity = String(currentOpacity - 0.05);
          if (currentOpacity <= 0.05) {
            this.canvas.hidden = true;
            this.fadeTimerId = null;
            return;
          }
        }
      }
      this.fadeTimerId = window.requestAnimationFrame(loop);
    };
    loop();
  }
}

// 创建单例实例
const topbar = new Topbar();

// 导出类型和实例
export type { TopbarOptions, TopbarInstance };
export { Topbar };
export default topbar;

// 兼容全局使用
if (typeof window !== 'undefined') {
  (window as any).topbar = topbar;
}