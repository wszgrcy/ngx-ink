import { Component, signal } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import { useInput, useIsScreenReaderEnabled } from '@cyia/ngx-lib';

@Component({
    selector: 'ink-select-input-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './select-input-example.component.html',
})
export class SelectInputExampleComponent {
    items = signal(['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Cyan']);
    selectedIndex = signal(0);
    isScreenReaderEnabled = useIsScreenReaderEnabled();

    constructor() {
        useInput((input, key) => {
            if (key.upArrow) {
                this.selectedIndex.update((previousIndex) =>
                    previousIndex === 0 ? this.items().length - 1 : previousIndex - 1,
                );
            }

            if (key.downArrow) {
                this.selectedIndex.update((previousIndex) =>
                    previousIndex === this.items().length - 1 ? 0 : previousIndex + 1,
                );
            }

            if (this.isScreenReaderEnabled()) {
                const number = Number.parseInt(input, 10);
                if (!Number.isNaN(number) && number > 0 && number <= this.items().length) {
                    this.selectedIndex.set(number - 1);
                }
            }
        });
    }

    getSelectedItem(index: number) {
        return index === this.selectedIndex();
    }

    getItemLabel(index: number, item: string) {
        return index === this.selectedIndex() ? `> ${item}` : `  ${item}`;
    }

    getScreenReaderLabel(index: number, item: string) {
        if (!this.isScreenReaderEnabled()) {
            return undefined;
        }
        return `${index + 1}. ${item}`;
    }
}
