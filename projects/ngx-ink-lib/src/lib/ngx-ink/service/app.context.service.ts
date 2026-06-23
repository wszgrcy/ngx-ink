import EventEmitter from 'events';
import { inject, signal, effect, computed, DestroyRef, Injectable } from '@angular/core';
import { InkService } from '../ink.service';
import { createInputParser } from '../input-parser';
import cliCursor from 'cli-cursor';

// Context Tokens

const tab = '\t';
const shiftTab = '\u001B[Z';
const escape = '\u001B';

type AnimationSubscriber = {
    readonly callback: (currentTime: number) => void;
    readonly interval: number;
    readonly startTime: number;
    nextDueTime: number;
};

type Focusable = {
    readonly id: string;
    readonly isActive: boolean;
};

/**
 * Ink App Service - manages all app context state and provides context values.
 */
@Injectable()
export class AppContextService {
    // ========== 所有其他成员都是私有 (not exposed publicly) ==========
    private readonly isFocusEnabled = signal(true);
    private readonly activeFocusId = signal<string | undefined>(undefined);
    private readonly focusables = signal<Focusable[]>([]);

    // References (Angular doesn't need useRef pattern, but keep object refs where needed)
    private focusablesCountRef = 0;
    private readonly animationSubscribersRef = new Map<
        (currentTime: number) => void,
        AnimationSubscriber
    >();
    private animationTimerRef: ReturnType<typeof setTimeout> | undefined = undefined;

    private rawModeEnabledCount = 0;
    private pendingDisableRawModeRef = false;
    private bracketedPasteModeEnabledCount = 0;
    private readonly internal_eventEmitter = new EventEmitter();

    private readableListenerRef: (() => void) | undefined = undefined;
    private inputParser = createInputParser();
    private pendingInputFlushRef: NodeJS.Timeout | undefined = undefined;

    private readonly pendingInputFlushDelayMilliseconds = 20;

    // Injected dependencies
    private readonly inkService = inject(InkService);
    private readonly destroyRef = inject(DestroyRef);

    // Extract props from config and ink instance
    private readonly config = this.inkService.config;
    private readonly ink = this.inkService.ink;

    private readonly stdin = this.config.stdin;
    private readonly stdout = this.config.stdout;
    private readonly stderr = this.config.stderr;
    private readonly exitOnCtrlC = this.config.exitOnCtrlC;
    private readonly interactive = this.config.interactive;
    private readonly maxFps = this.config.maxFps;
    private readonly renderThrottleMs =
        this.maxFps && this.maxFps > 0 ? Math.max(1, Math.ceil(1000 / this.maxFps)) : 0;

    private readonly setCursorPosition = this.ink.setCursorPosition.bind(this.ink);
    private readonly onWaitUntilRenderFlush = this.ink.waitUntilRenderFlush.bind(this.ink);
    private readonly onSuspendTerminal = this.ink.suspendTerminal.bind(this.ink);
    private readonly writeToStdout = this.ink.writeToStdout.bind(this.ink);
    private readonly writeToStderr = this.ink.writeToStderr.bind(this.ink);

    private readonly isRawModeSupported = this.stdin.isTTY;

    // Remembers which input modes were active so resumeInput can reinstate exactly
    // those after a terminal suspension, without touching the ref counts (the Angular
    // components still "own" raw mode/bracketed paste across the suspension).
    private suspendedInputStateRef = {
        rawMode: false,
        bracketedPaste: false,
    };

    constructor() {
        this.internal_eventEmitter.setMaxListeners(Infinity);
        this.initialize();
    }

    private initialize(): void {
        this.initCleanupEffects();
        this.initTabNavigationEffect();
        this.initInputControlRegistration();
    }

    // ========== handleExit ==========
    private handleExit = (errorOrResult?: unknown): void => {
        if (
            this.isRawModeSupported &&
            (this.rawModeEnabledCount > 0 || this.pendingDisableRawModeRef)
        ) {
            this.disableRawMode();
        }

        this.ink.handleAppExit(errorOrResult);
    };

    // ========== Animation utilities ==========
    private clearAnimationTimer = (): void => {
        if (!this.animationTimerRef) {
            return;
        }

        clearTimeout(this.animationTimerRef);
        this.animationTimerRef = undefined;
    };

    private scheduleAnimationTick = (): void => {
        this.clearAnimationTimer();

        if (this.animationSubscribersRef.size === 0) {
            return;
        }

        let nextDueTime = Number.POSITIVE_INFINITY;

        for (const subscriber of this.animationSubscribersRef.values()) {
            nextDueTime = Math.min(nextDueTime, subscriber.nextDueTime);
        }

        const delay = Math.max(0, nextDueTime - performance.now());
        this.animationTimerRef = setTimeout(() => {
            this.animationTimerRef = undefined;
            const currentTime = performance.now();

            for (const subscriber of this.animationSubscribersRef.values()) {
                if (currentTime < subscriber.nextDueTime) {
                    continue;
                }

                subscriber.callback(currentTime);
                const elapsedTime = currentTime - subscriber.startTime;
                const elapsedFrames = Math.floor(elapsedTime / subscriber.interval) + 1;
                subscriber.nextDueTime = subscriber.startTime + elapsedFrames * subscriber.interval;
            }

            this.scheduleAnimationTick();
        }, delay);
    };

    private animationSubscribe = (
        callback: (currentTime: number) => void,
        interval: number,
    ): { readonly startTime: number; readonly unsubscribe: () => void } => {
        const startTime = performance.now();
        this.animationSubscribersRef.set(callback, {
            callback,
            interval,
            startTime,
            nextDueTime: startTime + interval,
        });
        this.scheduleAnimationTick();

        return {
            startTime,
            unsubscribe: () => {
                this.animationSubscribersRef.delete(callback);

                if (this.animationSubscribersRef.size === 0) {
                    this.clearAnimationTimer();
                    return;
                }

                this.scheduleAnimationTick();
            },
        };
    };

    // ========== Input handling ==========
    private clearPendingInputFlush = (): void => {
        if (!this.pendingInputFlushRef) {
            return;
        }

        clearTimeout(this.pendingInputFlushRef);
        this.pendingInputFlushRef = undefined;
    };

    private detachReadableListener = (): void => {
        if (!this.readableListenerRef) {
            return;
        }

        this.stdin.removeListener('readable', this.readableListenerRef);
        this.readableListenerRef = undefined;
    };

    private clearInputState = (): void => {
        this.inputParser.reset();
        this.clearPendingInputFlush();
        this.detachReadableListener();
    };

    private disableRawMode = (): void => {
        this.pendingDisableRawModeRef = false;
        this.stdin.setRawMode(false);
        this.stdin.unref();
        this.rawModeEnabledCount = 0;
        this.clearInputState();
    };

    private handleInput = (input: string): void => {
        if (input === '\x03' && this.exitOnCtrlC) {
            this.handleExit();
            return;
        }

        if (input === escape && this.isFocusEnabled()) {
            this.activeFocusId.set(undefined);
        }
    };

    private emitInput = (input: string): void => {
        this.handleInput(input);
        this.internal_eventEmitter.emit('input', input);
    };

    private schedulePendingInputFlush = (): void => {
        this.clearPendingInputFlush();
        this.pendingInputFlushRef = setTimeout(() => {
            this.pendingInputFlushRef = undefined;
            const pendingEscape = this.inputParser.flushPendingEscape();
            if (!pendingEscape) {
                return;
            }

            this.emitInput(pendingEscape);
        }, this.pendingInputFlushDelayMilliseconds);
    };

    private handleReadable = (): void => {
        this.clearPendingInputFlush();
        let chunk;
        while ((chunk = this.stdin.read() as string | null) !== null) {
            const inputEvents = this.inputParser.push(chunk);
            for (const event of inputEvents) {
                if (typeof event === 'string') {
                    this.emitInput(event);
                } else {
                    if (this.internal_eventEmitter.listenerCount('paste') === 0) {
                        this.emitInput(event.paste);
                        continue;
                    }

                    this.internal_eventEmitter.emit('paste', event.paste);
                }
            }
        }

        if (this.inputParser.hasPendingEscape()) {
            this.schedulePendingInputFlush();
        }
    };

    private attachReadableListener = (): void => {
        if (this.readableListenerRef) {
            return;
        }

        this.readableListenerRef = this.handleReadable;
        this.stdin.addListener('readable', this.readableListenerRef);
    };

    private handleSetRawMode = (isEnabled: boolean): void => {
        if (!this.isRawModeSupported) {
            if (this.stdin === process.stdin) {
                throw new Error(
                    'Raw mode is not supported on the current process.stdin, which Ink uses as input stream by default.\nRead about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported',
                );
            } else {
                throw new Error(
                    'Raw mode is not supported on the stdin provided to Ink.\nRead about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported',
                );
            }
        }

        this.stdin.setEncoding('utf8');

        if (isEnabled) {
            if (this.rawModeEnabledCount === 0) {
                const isRawModeAlreadyEnabled = this.pendingDisableRawModeRef;
                this.pendingDisableRawModeRef = false;

                if (!isRawModeAlreadyEnabled) {
                    this.stdin.ref();
                    this.stdin.setRawMode(true);
                }

                this.attachReadableListener();
            }

            this.rawModeEnabledCount++;
            return;
        }

        if (this.rawModeEnabledCount === 0) {
            return;
        }

        if (--this.rawModeEnabledCount === 0) {
            this.clearInputState();

            this.pendingDisableRawModeRef = true;
            queueMicrotask(() => {
                if (!this.pendingDisableRawModeRef) {
                    return;
                }

                this.disableRawMode();
            });
        }
    };

    private handleSetBracketedPasteMode = (isEnabled: boolean): void => {
        if (!this.stdout.isTTY) {
            return;
        }

        if (isEnabled) {
            if (this.bracketedPasteModeEnabledCount === 0) {
                this.stdout.write('\u001B[?2004h');
            }

            this.bracketedPasteModeEnabledCount++;
            return;
        }

        if (this.bracketedPasteModeEnabledCount === 0) {
            return;
        }

        if (--this.bracketedPasteModeEnabledCount === 0) {
            this.stdout.write('\u001B[?2004l');
        }
    };

    // ========== Focus navigation ==========
    private findNextFocusable = (
        currentFocusables: Focusable[],
        currentActiveFocusId: string | undefined,
    ): string | undefined => {
        const activeIndex = currentFocusables.findIndex(
            (focusable) => focusable.id === currentActiveFocusId,
        );

        for (let index = activeIndex + 1; index < currentFocusables.length; index++) {
            const focusable = currentFocusables[index];

            if (focusable?.isActive) {
                return focusable.id;
            }
        }

        return undefined;
    };

    private findPreviousFocusable = (
        currentFocusables: Focusable[],
        currentActiveFocusId: string | undefined,
    ): string | undefined => {
        const activeIndex = currentFocusables.findIndex(
            (focusable) => focusable.id === currentActiveFocusId,
        );

        for (let index = activeIndex - 1; index >= 0; index--) {
            const focusable = currentFocusables[index];

            if (focusable?.isActive) {
                return focusable.id;
            }
        }

        return undefined;
    };

    private focusNext = (): void => {
        const currentFocusables = this.focusables();

        this.activeFocusId.update((currentActiveFocusId) => {
            const firstFocusableId = currentFocusables.find((focusable) => focusable.isActive)?.id;
            const nextFocusableId = this.findNextFocusable(currentFocusables, currentActiveFocusId);

            return nextFocusableId ?? firstFocusableId;
        });
    };

    private focusPrevious = (): void => {
        const currentFocusables = this.focusables();
        this.activeFocusId.update((currentActiveFocusId) => {
            const lastFocusableId = currentFocusables.findLast(
                (focusable) => focusable.isActive,
            )?.id;
            const previousFocusableId = this.findPreviousFocusable(
                currentFocusables,
                currentActiveFocusId,
            );

            return previousFocusableId ?? lastFocusableId;
        });
    };

    private enableFocus = (): void => {
        this.isFocusEnabled.set(true);
    };

    private disableFocus = (): void => {
        this.isFocusEnabled.set(false);
    };

    private focus = (id: string): void => {
        this.focusables.update((currentFocusables) => {
            const hasFocusableId = currentFocusables.some((focusable) => focusable?.id === id);

            if (hasFocusableId) {
                this.activeFocusId.set(id);
            }

            return currentFocusables;
        });
    };

    private addFocusable = (id: string, { autoFocus }: { autoFocus: boolean }): void => {
        this.focusables.update((currentFocusables) => {
            this.focusablesCountRef = currentFocusables.length + 1;

            return [
                ...currentFocusables,
                {
                    id,
                    isActive: true,
                },
            ];
        });

        if (autoFocus) {
            this.activeFocusId.update((currentActiveFocusId) => {
                if (!currentActiveFocusId) {
                    return id;
                }

                return currentActiveFocusId;
            });
        }
    };

    private removeFocusable = (id: string): void => {
        this.activeFocusId.update((currentActiveFocusId) => {
            if (currentActiveFocusId === id) {
                return undefined;
            }

            return currentActiveFocusId;
        });

        this.focusables.update((currentFocusables) => {
            const filtered = currentFocusables.filter((focusable) => focusable.id !== id);
            this.focusablesCountRef = filtered.length;

            return filtered;
        });
    };

    private activateFocusable = (id: string): void => {
        this.focusables.update((currentFocusables) =>
            currentFocusables.map((focusable) => {
                if (focusable.id !== id) {
                    return focusable;
                }

                return {
                    id,
                    isActive: true,
                };
            }),
        );
    };

    private deactivateFocusable = (id: string): void => {
        this.activeFocusId.update((currentActiveFocusId) => {
            if (currentActiveFocusId === id) {
                return undefined;
            }

            return currentActiveFocusId;
        });

        this.focusables.update((currentFocusables) =>
            currentFocusables.map((focusable) => {
                if (focusable.id !== id) {
                    return focusable;
                }

                return {
                    id,
                    isActive: false,
                };
            }),
        );
    };

    // ========== Effects ==========
    private initCleanupEffects = (): void => {};

    private initTabNavigationEffect = (): void => {
        effect((cleanupFn) => {
            const handleTabNavigation = (input: string): void => {
                if (!this.isFocusEnabled() || this.focusablesCountRef === 0) return;
                if (input === tab) {
                    this.focusNext();
                }

                if (input === shiftTab) {
                    this.focusPrevious();
                }
            };

            this.internal_eventEmitter.on('input', handleTabNavigation);
            const emitter = this.internal_eventEmitter;

            cleanupFn(() => {
                emitter.off('input', handleTabNavigation);
            });
        });
    };

    // Register input pause/resume in an insertion effect: it runs before every
    // passive effect (parent and child), so a child that calls suspendTerminal()
    // from its own effect always finds the input control already registered. A
    // normal effect would run too late (child effects fire before the parent's).
    private initInputControlRegistration() {
        const pauseInput = (): void => {
            const wasRawMode = this.isRawModeSupported && this.rawModeEnabledCount > 0;
            const wasBracketedPaste = this.bracketedPasteModeEnabledCount > 0;
            this.suspendedInputStateRef = {
                rawMode: wasRawMode,
                bracketedPaste: wasBracketedPaste,
            };

            if (wasBracketedPaste && this.stdout.isTTY) {
                try {
                    this.stdout.write('\u001B[?2004l');
                } catch {}
            }

            if (wasRawMode) {
                this.stdin.setRawMode(false);
                this.stdin.unref();
                this.clearInputState();
            }
        };

        const resumeInput = (): void => {
            const { rawMode, bracketedPaste } = this.suspendedInputStateRef;

            if (rawMode) {
                this.stdin.setEncoding('utf8');
                this.stdin.ref();
                this.stdin.setRawMode(true);
                this.attachReadableListener();
            }

            if (bracketedPaste && this.stdout.isTTY) {
                try {
                    this.stdout.write('\u001B[?2004h');
                } catch {}
            }
        };

        this.ink.registerInputControl(pauseInput, resumeInput);
    }

    // ========== Public Context Values ==========
    readonly appContextValue = computed(() => ({
        exit: this.handleExit,
        waitUntilRenderFlush: this.onWaitUntilRenderFlush,
        suspendTerminal: this.onSuspendTerminal,
    }));

    readonly stdinContextValue = computed(() => ({
        stdin: this.stdin,
        setRawMode: this.handleSetRawMode,
        setBracketedPasteMode: this.handleSetBracketedPasteMode,
        isRawModeSupported: this.isRawModeSupported,
        internal_exitOnCtrlC: this.exitOnCtrlC,
        internal_eventEmitter: this.internal_eventEmitter,
    }));

    readonly stdoutContextValue = computed(() => ({
        stdout: this.stdout,
        write: this.writeToStdout,
    }));

    readonly stderrContextValue = computed(() => ({
        stderr: this.stderr,
        write: this.writeToStderr,
    }));

    readonly cursorContextValue = computed(() => ({
        setCursorPosition: this.setCursorPosition,
    }));

    readonly focusContextValue = computed(() => ({
        activeId: this.activeFocusId(),
        add: this.addFocusable,
        remove: this.removeFocusable,
        activate: this.activateFocusable,
        deactivate: this.deactivateFocusable,
        enableFocus: this.enableFocus,
        disableFocus: this.disableFocus,
        focusNext: this.focusNext,
        focusPrevious: this.focusPrevious,
        focus: this.focus,
    }));

    readonly animationContextValue = computed(() => ({
        renderThrottleMs: this.renderThrottleMs,
        subscribe: this.animationSubscribe,
    }));

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.clearAnimationTimer();

        const canWriteToStdout = !this.stdout.destroyed && !this.stdout.writableEnded;

        if (this.interactive && canWriteToStdout) {
            cliCursor.show(this.stdout);
        }

        if (
            this.isRawModeSupported &&
            (this.rawModeEnabledCount > 0 || this.pendingDisableRawModeRef)
        ) {
            this.disableRawMode();
        }

        if (this.bracketedPasteModeEnabledCount > 0) {
            if (this.stdout.isTTY && canWriteToStdout) {
                this.stdout.write('\u001B[?2004l');
            }

            this.bracketedPasteModeEnabledCount = 0;
        }
    }
}
