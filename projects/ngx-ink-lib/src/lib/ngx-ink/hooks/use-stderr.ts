import { inject } from '@angular/core';
import { STDERR_CONTEXT_TOKEN } from '../contexts/stderr.context.js';

/**
 * 返回 stderr 流
 */
export function useStderr() {
    return inject(STDERR_CONTEXT_TOKEN);
}
