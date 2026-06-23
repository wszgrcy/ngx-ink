import { InjectionToken, signal, Signal } from '@angular/core';
import { type LiteralUnion } from 'type-fest';
import { type ForegroundColorName } from 'ansi-styles';

export type BackgroundColor = LiteralUnion<ForegroundColorName, string>;

export const BACKGROUND_CONTEXT_TOKEN = new InjectionToken<Signal<BackgroundColor | undefined>>(
    'BackgroundContext',
    { factory: () => signal(undefined) },
);
