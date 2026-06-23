import { inject } from '@angular/core';
import { APP_CONTEXT_TOKEN } from '../contexts/app.context.js';

/**
A React hook that returns app lifecycle methods like `exit()` and `waitUntilRenderFlush()`.
*/
export function useApp() {
    return inject(APP_CONTEXT_TOKEN);
}
