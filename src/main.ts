import { App } from './app/app';

import { bootstrapApplication, InkOption, InkOptionToken } from '@cyia/ngx-lib';
bootstrapApplication(App, {
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
                alternateScreen: true,
            } as InkOption,
        },
    ],
}).catch((err) => console.error(err));
