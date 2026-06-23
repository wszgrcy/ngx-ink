import { platformCore } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
    AppProviders,
    InkOption,
    InkOptionToken,
    providePlatformTerminalProviders,
} from '@cyia/ngx-lib';
import { TextTestComponent } from './fixture/text.component';
import { TerminalTestingModule } from '../util/test-module';
import { renderToString } from '../helpers/render-to-string';
globalThis.Node = class {} as any;
describe('hello', () => {
    describe.skip('component', () => {
        beforeEach(() => {
            TestBed.initTestEnvironment(
                [TerminalTestingModule],
                platformCore(providePlatformTerminalProviders()),
                {
                    errorOnUnknownElements: true,
                    errorOnUnknownProperties: true,
                },
            );
            TestBed.configureTestingModule({
                imports: [TextTestComponent],
                providers: [
                    ...AppProviders,
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
                        } as InkOption,
                    },
                ],
            });
        });
        it('hello', () => {
            const fixture = TestBed.createComponent(TextTestComponent);
            fixture.detectChanges();
            expect(fixture.elementRef).ok;
        });
    });
    describe('print', () => {
        it('hello', async () => {
            const result = await renderToString(TextTestComponent);
            expect(result).to.eq('aaa');
        });
    });
});
