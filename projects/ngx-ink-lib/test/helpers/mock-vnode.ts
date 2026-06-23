import type { InkVNode, DOMElement } from '../../src/lib/ngx-ink/vnode';
import { createNode, createTextNode } from '../../src/lib/ngx-ink/vnode';

/**
 * Create a plain text node
 */
export function textNode(content: string): InkVNode {
    return createTextNode(content);
}

/**
 * Create a <Text> component node (ink-text element)
 */
export function textComponent(...children: InkVNode[]): InkVNode {
    const vnode = createNode('ink-text');
    vnode.childNodes = children;
    return vnode;
}

/**
 * Create a <Box> component node
 */
export function boxComponent(...children: InkVNode[]): InkVNode {
    const vnode = createNode('ink-box');
    vnode.childNodes = children;
    return vnode;
}

/**
 * Apply styles to a vnode
 */
export function withStyles(vnode: InkVNode, styles: Record<string, string | number>): InkVNode {
    Object.assign((vnode as DOMElement).style ?? {}, styles);
    return vnode;
}

/**
 * Apply props to a vnode (merges with existing attributes)
 */
export function withProps(vnode: InkVNode, props: Record<string, unknown>): InkVNode {
    Object.assign((vnode as DOMElement).attributes ?? {}, props);
    return vnode;
}

/**
 * Convenience: create a styled text node with optional props
 */
export function styledTextNode(
    text: string,
    style?: Record<string, unknown>,
    props?: Record<string, unknown>,
): InkVNode {
    const vnode = createTextNode(text);
    if (style) {
        Object.assign(
            vnode.style ?? {},
            Object.fromEntries(
                Object.entries(style).map(([k, v]) => [k, typeof v === 'number' ? v : String(v)]),
            ),
        );
    }
    if (props) {
        Object.assign((vnode as DOMElement).attributes ?? {}, props);
    }
    return vnode;
}
