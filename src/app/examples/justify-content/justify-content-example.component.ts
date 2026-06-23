import { Component } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';

@Component({
    selector: 'ink-justify-content-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './justify-content-example.component.html',
})
export class JustifyContentExampleComponent {}
