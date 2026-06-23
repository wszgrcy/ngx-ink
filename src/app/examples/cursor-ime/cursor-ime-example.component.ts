import { Component, signal, effect } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import { useInput, useCursor } from '@cyia/ngx-lib';
import stringWidth from 'string-width';

@Component({
    selector: 'ink-cursor-ime-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './cursor-ime-example.component.html',
})
export class CursorImeExampleComponent {
    text = signal('');
    readonly prompt = '> ';
    private readonly cursor = useCursor();

    constructor() {
        useInput((input, key) => {
            if (key.backspace || key.delete) {
                this.text.update((current) => current.slice(0, -1));
                return;
            }

            if (!key.ctrl && !key.meta && input) {
                this.text.update((current) => current + input);
            }
        });

        // Update cursor position whenever text changes
        effect(() => {
            this.cursor.setCursorPosition({ x: stringWidth(this.prompt + this.text()), y: 1 });
        });
    }
}
