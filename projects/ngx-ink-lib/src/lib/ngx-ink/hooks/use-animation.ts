import { signal, computed, inject, Signal, afterRenderEffect } from '@angular/core';
import { ANIMATION_CONTEXT_TOKEN } from '../contexts/animation.context.js';

const defaultAnimationInterval = 100;
const maximumTimerInterval = 2_147_483_647;
const zeroAnimState = { frame: 0, time: 0, delta: 0 };

export type AnimationOptions = {
    /**
	Time between ticks in milliseconds.

	@default 100
	*/
    readonly interval?: number;

    /**
	Whether the animation is running. When set to `false`, the animation stops. When toggled back to `true`, all values reset to `0`.

	@default true
	*/
    readonly isActive?: boolean;
};

export type AnimationResult = {
    /**
	Discrete counter that increments by 1 each interval. Useful for indexed sequences like spinner frames.
	*/
    readonly frame: number;

    /**
	Total elapsed time in milliseconds since the animation started or was last reset. Useful for continuous math-based animations like sine waves: `Math.sin(time / 1000 * Math.PI * 2)`.
	*/
    readonly time: number;

    /**
	Time in milliseconds since the previous rendered tick. Accounts for throttled renders. Useful for physics-based or velocity-driven motion: `position += speed * delta`.
	*/
    readonly delta: number;

    /**
	Resets `frame`, `time`, and `delta` to `0` and restarts timing from the current moment. Useful for one-shot animations triggered by events.
	*/
    readonly reset: () => void;
};

/**
A React hook that drives animations. Returns a frame counter, elapsed time, frame delta, and a reset function. All animations share a single timer internally, so multiple animated components consolidate into one render cycle.

@example
```
import {Text, useAnimation} from 'ink';

const Spinner = () => {
	const {frame} = useAnimation({interval: 80});
	const characters = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

	return <Text>{characters[frame % characters.length]}</Text>;
};
```
*/
export function useAnimation(options?: Signal<AnimationOptions>): Signal<AnimationResult> {
    const interval$$ = computed(() => options?.().interval ?? defaultAnimationInterval);
    const isActive$$ = computed(() => options?.().isActive ?? true);
    const safeInterval$$ = computed(() =>
        normalizeAnimationInterval(interval$$() ?? defaultAnimationInterval),
    );

    const animationContext = inject(ANIMATION_CONTEXT_TOKEN);
    const resetKey$ = signal(0);
    const animState$ = signal(zeroAnimState);
    const nextRenderTimeRef$ = signal(0);
    const lastRenderTimeRef$ = signal(0);

    const reset = () => {
        resetKey$.update((k) => k + 1);
    };
    afterRenderEffect({
        read: (onCleanup) => {
            const isActive = isActive$$();
            if (!isActive) {
                return;
            }
            resetKey$();

            const safeInterval = safeInterval$$();
            const ctx = animationContext();

            // Reset to zero immediately so any render that occurs between this
            // effect commit and the first tick shows zeros, not stale values.
            animState$.set(zeroAnimState);
            let startTime = 0;

            const { startTime: subscriberStartTime, unsubscribe } = ctx.subscribe((currentTime) => {
                const renderThrottleMs = ctx.renderThrottleMs;
                const isThrottled = renderThrottleMs > 0 && currentTime < nextRenderTimeRef$();

                if (isThrottled) {
                    return;
                }

                const elapsed = currentTime - startTime;
                const nextDelta = currentTime - lastRenderTimeRef$();

                lastRenderTimeRef$.set(currentTime);
                nextRenderTimeRef$.set(currentTime + renderThrottleMs);
                animState$.set({
                    frame: Math.floor(elapsed / safeInterval),
                    time: elapsed,
                    delta: nextDelta,
                });
            }, safeInterval);

            startTime = subscriberStartTime;
            lastRenderTimeRef$.set(subscriberStartTime);
            nextRenderTimeRef$.set(subscriberStartTime + ctx.renderThrottleMs);

            onCleanup(() => {
                unsubscribe();
            });
        },
    });

    // Return a single computed signal that reacts to all dependencies
    return computed(() => ({ ...animState$(), reset }));
}

function normalizeAnimationInterval(interval: number): number {
    if (!Number.isFinite(interval)) {
        return defaultAnimationInterval;
    }

    return Math.min(maximumTimerInterval, Math.max(1, interval));
}
