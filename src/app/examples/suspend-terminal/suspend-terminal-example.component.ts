import { Component, signal } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import { useInput, useApp } from '@cyia/ngx-lib';
import { spawn } from 'node:child_process';
import process from 'node:process';

const runChild = async (command: string, args: string[]): Promise<void> =>
    new Promise((resolve, reject) => {
        // With stdio: 'inherit' the child takes full ownership of the terminal, which
        // is exactly why Ink must release it via suspendTerminal first.
        const child = spawn(command, args, { stdio: 'inherit' });
        child.on('exit', () => {
            resolve();
        });
        child.on('error', reject);
    });

@Component({
    selector: 'ink-suspend-terminal-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './suspend-terminal-example.component.html',
})
export class SuspendTerminalExampleComponent {
    private readonly app = useApp();
    counter = signal(0);
    status = signal('ready');

    constructor() {
        useInput((input: string) => {
            if (input === 'q') {
                this.app().exit();
                return;
            }

            if (input === '+') {
                this.counter.update((value: number) => value + 1);
                return;
            }

            if (input === 'e' || input === 'r') {
                void (async () => {
                    this.status.set('suspended — child owns the terminal');

                    try {
                        await this.app().suspendTerminal(async () => {
                            if (input === 'e') {
                                const editor = process.env['EDITOR'] ?? 'vi';
                                await runChild(editor, []);
                            } else {
                                await runChild('sh', [
                                    '-c',
                                    String.raw`printf "Child process owns the terminal.\nType something and press Enter: "; read -r line; printf "You typed: %s\n" "$line"`,
                                ]);
                            }
                        });

                        this.status.set('resumed — Ink redrew and the counter is preserved');
                    } catch (error) {
                        this.status.set(`child failed: ${(error as Error).message}`);
                    }
                })();
            }
        });
    }
}
