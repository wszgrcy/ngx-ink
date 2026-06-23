import { InjectionToken, signal, Signal } from '@angular/core';
import type { CursorPosition } from '../log-update.js';

export type CursorContextValue = {
    /**
	Set the cursor position relative to the Ink output.

	Pass `undefined` to hide the cursor.
	*/
    readonly setCursorPosition: (position: CursorPosition | undefined) => void;
};

const defaultCursorContext: CursorContextValue = {
    setCursorPosition() {},
};

export const CURSOR_CONTEXT_TOKEN = new InjectionToken<Signal<CursorContextValue>>(
    'CursorContext',
    { factory: () => signal(defaultCursorContext) },
);
