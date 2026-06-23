import { InjectionToken, signal, Signal } from '@angular/core';

export type StderrContextValue = {
    /**
	Stderr stream passed to `render()` in `options.stderr` or `process.stderr` by default.
	*/
    readonly stderr: NodeJS.WriteStream;

    /**
	Write any string to stderr while preserving Ink's output. It's useful when you want to display external information outside of Ink's rendering and ensure there's no conflict between the two. It's similar to `<Static>`, except it can't accept components; it only works with strings.
	*/
    readonly write: (data: string) => void;
};

const defaultStderrContext: StderrContextValue = {
    stderr: process.stderr,
    write() {},
};

export const STDERR_CONTEXT_TOKEN = new InjectionToken<Signal<StderrContextValue>>(
    'StderrContext',
    { factory: () => signal(defaultStderrContext) },
);
