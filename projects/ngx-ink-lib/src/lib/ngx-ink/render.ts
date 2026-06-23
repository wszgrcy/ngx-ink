/**
 * 渲染入口 — 与 Ink API 一致
 *
 * 用法：
 *   import { render, CounterComponent } from './counter';
 *   const result = render(CounterComponent);
 *   result.rerender(NewComponent);
 *   result.unmount();
 */

import { Type } from '@angular/core';
import type { BootstrapContext } from '@angular/platform-browser';
import { bootstrapApplication } from './application.js';
import { InkOptionToken } from './ink.token.js';
import { Stream } from 'node:stream';
import { RenderMetrics } from './ink.js';
import { KittyKeyboardOptions } from './kitty-keyboard.js';
export type RenderOptions = {
    /**
	Output stream where the app will be rendered.

	@default process.stdout
	*/
    stdout?: NodeJS.WriteStream;

    /**
	Input stream where app will listen for input.

	@default process.stdin
	*/
    stdin?: NodeJS.ReadStream;

    /**
	Error stream.
	@default process.stderr
	*/
    stderr?: NodeJS.WriteStream;

    /**
	If true, each update will be rendered as separate output, without replacing the previous one.

	@default false
	*/
    debug?: boolean;

    /**
	Configure whether Ink should listen for Ctrl+C keyboard input and exit the app. This is needed in case `process.stdin` is in raw mode, because then Ctrl+C is ignored by default and the process is expected to handle it manually.

	@default true
	*/
    exitOnCtrlC?: boolean;

    /**
	Patch console methods to ensure console output doesn't mix with Ink's output.

	Note: Once unmount starts, Ink restores the native console before React cleanup runs. Teardown-time `console.*` output then follows the normal console behavior instead of being rerouted through Ink.

	@default true
	*/
    patchConsole?: boolean;

    /**
	Runs the given callback after each render and re-render with render metrics.

	Note: this callback runs after Ink commits a frame, but it does not wait for `stdout`/`stderr` stream callbacks.
	To run code after output is flushed, use `waitUntilRenderFlush()`.
	*/
    onRender?: (metrics: RenderMetrics) => void;

    /**
	Enable screen reader support. See https://github.com/vadimdemedes/ink/blob/master/readme.md#screen-reader-support

	@default process.env['INK_SCREEN_READER'] === 'true'
	*/
    isScreenReaderEnabled?: boolean;

    /**
	Maximum frames per second for render updates.
	This controls how frequently the UI can update to prevent excessive re-rendering.
	Higher values allow more frequent updates but may impact performance.

	@default 30
	*/
    maxFps?: number;

    /**
	Enable incremental rendering mode which only updates changed lines instead of redrawing the entire output.
	This can reduce flickering and improve performance for frequently updating UIs.

	@default false
	*/
    incrementalRendering?: boolean;

    /**
	Enable React Concurrent Rendering mode.

	When enabled:
	- Suspense boundaries work correctly with async data
	- `useTransition` and `useDeferredValue` are fully functional
	- Updates can be interrupted for higher priority work

	Note: Concurrent mode changes the timing of renders. Some tests may need to use `act()` to properly await updates. Reusing the same stdout across multiple `render()` calls without unmounting is unsupported. Call `unmount()` first if you need to change the rendering mode or create a fresh instance.

	@default false
	*/
    concurrent?: boolean;

    /**
	Configure kitty keyboard protocol support for enhanced keyboard input.
	Enables additional modifiers (super, hyper, capsLock, numLock) and
	disambiguated key events in terminals that support the protocol.

	@see https://sw.kovidgoyal.net/kitty/keyboard-protocol/
	*/
    kittyKeyboard?: KittyKeyboardOptions;

    /**
	Override automatic interactive mode detection.

	By default, Ink detects whether the environment is interactive based on CI detection (via [`is-in-ci`](https://github.com/sindresorhus/is-in-ci)) and `stdout.isTTY`. Most users should not need to set this.

	When non-interactive, Ink disables ANSI erase sequences, cursor manipulation, synchronized output, resize handling, and kitty keyboard auto-detection, writing only the final frame at unmount.

	Set to `false` to force non-interactive mode or `true` to force interactive mode when the automatic detection doesn't suit your use case.

	Note: Reusing the same stdout across multiple `render()` calls without unmounting is unsupported. Call `unmount()` first if you need to change this option or create a fresh instance.

	@default true (false if in CI or `stdout.isTTY` is falsy)
	*/
    interactive?: boolean;

    /**
	Render the app in the terminal's alternate screen buffer. When enabled, the app renders on a separate screen, and the original terminal content is restored when the app exits. This is the same mechanism used by programs like vim, htop, and less.

	Note: The terminal's scrollback buffer is not available while in the alternate screen. This is standard terminal behavior; programs like vim use the alternate screen specifically to avoid polluting the user's scrollback history.

	Note: Ink intentionally treats alternate-screen teardown output as disposable. It does not preserve or replay teardown-time frames, hook writes, or `console.*` output after restoring the primary screen.

	Only works in interactive mode. Ignored when `interactive` is `false` or in a non-interactive environment (CI, piped stdout).

	Note: Reusing the same stdout across multiple `render()` calls without unmounting is unsupported. Call `unmount()` first if you need to change this option or create a fresh instance.

	@default false
	*/
    alternateScreen?: boolean;
};
/**
 * 渲染结果
 */
export interface RenderResult {
    /** 用新 props 或组件重新渲染 */
    rerender(component: Type<any>): void;
    /** 卸载应用 */
    unmount(): void;
    /**
     * 返回一个 Promise，在应用卸载后 resolve。
     * 如果 unmount() 被手动调用，会在卸载相关的 stdout 写入完成后 resolve。
     */
    waitUntilExit(): Promise<void>;
}

/**
 * 渲染组件到终端
 */
export function render(component: Type<any>, options?: NodeJS.WriteStream | RenderOptions) {
    return bootstrapApplication(
        component,
        {
            providers: [
                {
                    provide: InkOptionToken,
                    useValue: {
                        stdout: process.stdout,
                        stdin: process.stdin,
                        stderr: process.stderr,
                        debug: false,
                        exitOnCtrlC: true,
                        patchConsole: true,
                        maxFps: 30,
                        incrementalRendering: false,
                        concurrent: false,
                        alternateScreen: false,
                        ...getOptions(options),
                    },
                },
            ],
        },
        {} as BootstrapContext,
    );
}
const getOptions = (stdout: NodeJS.WriteStream | RenderOptions | undefined = {}): RenderOptions => {
    if (stdout instanceof Stream) {
        return {
            stdout,
            stdin: process.stdin,
        };
    }

    return stdout;
};
export { render as default };
