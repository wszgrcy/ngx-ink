import { Injectable, RendererFactory2, RendererType2, Renderer2, inject } from '@angular/core';
import { TerminalRenderer } from './renderer2.js';
import { emitLayoutListeners } from './dom.js';
import { ADOMElement } from './angular-dom.js';
import { InkService } from './ink.service.js';

/**
 * 终端渲染工厂 — 创建 TerminalRenderer 实例
 * 注册为 RendererFactory2 的替代实现
 */
@Injectable({ providedIn: 'root' })
export class TerminalRendererFactory implements RendererFactory2 {
    inkSerivce = inject(InkService);
    // 监听终端 resize
    constructor() {}

    /**
     * 创建渲染器实例
     * Angular 在每次组件渲染时调用此方法获取 renderer
     */
    createRenderer(hostElement: ADOMElement | any, type: RendererType2 | null): Renderer2 {
        return new TerminalRenderer(
            this.inkSerivce.ink.rootNode as any,
            hostElement ?? this.inkSerivce.ink.rootNode,
        );
    }

    /**
     * 当没有宿主元素时（纯文本组件），返回无操作 renderer
     */
    createRendererWithoutHydration(hostElement: null, type: RendererType2 | null): Renderer2 {
        return this.createRenderer(hostElement, type);
    }

    /** 一次执行渲染开始 */
    begin(): void {}

    /**
     * 一次执行渲染结束 — 触发 VNode → ANSI 转换并输出
     */
    end(): void {
        this.scheduleRender();
    }

    private scheduleRender() {
        this.flushRender();
    }

    private flushRender() {
        const rootNode = this.inkSerivce.ink.rootNode;
        if (typeof rootNode.onComputeLayout === 'function') {
            rootNode.onComputeLayout();
        }
        emitLayoutListeners(rootNode);
        if (rootNode.staticNode !== rootNode.previousStaticNode) {
            rootNode.previousStaticNode = rootNode.staticNode;
            if (typeof rootNode.onStaticChange === 'function') {
                rootNode.onStaticChange();
            }
        }
        // Since renders are throttled at the instance level and <Static> component children
        // are rendered only once and then get deleted, we need an escape hatch to
        // trigger an immediate render to ensure <Static> children are written to output before they get erased
        if (rootNode.isStaticDirty) {
            rootNode.isStaticDirty = false;
            if (typeof rootNode.onImmediateRender === 'function') {
                rootNode.onImmediateRender();
            }

            return;
        }

        if (typeof rootNode.onRender === 'function') {
            rootNode.onRender();
        }
        rootNode.isStaticDirty = false;
    }
}
