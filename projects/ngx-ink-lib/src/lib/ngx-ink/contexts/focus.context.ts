import { InjectionToken, signal, Signal } from '@angular/core';

export interface FocusEntry {
    autoFocus: boolean;
}

export type FocusContextValue = {
    readonly activeId?: string;
    readonly add: (id: string, options: { autoFocus: boolean }) => void;
    readonly remove: (id: string) => void;
    readonly activate: (id: string) => void;
    readonly deactivate: (id: string) => void;
    readonly enableFocus: () => void;
    readonly disableFocus: () => void;
    readonly focusNext: () => void;
    readonly focusPrevious: () => void;
    readonly focus: (id: string) => void;
};

const defaultFocusContext: FocusContextValue = {
    activeId: undefined,
    add() {},
    remove() {},
    activate() {},
    deactivate() {},
    enableFocus() {},
    disableFocus() {},
    focusNext() {},
    focusPrevious() {},
    focus() {},
};

export const FOCUS_CONTEXT_TOKEN = new InjectionToken<Signal<FocusContextValue>>('FocusContext', {
    factory: () => signal(defaultFocusContext),
});
