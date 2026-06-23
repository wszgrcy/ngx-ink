import { Component } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import { ItemComponent } from './item.component';

@Component({
    selector: 'ink-use-focus-example',
    standalone: true,
    imports: [BoxComponent, TextComponent, ItemComponent],
    templateUrl: './use-focus-example.component.html',
})
export class UseFocusExampleComponent {}
