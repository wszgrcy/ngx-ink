import { Component } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';

@Component({
    selector: 'ink-box-backgrounds-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './box-backgrounds-example.component.html',
})
export class BoxBackgroundsExampleComponent {}
