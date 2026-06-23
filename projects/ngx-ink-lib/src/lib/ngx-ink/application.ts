import {
    ɵinternalCreateApplication,
    provideBrowserGlobalErrorListeners,
    Type,
    ApplicationConfig,
    inject,
    signal,
} from '@angular/core';
import { BootstrapContext } from '@angular/platform-browser';
import { provideAppProviders, providePlatformTerminalProviders } from './platform';
import { InkService } from './ink.service';
import { AppContextService } from './service/app.context.service';
import {
    APP_CONTEXT_TOKEN,
    STDIN_CONTEXT_TOKEN,
    STDOUT_CONTEXT_TOKEN,
    STDERR_CONTEXT_TOKEN,
    FOCUS_CONTEXT_TOKEN,
    ANIMATION_CONTEXT_TOKEN,
    CURSOR_CONTEXT_TOKEN,
} from './contexts';
import { ACCESSIBILITY_CONTEXT_TOKEN } from './contexts/accessibility.context';
export const AppProviders = [
    provideAppProviders(),
    provideBrowserGlobalErrorListeners(),
    InkService,
    AppContextService,
    {
        provide: APP_CONTEXT_TOKEN,
        useFactory: () => inject(AppContextService).appContextValue,
    },
    {
        provide: STDIN_CONTEXT_TOKEN,
        useFactory: () => inject(AppContextService).stdinContextValue,
    },
    {
        provide: STDOUT_CONTEXT_TOKEN,
        useFactory: () => inject(AppContextService).stdoutContextValue,
    },
    {
        provide: STDERR_CONTEXT_TOKEN,
        useFactory: () => inject(AppContextService).stderrContextValue,
    },
    {
        provide: FOCUS_CONTEXT_TOKEN,
        useFactory: () => inject(AppContextService).focusContextValue,
    },
    {
        provide: ANIMATION_CONTEXT_TOKEN,
        useFactory: () => inject(AppContextService).animationContextValue,
    },
    {
        provide: CURSOR_CONTEXT_TOKEN,
        useFactory: () => inject(AppContextService).cursorContextValue,
    },
    {
        provide: ACCESSIBILITY_CONTEXT_TOKEN,
        useFactory: () =>
            signal({ isScreenReaderEnabled: inject(InkService).ink.isScreenReaderEnabled }),
    },
];
export async function bootstrapApplication(
    rootComponent: Type<unknown>,
    options?: ApplicationConfig,
    context?: BootstrapContext,
) {
    return ɵinternalCreateApplication({
        rootComponent: rootComponent,
        appProviders: [...AppProviders, ...(options?.providers ?? [])],
        platformProviders: providePlatformTerminalProviders(),
        platformRef: context?.platformRef,
    }).catch((err) => console.error(err));
}
