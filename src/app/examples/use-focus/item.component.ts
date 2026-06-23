import { Component, input, computed } from '@angular/core';
import { TextComponent, useFocus } from '@cyia/ngx-lib';

@Component({
    selector: 'ink-item',
    standalone: true,
    imports: [TextComponent],
    templateUrl: './item.component.html',
})
export class ItemComponent {
    readonly label = input.required<string>();
    readonly focusState = useFocus();
    readonly isFocused = computed(() => this.focusState().isFocused);
}
