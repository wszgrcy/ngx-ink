import { Component } from '@angular/core';
import { BoxComponent } from '../box-component/box.component.js';

/**
 * A flexible space that expands along the major axis of its containing layout.
 *
 * It's useful as a shortcut for filling all the available space between elements.
 */
@Component({
    selector: 'spacer',
    standalone: true,
    imports: [BoxComponent],
    template: '<box [style]="{ flexGrow: 1 }"></box>',
})
export class SpacerComponent {}
