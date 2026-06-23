import { signal, type Signal, effect } from '@angular/core';
import { getWindowSize } from '../utils.js';
import { useStdout } from './use-stdout.js';

/**
Dimensions of the terminal window.
*/
export type WindowSize = {
    /**
	Number of columns (horizontal character cells).
	*/
    readonly columns: number;

    /**
	Number of rows (vertical character cells).
	*/
    readonly rows: number;
};

/**
An Angular function that returns the current terminal window dimensions and re-renders the component whenever the terminal is resized.
*/
export function useWindowSize(): Signal<WindowSize> {
    const stdoutCtx = useStdout();
    const size$ = signal<WindowSize>(getWindowSize(stdoutCtx().stdout));

    // 监听 resize 事件，自动更新 signal

    effect((onCleanup) => {
        const ctx = stdoutCtx();
        const onResize = () => {
            size$.set(getWindowSize(ctx.stdout));
        };
        ctx.stdout.on('resize', onResize);
        onCleanup(() => {
            ctx.stdout.off('resize', onResize);
        });
    });

    return size$.asReadonly();
}
