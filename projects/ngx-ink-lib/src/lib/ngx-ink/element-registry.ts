/**
 * 元素注册表 — 关联 Angular component instance → InkVNode
 *
 * 用于 useBoxMetrics hook 在布局完成后获取组件对应的 Yoga 布局信息。
 */

import type { ADOMNode } from './vnode.js';

type LayoutUpdateCallback = () => void;

/** 注册的元素: key → { vNode, callbacks } */
const registry = new Map<object, { vnode: ADOMNode; callbacks: Set<LayoutUpdateCallback> }>();

export const elementRegistry = {
    /**
     * 注册一个组件实例与其对应的 VNode
     */
    register(componentInstance: object, vnode: ADOMNode): void {
        registry.set(componentInstance, { vnode, callbacks: new Set() });
    },

    /**
     * 取消注册
     */
    unregister(componentInstance: object): void {
        registry.delete(componentInstance);
    },

    /**
     * 注册布局变化回调 — 当布局计算完成后触发
     */
    addLayoutListener(componentInstance: object, callback: LayoutUpdateCallback): void {
        const entry = registry.get(componentInstance);
        if (entry) {
            entry.callbacks.add(callback);
        }
    },

    /**
     * 移除布局变化回调
     */
    removeLayoutListener(componentInstance: object, callback: LayoutUpdateCallback): void {
        const entry = registry.get(componentInstance);
        if (entry) {
            entry.callbacks.delete(callback);
        }
    },

    /**
     * 布局完成后触发所有回调
     */
    notifyLayoutComplete(): void {
        for (const entry of registry.values()) {
            for (const cb of entry.callbacks) {
                try {
                    cb();
                } catch {
                    /* ignore layout callback errors */
                }
            }
        }
    },

    /**
     * 根据 component instance 获取 InkVNode
     */
    getVNode(componentInstance: object): ADOMNode | undefined {
        return registry.get(componentInstance)?.vnode;
    },
};
