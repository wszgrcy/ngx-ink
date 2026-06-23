import { inject } from '@angular/core';
import { STDIN_CONTEXT_TOKEN } from '../contexts/stdin.context.js';

/**
 * 返回 stdin 流和 stdin 相关工具
 */
export function useStdin() {
    return inject(STDIN_CONTEXT_TOKEN);
}

/**
 * 返回完整的 stdin context（含 internal 属性）
 */
export function useStdinContext() {
    return inject(STDIN_CONTEXT_TOKEN);
}
