import { computed, inject } from '@angular/core';
import { ACCESSIBILITY_CONTEXT_TOKEN } from '../contexts/accessibility.context.js';

/**
 * 判断屏幕阅读器是否启用
 */
export function useIsScreenReaderEnabled() {
    const accessibilityContext = inject(ACCESSIBILITY_CONTEXT_TOKEN);
    return computed(() => accessibilityContext().isScreenReaderEnabled);
}
