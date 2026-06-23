import { DestroyRef, inject } from '@angular/core';
import { CURSOR_CONTEXT_TOKEN } from '../contexts/cursor.context.js';
import type { CursorPosition } from '../log-update.js';

/**
A React hook that returns methods to control the terminal cursor position.

Setting a cursor position makes the cursor visible at the specified coordinates (relative to the Ink output origin). This is useful for IME (Input Method Editor) support, where the composing character is displayed at the cursor location.

Pass `undefined` to hide the cursor.
*/
export function useCursor() {
    const cursorContext = inject(CURSOR_CONTEXT_TOKEN);
    const setCursorPosition = (position: CursorPosition | undefined) => {
        cursorContext().setCursorPosition(position);
    };
    inject(DestroyRef).onDestroy(() => {
        cursorContext().setCursorPosition(undefined);
    });
    return {
        setCursorPosition,
    };
}
