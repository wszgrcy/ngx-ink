import { Component, signal } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import { useInput } from '@cyia/ngx-lib';

interface Message {
    id: number;
    text: string;
}

@Component({
    selector: 'ink-chat-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './chat-example.component.html',
})
export class ChatExampleComponent {
    private messageId = 0;
    messages = signal<Message[]>([]);
    input = signal('');

    constructor() {
        useInput((character, key) => {
            if (key.return) {
                if (this.input()) {
                    this.messages.update((msgs) => [
                        ...msgs,
                        {
                            id: this.messageId++,
                            text: `User: ${this.input()}`,
                        },
                    ]);
                    this.input.set('');
                }
            } else if (key.backspace || key.delete) {
                this.input.update((v) => v.slice(0, -1));
            } else {
                this.input.update((v) => v + character);
            }
        });
    }
}
