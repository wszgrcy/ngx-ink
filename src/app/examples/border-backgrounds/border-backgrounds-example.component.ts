import { Component } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';

@Component({
    selector: 'ink-border-backgrounds-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './border-backgrounds-example.component.html',
})
export class BorderBackgroundsExampleComponent {}
