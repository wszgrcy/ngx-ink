import { computed, effect, inject, Signal } from '@angular/core';
import { STDIN_CONTEXT_TOKEN } from '../contexts/stdin.context.js';

export type Options = {
    /**
	Enable or disable the paste handler. Useful when multiple components use `usePaste` and only one should be active at a time.

	@default true
	*/
    isActive?: boolean;
};

/**
An Angular hook that calls `handler` whenever the user pastes text in the terminal. Bracketed paste mode (`\x1b[?2004h`) is automatically enabled while the hook is active, so pasted text arrives as a single string rather than being misinterpreted as individual key presses.

`usePaste` and `useInput` can be used together in the same component. They operate on separate event channels, so paste content is never forwarded to `useInput` handlers when `usePaste` is active.

```typescript
import {useInput, usePaste} from '@cyia/ngx-ink';

const MyInput = () => {
  useInput((input, key) => {
    // Only receives typed characters and key events, not pasted text.
    if (key.return) {
      // Submit
    }
  });

  usePaste((text) => {
    // Receives the full pasted string, including newlines.
    console.log('Pasted:', text);
  });

  return …
};
```
*/
export function usePaste(handler: (text: string) => void, options?: Signal<Options>): void {
    const stdinContext = inject(STDIN_CONTEXT_TOKEN);

    const isActive$$ = computed(() => options?.().isActive ?? true);

    effect((onCleanup) => {
        if (isActive$$() === false) {
            return;
        }

        const ctx = stdinContext();
        ctx.setRawMode(true);
        ctx.setBracketedPasteMode(true);

        onCleanup(() => {
            ctx.setRawMode(false);
            ctx.setBracketedPasteMode(false);
        });
    });

    const handlePaste = (text: string) => {
        handler(text);
    };

    effect((onCleanup) => {
        if (isActive$$() === false) {
            return;
        }

        const ctx = stdinContext();
        ctx.internal_eventEmitter.on('paste', handlePaste);

        onCleanup(() => {
            ctx.internal_eventEmitter.removeListener('paste', handlePaste);
        });
    });
}
