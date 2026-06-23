import { Component, computed, input } from '@angular/core';
import { TextComponent } from '../text-component/text.component.js';

export type Props = {
    /**
	Number of newlines to insert.

	@default 1
	*/
    readonly count?: number;
};

/**
Adds one or more newline (`\n`) characters. Must be used within `<Text>` components.
*/
@Component({
    selector: 'newline',
    standalone: true,
    imports: [TextComponent],
    template: '<text>{{ newlines() }}</text>',
})
export class NewlineComponent {
    readonly count = input<number>(1);

    readonly newlines = computed(() => '\n'.repeat(this.count()));
}
