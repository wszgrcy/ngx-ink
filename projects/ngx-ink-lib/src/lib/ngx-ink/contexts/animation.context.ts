import { InjectionToken, signal, Signal } from '@angular/core';

export type AnimationContextValue = {
    readonly renderThrottleMs: number;
    readonly subscribe: (
        callback: (currentTime: number) => void,
        interval: number,
    ) => {
        readonly startTime: number;
        readonly unsubscribe: () => void;
    };
};

const defaultAnimationContext: AnimationContextValue = {
    renderThrottleMs: 0,
    subscribe() {
        return {
            startTime: 0,
            unsubscribe() {},
        };
    },
};

export const ANIMATION_CONTEXT_TOKEN = new InjectionToken<Signal<AnimationContextValue>>(
    'AnimationContext',
    { factory: () => signal(defaultAnimationContext) },
);
