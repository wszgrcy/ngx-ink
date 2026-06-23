import { Renderer2, RendererStyleFlags2 } from '@angular/core';
import type { ADOMElement, ADOMNode, ElementNames } from './angular-dom.js';
import { createNode, createTextNode, setAttribute, setStyle } from './angular-dom.js';

import Yoga from 'yoga-layout';
import applyStyles from './styles.js';
import {
    appendChildNode,
    insertBeforeNode,
    removeChildNode,
    measureTextNode,
    setTextNodeValue,
} from './dom.js';
const nodeList = new Set(['ink-root', 'ink-box', 'ink-text', 'ink-virtual-text']);

const resolveNodeForTextParent = (parent: ADOMNode, child: ADOMElement): void => {
    if (parent.nodeName === 'ink-text') {
        if (child.yogaNode) {
            child.parentNode?.yogaNode?.removeChild(child.yogaNode);
        }
        child.yogaNode = undefined;
    } else {
        if (!child.yogaNode && child.nodeName !== ('comment' as any)) {
            child.yogaNode = Yoga.Node.create();
            if (child.nodeName === 'ink-text') {
                child.yogaNode.setMeasureFunc(measureTextNode.bind(null, child));
            }
        }
    }
};
/**
 * 终端渲染器 — 将 Angular 模板编译输出转换为 DOMNode 树
 *
 * 关键设计：
 * - createElement('box') 创建 DOMNode（DOMElement），不操作真实 DOM
 * - setStyle/setAttribute 存储到节点上，不操作真实 DOM
 * - appendChild 构建节点树结构
 * - 所有节点共享同一个 root VNode
 */
export class TerminalRenderer implements Renderer2 {
    get data(): { [key: string]: any } {
        return {};
    }
    /** 根节点（整个应用只有一个，nodeName 'ink-root'）*/
    rootNode;
    mainNode;
    constructor(mainNode: ADOMElement, rootNode: ADOMElement) {
        this.mainNode = mainNode;
        this.rootNode = rootNode;
    }

    /**
     * 创建元素节点
     * Angular 模板编译调用: _r0 = ng.element('box') → nodeName 'ink-box'
     */
    createElement(name: string, namespace?: string | null): ADOMNode {
        // 将 name 映射到合法的 ElementNames
        const isCustomElement = !nodeList.has(name);
        const node = createNode(isCustomElement ? 'ink-box' : (name as ElementNames));
        if (isCustomElement) {
            node.style = { display: 'contents' };
            applyStyles(node.yogaNode!, node.style);
            // (node as any).debugName = name;
            node.elementName = name;
        }
        // 注册到节点映射

        return node;
    }

    /**
     * 创建文本节点
     * Angular 模板编译调用: _r1 = ng.createText('Hello')
     */
    createText(value: string): ADOMNode {
        const node = createTextNode(String(value));
        return node;
    }

    /**
     * 将子节点追加到父节点
     * Angular 模板编译调用: ng.appendChild(parent, child)
     *
     */
    appendChild(
        parent: ADOMNode | null,
        newChild: ADOMElement,
        insertBefore?: boolean | null,
    ): void {
        const target = (parent ?? this.rootNode) as ADOMElement;
        if (!target) return;

        resolveNodeForTextParent(target, newChild);
        appendChildNode(target, newChild);
    }

    /**
     * 在子节点列表之前插入新节点
     */
    insertBefore(parent: ADOMNode | null, newChild: ADOMElement, refChild: any): void {
        const target = (parent ?? this.rootNode) as ADOMElement;
        if (!target) return;

        resolveNodeForTextParent(target, newChild);
        insertBeforeNode(target, newChild, refChild);
    }

    /**
     * 移除子节点
     */
    removeChild(parent: ADOMNode | null, oldChild: ADOMNode): void {
        if (oldChild.parentNode) {
            removeChildNode(oldChild.parentNode, oldChild);
        }
    }

    /**
     * 获取子节点的下一个兄弟节点
     */
    nextSibling(node: ADOMNode): any {
        const parent = node.parentNode;
        if (!parent) return null;

        const index = parent.childNodes.indexOf(node as ADOMNode);
        if (index >= 0 && index + 1 < parent.childNodes.length) {
            return parent.childNodes[index + 1];
        }
        return null;
    }

    /**
     * 获取节点的父节点
     */
    parentNode(node: ADOMNode): any {
        return node.parentNode;
    }

    /**
     * 设置属性（@Input()、[attr.aria-label] 等）
     */
    setAttribute(el: ADOMElement, name: string, value: string): void {
        setAttribute(el as any, name, value);
    }

    /**
     * 移除属性
     * 注意：DOMNode 没有直接 removeAttribute 方法，这里通过 attributes 操作
     */
    removeAttribute(el: ADOMNode, name: string, namespace?: string | null): void {
        delete (el as any).attributes[name];
    }

    /**
     * 设置属性值（用于动态绑定 [prop]="value"）
     */
    setProperty(node: ADOMElement, name: string, value: any): void {
        if (name === 'style') {
            setStyle(node, value);
            if (node.yogaNode) {
                applyStyles(node.yogaNode, value);
            }
        } else if (name === 'internal_transform') {
            node.internal_transform = value;
        } else if (name === 'internal_static') {
            node.internal_static = true;
            this.mainNode.isStaticDirty = true;
            this.mainNode.staticNode = node;
        } else {
            setAttribute(node, name, value);
        }
    }

    /**
     * 设置样式（[style.xxx]="value"）
     */
    setStyle(el: ADOMNode, style: string, value: any, flags?: RendererStyleFlags2): void {
        el.style ??= {};
        (el.style as any)[style] = value;
        if (el.yogaNode) {
            applyStyles(el.yogaNode, el.style);
        }
    }

    /**
     * 移除样式
     */
    removeStyle(el: ADOMNode, style: string, flags?: RendererStyleFlags2): void {
        delete (el as any).style[style];
    }

    /**
     * 添加 CSS 类（虽然终端不渲染 CSS，但可用于 ARIA 或语义）
     */
    addClass(el: ADOMNode, name: string): void {}

    /**
     * 移除 CSS 类
     */
    removeClass(el: ADOMNode, name: string): void {}

    /**
     * 设置元素内容（用于插值表达式 {{value}}）
     */
    selectRootElement(selector: string | Element): ADOMNode {
        return this.rootNode;
    }

    /**
     * 设置文本节点的值
     */
    setValue(node: ADOMNode, value: string): void {
        if (node.nodeName === '#text') {
            if (node.nodeValue !== value) {
                setTextNodeValue(node, value);
            }
        }
    }

    /**
     * 监听事件（@click、(keydown) 等）
     */
    listen(
        target: any,
        eventName: string,
        callback: (event: any) => boolean | void,
        options?: any,
    ): () => void {
        // 在终端环境中，listen 需要绑定到 stdin 事件
        // 这里返回一个占位函数，实际实现需要在 platform 层配置
        return () => {}; // cleanup 占位
    }

    /**
     * 销毁节点
     */
    destroyNode(node: ADOMNode) {
        if (node.internal_static && this.mainNode.staticNode === node) {
            this.mainNode.staticNode = undefined;
        }
    }

    /**
     * 获取根 VNode（用于测试/调试）
     */
    getRootVNode(): ADOMNode {
        return this.rootNode;
    }

    /**
     * 创建注释节点（终端环境中不需要）
     */
    createComment(value: string): any {
        const node = createNode('comment' as any);
        node.yogaNode = undefined;
        return node;
    }

    /**
     * 销毁渲染器（应用卸载时调用）
     */
    destroy(): void {}
}
