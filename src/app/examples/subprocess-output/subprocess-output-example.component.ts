import { Component, signal, OnDestroy } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import childProcess from 'node:child_process';
import stripAnsi from 'strip-ansi';
const textDecoder = new TextDecoder();

@Component({
    selector: 'ink-subprocess-output-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './subprocess-output-example.component.html',
})
export class SubprocessOutputExampleComponent implements OnDestroy {
    output = signal('');
    private intervalId: ReturnType<typeof setInterval> | undefined;
    constructor() {
        const subProcess = childProcess.spawn('npm', ['run', 'example', 'examples/jest']);

        subProcess.stdout.on('data', (newOutput: Uint8Array) => {
            const lines = stripAnsi(textDecoder.decode(newOutput)).split('\n');
            this.output.set(lines.slice(-5).join('\n'));
        });
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
