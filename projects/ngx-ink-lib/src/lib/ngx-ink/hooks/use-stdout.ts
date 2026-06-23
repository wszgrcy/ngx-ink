import { inject } from '@angular/core';
import { STDOUT_CONTEXT_TOKEN } from '../contexts/stdout.context.js';

/**
 * 返回 stdout 流，Ink 应用在此渲染
 */
export function useStdout() {
    return inject(STDOUT_CONTEXT_TOKEN);
}
