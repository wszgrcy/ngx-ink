import { Component } from '@angular/core';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BoxComponent, Styles, TextComponent } from '@cyia/ngx-lib';
import { renderToString } from '../../helpers/render-to-string';

// ============================================================================
// Screen Reader - Complex component tests
// ============================================================================

describe('Screen Reader - Complex', () => {
    it('render select input for screen readers', async () => {
        @Component({
            selector: 'app-screen-reader-select',
            template: `
                <box [style]="boxStyle" aria-role="list">
                    <text>Select a color:</text>
                    @for (item of items; let index = $index; track index) {
                        <box
                            [aria-label]="index + 1 + '. ' + item"
                            aria-role="listitem"
                            [aria-state]="{ selected: index === 1 }"
                        >
                            <text>{{ item }}</text>
                        </box>
                    }
                </box>
            `,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderSelectComponent {
            items = ['Red', 'Green', 'Blue'];
            boxStyle = { flexDirection: 'column' } as Styles;
        }

        const output = await renderToString(ScreenReaderSelectComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal(
            'list: Select a color:\nlistitem: 1. Red\nlistitem: (selected) 2. Green\nlistitem: 3. Blue',
        );
    });

    it('render listbox with multiselectable options', async () => {
        @Component({
            selector: 'app-screen-reader-listbox',
            template: `
                <box
                    [style]="boxStyle"
                    aria-role="listbox"
                    [aria-state]="{ multiselectable: true }"
                >
                    <box aria-role="option" [aria-state]="{ selected: true }"
                        ><text>Option 1</text></box
                    >
                    <box aria-role="option" [aria-state]="{ selected: false }"
                        ><text>Option 2</text></box
                    >
                    <box aria-role="option" [aria-state]="{ selected: true }"
                        ><text>Option 3</text></box
                    >
                </box>
            `,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderListboxComponent {
            boxStyle = { flexDirection: 'column' } as Styles;
        }

        const output = await renderToString(ScreenReaderListboxComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal(
            'listbox: (multiselectable) option: (selected) Option 1\noption: Option 2\noption: (selected) Option 3',
        );
    });
});
