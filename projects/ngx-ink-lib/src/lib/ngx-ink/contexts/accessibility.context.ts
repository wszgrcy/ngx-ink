import { InjectionToken, signal, Signal } from '@angular/core';

export type AccessibilityContextValue = {
    isScreenReaderEnabled: boolean;
};

const defaultAccessibilityContext: AccessibilityContextValue = {
    isScreenReaderEnabled: false,
};

export const ACCESSIBILITY_CONTEXT_TOKEN = new InjectionToken<Signal<AccessibilityContextValue>>(
    'AccessibilityContext',
    { factory: () => signal(defaultAccessibilityContext) },
);
