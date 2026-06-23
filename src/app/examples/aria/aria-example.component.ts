import { Component, signal } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import { useInput } from '@cyia/ngx-lib';

@Component({
    selector: 'ink-aria-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './aria-example.component.html',
})
export class AriaExampleComponent {
    isChecked = signal(false);

    constructor() {
        useInput((key: any) => {
            if (key === ' ') {
                this.isChecked.update((v) => !v);
            }
        });
    }
}
