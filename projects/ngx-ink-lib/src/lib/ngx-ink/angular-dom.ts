/**
 * Angular DOM 适配层 — 包装 dom.ts，为 Angular 侧提供适配
 *
 * 设计：
 * - dom.ts 是底层，保持不变
 * - 此文件包装所有导出，添加 Angular 需要的字段/类型
 * - Angular 代码从此文件导入，不直接引用 dom.ts
 */

import * as dom from './dom.js';

// ---- 类型导出（重导出底层类型）----

export type {
    DOMElement as BaseDOMElement,
    TextNode as BaseTextNode,
    ElementNames,
    TextName,
    NodeNames,
    DOMNode,
    DOMNodeAttribute,
} from './dom.js';

// ---- 适配后的类型：添加 tagName 字段 ----

/** 适配后的 DOMElement，添加 tagName 字段（与 nodeName 相同）*/
/** childNodes 也重新定义为 ADOMNode[] 以兼容 Angular 侧类型系统 */
/** parentNode 重新定义为 ADOMNode | undefined 以维护类型链 */
export type ADOMElement = Omit<dom.DOMElement, 'childNodes' | 'parentNode' | 'staticNode'> & {
    tagName: string;
    childNodes: ADOMNode[];
    parentNode: ADOMElement | undefined;
    staticNode?: ADOMElement;
    elementName?: string;
};

/** 适配后的 TextNode，添加 tagName 字段 */
/** parentNode 重新定义为 ADOMNode | undefined 以维护类型链 */
export type ADOMTextNode = dom.TextNode & {
    tagName: string;
    parentNode: ADOMElement | undefined;
};

/** 适配后的 DOMNode 联合类型 */
export type ADOMNode = ADOMElement | ADOMTextNode;

// ---- 包装的函数导出 ----

/**
 * 创建元素节点 — 包装 dom.createNode
 * 返回值添加 tagName 字段（与 nodeName 相同）
 */
export const createNode = (nodeName: dom.ElementNames): ADOMElement => {
    const node = dom.createNode(nodeName);
    return {
        ...node,
        tagName: nodeName,
    } as unknown as ADOMElement;
};

/**
 * 创建文本节点 — 包装 dom.createTextNode
 * 返回值添加 tagName 字段（固定为 'text'）
 */
export const createTextNode = (text: string): ADOMTextNode => {
    const node = dom.createTextNode(text);
    return {
        ...node,
        tagName: '#text',
    } as unknown as ADOMTextNode;
};

/** 包装 dom.setAttribute */
export const setAttribute = dom.setAttribute;

/** 包装 dom.setStyle */
export const setStyle = dom.setStyle;

/** 包装 dom.squashTextNodes（将 ADOMElement 转换为 DOMElement 使用）*/
import squashTextNodesRaw from './squash-text-nodes.js';

export const squashTextNodes = (node: ADOMElement): string =>
    // ADOMElement extends DOMElement, so we can safely cast
    squashTextNodesRaw(node as any);

/** 包装 dom.insertBeforeNode */
export const insertBeforeNode = dom.insertBeforeNode;

/** 包装 dom.removeChildNode */
export const removeChildNode = dom.removeChildNode;

/** 包装 dom.createTextNode（保留原始签名）*/
export { createTextNode as rawCreateTextNode } from './dom.js';

/** 重导出所有 dom.ts 的其他工具函数 */
export { addLayoutListener, emitLayoutListeners, setTextNodeValue } from './dom.js';
