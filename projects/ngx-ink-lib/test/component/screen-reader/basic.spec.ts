import { Component } from '@angular/core';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import { renderToString } from '../../helpers/render-to-string';

// ============================================================================
// Screen Reader - Basic functionality tests
// ============================================================================

describe('Screen Reader - Basic', () => {
    it('render text for screen readers', async () => {
        @Component({
            selector: 'app-screen-reader',
            template: `<box aria-label="Hello World"
                ><text>Not visible to screen readers</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderComponent {}

        const output = await renderToString(ScreenReaderComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('Hello World');
    });

    it('render text for screen readers with aria-hidden', async () => {
        @Component({
            selector: 'app-screen-reader-hidden',
            template: `<box [aria-hidden]="true"><text>Not visible to screen readers</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderHiddenComponent {}

        const output = await renderToString(ScreenReaderHiddenComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('');
    });

    it('render text for screen readers with aria-role', async () => {
        @Component({
            selector: 'app-screen-reader-role',
            template: `<box aria-role="button"><text>Click me</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderRoleComponent {}

        const output = await renderToString(ScreenReaderRoleComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('button: Click me');
    });

    it('render aria-label only Text for screen readers', async () => {
        @Component({
            selector: 'app-screen-reader-text-only',
            template: `<text aria-label="Screen-reader only"></text>`,
            standalone: true,
            imports: [TextComponent],
        })
        class ScreenReaderTextOnlyComponent {}

        const output = await renderToString(ScreenReaderTextOnlyComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('Screen-reader only');
    });

    it('render aria-label only Box for screen readers', async () => {
        @Component({
            selector: 'app-screen-reader-box-only',
            template: `<box aria-label="Screen-reader only"></box>`,
            standalone: true,
            imports: [BoxComponent],
        })
        class ScreenReaderBoxOnlyComponent {}

        const output = await renderToString(ScreenReaderBoxOnlyComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('Screen-reader only');
    });

    it('omit ANSI styling in screen-reader output', async () => {
        @Component({
            selector: 'app-screen-reader-ansi',
            template: `<text [bold]="true" color="green" [inverse]="true" [underline]="true"
                >Styled content</text
            >`,
            standalone: true,
            imports: [TextComponent],
        })
        class ScreenReaderAnsiComponent {}

        const output = await renderToString(ScreenReaderAnsiComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('Styled content');
    });

    it('skip nodes with display:none style in screen-reader output', async () => {
        @Component({
            selector: 'app-screen-reader-display-none',
            template: `
                <box>
                    <box [style]="{ display: 'none' }"><text>Hidden</text></box>
                    <text>Visible</text>
                </box>
            `,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class ScreenReaderDisplayNoneComponent {}

        const output = await renderToString(ScreenReaderDisplayNoneComponent, {
            isScreenReaderEnabled: true,
        });

        expect(output).to.equal('Visible');
    });
});
