import { Component, signal } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import { useInput, useApp } from '@cyia/ngx-lib';

@Component({
    selector: 'ink-use-input-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './use-input-example.component.html',
})
export class UseInputExampleComponent {
    private readonly app = useApp();
    x = signal(1);
    y = signal(1);

    constructor() {
        useInput((input: string, key: any) => {
            if (input === 'q') {
                this.app().exit();
            }

            if (key.leftArrow) {
                this.x.update((current: number) => Math.max(1, current - 1));
            }

            if (key.rightArrow) {
                this.x.update((current: number) => Math.min(20, current + 1));
            }

            if (key.upArrow) {
                this.y.update((current: number) => Math.max(1, current - 1));
            }

            if (key.downArrow) {
                this.y.update((current: number) => Math.min(10, current + 1));
            }
        });
    }
}
