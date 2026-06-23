import { Component } from '@angular/core';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import { renderToString } from '../../helpers/render-to-string';

// ============================================================================
// Screen Reader - ARIA state tests
// ============================================================================

describe('Screen Reader - ARIA State', () => {
    it('render with aria-state.busy', async () => {
        @Component({
            selector: 'app-screen-reader-busy',
            template: `<box [aria-state]="{ busy: true }"><text>Loading</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderBusyComponent {}

        const output = await renderToString(ScreenReaderBusyComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('(busy) Loading');
    });

    it('render with aria-state.checked', async () => {
        @Component({
            selector: 'app-screen-reader-checked',
            template: `<box aria-role="checkbox" [aria-state]="{ checked: true }"
                ><text>Accept terms</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderCheckedComponent {}

        const output = await renderToString(ScreenReaderCheckedComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('checkbox: (checked) Accept terms');
    });

    it('render with aria-state.disabled', async () => {
        @Component({
            selector: 'app-screen-reader-disabled',
            template: `<box aria-role="button" [aria-state]="{ disabled: true }"
                ><text>Submit</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderDisabledComponent {}

        const output = await renderToString(ScreenReaderDisabledComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('button: (disabled) Submit');
    });

    it('render with aria-state.expanded', async () => {
        @Component({
            selector: 'app-screen-reader-expanded',
            template: `<box aria-role="combobox" [aria-state]="{ expanded: true }"
                ><text>Select</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderExpandedComponent {}

        const output = await renderToString(ScreenReaderExpandedComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('combobox: (expanded) Select');
    });

    it('render with aria-state.multiline', async () => {
        @Component({
            selector: 'app-screen-reader-multiline',
            template: `<box aria-role="textbox" [aria-state]="{ multiline: true }"
                ><text>Hello</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderMultilineComponent {}

        const output = await renderToString(ScreenReaderMultilineComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('textbox: (multiline) Hello');
    });

    it('render with aria-state.multiselectable', async () => {
        @Component({
            selector: 'app-screen-reader-multiselectable',
            template: `<box aria-role="listbox" [aria-state]="{ multiselectable: true }"
                ><text>Options</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderMultiselectableComponent {}

        const output = await renderToString(ScreenReaderMultiselectableComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('listbox: (multiselectable) Options');
    });

    it('render with aria-state.readonly', async () => {
        @Component({
            selector: 'app-screen-reader-readonly',
            template: `<box aria-role="textbox" [aria-state]="{ readonly: true }"
                ><text>Hello</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderReadonlyComponent {}

        const output = await renderToString(ScreenReaderReadonlyComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('textbox: (readonly) Hello');
    });

    it('render with aria-state.required', async () => {
        @Component({
            selector: 'app-screen-reader-required',
            template: `<box aria-role="textbox" [aria-state]="{ required: true }"
                ><text>Name</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderRequiredComponent {}

        const output = await renderToString(ScreenReaderRequiredComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('textbox: (required) Name');
    });

    it('render with aria-state.selected', async () => {
        @Component({
            selector: 'app-screen-reader-selected',
            template: `<box aria-role="option" [aria-state]="{ selected: true }"
                ><text>Blue</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderSelectedComponent {}

        const output = await renderToString(ScreenReaderSelectedComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('option: (selected) Blue');
    });
});
