import { Component } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';

@Component({
    selector: 'ink-borders-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './borders-example.component.html',
})
export class BordersExampleComponent {}
