import { Component } from '@angular/core';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BoxComponent, Styles, TextComponent } from '@cyia/ngx-lib';
import { renderToString } from '../../helpers/render-to-string';

// ============================================================================
// Screen Reader - Layout tests
// ============================================================================

describe('Screen Reader - Layout', () => {
    it('render multiple Text components', async () => {
        @Component({
            selector: 'app-screen-reader-multiple-text',
            template: `<box [style]="boxStyle"><text>Hello</text><text>World</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderMultipleTextComponent {
            boxStyle = { flexDirection: 'column' } as Styles;
        }

        const output = await renderToString(ScreenReaderMultipleTextComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('Hello\nWorld');
    });

    it('render nested Box components with Text', async () => {
        @Component({
            selector: 'app-screen-reader-nested-box',
            template: `<box [style]="boxStyle"
                ><text>Hello</text><box><text>World</text></box></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderNestedBoxComponent {
            boxStyle = { flexDirection: 'column' } as Styles;
        }

        const output = await renderToString(ScreenReaderNestedBoxComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('Hello\nWorld');
    });

    it('render component that returns null', async () => {
        @Component({
            selector: 'app-null-component',
            template: ``,
            standalone: true,
            imports: [],
        })
        class NullComponent {}

        @Component({
            selector: 'app-screen-reader-null',
            template: `<box [style]="boxStyle"
                ><text>Hello</text><app-null-component></app-null-component><text>World</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent, NullComponent],
        })
        class ScreenReaderNullComponent {
            boxStyle = { flexDirection: 'column' } as Styles;
        }

        const output = await renderToString(ScreenReaderNullComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('Hello\nWorld');
    });

    it('render multi-line text', async () => {
        @Component({
            selector: 'app-screen-reader-multiline-text',
            template: `<box [style]="boxStyle"><text>Line 1</text><text>Line 2</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderMultilineTextComponent {
            boxStyle = { flexDirection: 'column' } as Styles;
        }

        const output = await renderToString(ScreenReaderMultilineTextComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('Line 1\nLine 2');
    });

    it('render nested multi-line text', async () => {
        @Component({
            selector: 'app-screen-reader-nested-multiline',
            template: `<box [style]="outerStyle"
                ><box [style]="innerStyle"><text>Line 1</text><text>Line 2</text></box></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderNestedMultilineComponent {
            outerStyle = { flexDirection: 'row' } as Styles;
            innerStyle = { flexDirection: 'column' } as Styles;
        }

        const output = await renderToString(ScreenReaderNestedMultilineComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('Line 1\nLine 2');
    });

    it('render nested row', async () => {
        @Component({
            selector: 'app-screen-reader-nested-row',
            template: `<box [style]="outerStyle"
                ><box [style]="innerStyle"><text>Line 1</text><text>Line 2</text></box></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderNestedRowComponent {
            outerStyle = { flexDirection: 'column' } as Styles;
            innerStyle = { flexDirection: 'row' } as Styles;
        }

        const output = await renderToString(ScreenReaderNestedRowComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('Line 1 Line 2');
    });

    it('render multi-line text with roles', async () => {
        @Component({
            selector: 'app-screen-reader-roles',
            template: `<box [style]="boxStyle" aria-role="list"
                ><box aria-role="listitem"><text>Item 1</text></box
                ><box aria-role="listitem"><text>Item 2</text></box></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderRolesComponent {
            boxStyle = { flexDirection: 'column' } as Styles;
        }

        const output = await renderToString(ScreenReaderRolesComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('list: listitem: Item 1\nlistitem: Item 2');
    });
});
