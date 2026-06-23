import { InjectionToken, signal, Signal } from '@angular/core';

export type StdoutContextValue = {
    /**
	Stdout stream passed to `render()` in `options.stdout` or `process.stdout` by default.
	*/
    readonly stdout: NodeJS.WriteStream;

    /**
	Write any string to stdout while preserving Ink's output. It's useful when you want to display external information outside of Ink's rendering and ensure there's no conflict between the two. It's similar to `<Static>`, except it can't accept components; it only works with strings.
	*/
    readonly write: (data: string) => void;
};

const defaultStdoutContext: StdoutContextValue = {
    stdout: process.stdout,
    write() {},
};

export const STDOUT_CONTEXT_TOKEN = new InjectionToken<Signal<StdoutContextValue>>(
    'StdoutContext',
    { factory: () => signal(defaultStdoutContext) },
);
