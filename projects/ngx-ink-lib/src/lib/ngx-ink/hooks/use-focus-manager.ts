import { inject, computed, Signal } from '@angular/core';
import { FOCUS_CONTEXT_TOKEN } from '../contexts/focus.context.js';
import type { FocusContextValue } from '../contexts/focus.context.js';

export type FocusManagerOutput = {
    /**
	Enable focus management for all components.
	*/
    enableFocus: FocusContextValue['enableFocus'];

    /**
	Disable focus management for all components. The currently active component (if there's one) will lose its focus.
	*/
    disableFocus: FocusContextValue['disableFocus'];

    /**
	Switch focus to the next focusable component. If there's no active component right now, focus will be given to the first focusable component. If the active component is the last in the list of focusable components, focus will be switched to the first focusable component.
	*/
    focusNext: FocusContextValue['focusNext'];

    /**
	Switch focus to the previous focusable component. If there's no active component right now, focus will be given to the first focusable component. If the active component is the first in the list of focusable components, focus will be switched to the last focusable component.
	*/
    focusPrevious: FocusContextValue['focusPrevious'];

    /**
	Switch focus to the element with provided `id`. If there's no element with that `id`, focus is not changed.
	*/
    focus: FocusContextValue['focus'];

    /**
	The ID of the currently focused component, or `undefined` if no component is focused.

	@example
	```tsx
	import {Text, useFocusManager} from 'ink';

	const Example = () => {
		const {activeId} = useFocusManager();

		return <Text>Focused: {activeId ?? 'none'}</Text>;
	};
	```
	*/
    activeId: FocusContextValue['activeId'];
};

/**
A React hook that returns methods to enable or disable focus management for all components or manually switch focus to the next or previous components.
*/
export function useFocusManager(): Signal<FocusManagerOutput> {
    const focusContext = inject(FOCUS_CONTEXT_TOKEN);

    return computed(() => {
        const ctx = focusContext();
        return {
            enableFocus: ctx.enableFocus,
            disableFocus: ctx.disableFocus,
            focusNext: ctx.focusNext,
            focusPrevious: ctx.focusPrevious,
            focus: ctx.focus,
            activeId: ctx.activeId,
        };
    });
}
