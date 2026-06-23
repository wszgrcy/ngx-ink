/**
 * InkVNode — ADOMNode 的向后兼容别名
 *
 * 注意：InkVNode 现在是 ADOMNode 的类型别名，保持与现有代码的兼容性。
 * 新的节点创建应使用适配层 angular-dom.ts 中的 createNode / createTextNode。
 */
export type ADOMNode = import('./angular-dom.js').ADOMNode;

// 从适配层导出包装函数（添加 tagName 字段）
export { createNode, createTextNode, setAttribute, setStyle } from './angular-dom.js';

// 导出底层 DOM 相关类型（保持兼容）
export type { DOMElement, TextNode, ElementNames, TextName, NodeNames } from './dom.js';
