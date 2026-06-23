import { Component } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import { useInput, useFocusManager } from '@cyia/ngx-lib';
import { ItemComponent } from './item.component';

@Component({
    selector: 'ink-use-focus-with-id-example',
    standalone: true,
    imports: [BoxComponent, TextComponent, ItemComponent],
    templateUrl: './use-focus-with-id-example.component.html',
})
export class UseFocusWithIdExampleComponent {
    private readonly focusManager = useFocusManager();

    constructor() {
        useInput((input) => {
            if (input === '1') {
                this.focusManager().focus('1');
            }

            if (input === '2') {
                this.focusManager().focus('2');
            }

            if (input === '3') {
                this.focusManager().focus('3');
            }
        });
    }
}
