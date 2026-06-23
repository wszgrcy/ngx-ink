import { effect, computed, inject, Signal } from '@angular/core';
import { FOCUS_CONTEXT_TOKEN } from '../contexts/focus.context.js';
import { useStdin } from './use-stdin.js';

export type FocusOptions = {
    /**
	Enable or disable this component's focus, while still maintaining its position in the list of focusable components.
	*/
    isActive?: boolean;

    /**
	Auto-focus this component if there's no active (focused) component right now.
	*/
    autoFocus?: boolean;

    /**
	Assign an ID to this component, so it can be programmatically focused with `focus(id)`.
	*/
    id?: string;
};

export type FocusResult = {
    /**
	Determines whether this component is focused.
	*/
    isFocused: boolean;

    /**
	Allows focusing a specific element with the provided `id`.
	*/
    focus: (id: string) => void;
};

/**
 * An Angular hook that returns focus state and focus controls for the current component.
 * A component that uses the `useFocus` hook becomes "focusable" to Ink, so when the user presses Tab,
 * Ink will switch focus to this component. If there are multiple components that execute the `useFocus` hook,
 * focus will be given to them in the order in which these components are rendered.
 */
export function useFocus(options?: Signal<FocusOptions>): Signal<FocusResult> {
    const resolvedOptions$ = computed(() => options?.() ?? {});
    const isActive$$ = computed(() => resolvedOptions$().isActive ?? true);
    const autoFocus$$ = computed(() => resolvedOptions$().autoFocus ?? false);
    const customId$ = computed(() => resolvedOptions$().id);
    const stdinCtx = useStdin();
    const focusContext = inject(FOCUS_CONTEXT_TOKEN);
    const id$ = computed(() => customId$() ?? Math.random().toString().slice(2, 7));
    const add$$ = computed(() => focusContext().add);
    const remove$$ = computed(() => focusContext().remove);
    const activate$$ = computed(() => focusContext().activate);
    const deactivate$$ = computed(() => focusContext().deactivate);
    const activeId$ = computed(() => focusContext().activeId);
    const focus$ = computed(() => focusContext().focus);

    effect((onCleanup) => {
        const id = id$();
        add$$()(id, { autoFocus: autoFocus$$() });
        onCleanup(() => {
            remove$$()(id);
        });
    });

    effect(() => {
        const id = id$();
        if (isActive$$()) {
            activate$$()(id);
        } else {
            deactivate$$()(id);
        }
    });

    effect((onCleanup) => {
        const ctx = stdinCtx();
        const isRawModeSupportedValue = ctx.isRawModeSupported;

        if (!isRawModeSupportedValue || !isActive$$()) {
            return;
        }

        ctx.setRawMode(true);

        onCleanup(() => {
            ctx.setRawMode(false);
        });
    });

    return computed((): FocusResult => {
        const id = id$();
        const activeId = activeId$();
        const focus = focus$();

        return {
            isFocused: Boolean(id) && activeId === id,
            focus,
        };
    });
}
