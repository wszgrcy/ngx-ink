import { Component } from '@angular/core';
import { renderToString } from '../helpers/render-to-string';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TextComponent } from '../../src/lib/ngx-ink/components/text-component/text.component';
import { BoxComponent } from '../../src/lib/ngx-ink/components/box-component/box.component';

// ============================================================================
// Component tests (placeholder)
// ============================================================================

describe('BoxComponent', () => {
    // TODO: Add component unit tests
});

// ============================================================================
// renderToString tests
// ============================================================================

describe('print', () => {
    // TODO: Box rendering has WASM yoga-layout issues - needs investigation
    // The issue is that insertChild on Yoga Node fails with memory access out of bounds
    // when Angular renders <box> components. TextComponent works because it's mounted
    // directly to root without needing to be inserted as a child of ink-box.
    it('should render simple box', async () => {
        @Component({
            selector: 'app-box-simple',
            template: `<box><text>Box</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxSimpleComponent {}

        const output = await renderToString(BoxSimpleComponent, { columns: 100 });
        expect(output).to.equal('Box');
    });

    it('should render box with padding', async () => {
        // TODO: Fix Yoga WASM issue
        @Component({
            selector: 'app-box-padding',
            template: `<box [style]="boxStyle"><text>Padded</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxPaddingComponent {
            boxStyle = { paddingLeft: 2 };
        }
        const output = await renderToString(BoxPaddingComponent);
        expect(output).to.equal('  Padded');
    });

    it('should render box with flex direction row', async () => {
        @Component({
            selector: 'app-box-row',
            template: `<box><text>A</text><text>B</text><text>C</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxRowComponent {}

        const output = await renderToString(BoxRowComponent, { columns: 3 });
        expect(output).to.equal('ABC');
    });

    it('should render box with flex direction column', async () => {
        @Component({
            selector: 'app-box-column',
            template: `<box [style]="boxStyle"><text>Line 1</text><text>Line 2</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxColumnComponent {
            boxStyle: any = { flexDirection: 'column' };
        }

        const output = await renderToString(BoxColumnComponent);
        expect(output).to.equal('Line 1\nLine 2');
    });

    it('should render box with margin', async () => {
        @Component({
            selector: 'app-box-margin',
            template: `<box [style]="boxStyle"><text>Margined</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxMarginComponent {
            boxStyle = { marginLeft: 2 };
        }

        const output = await renderToString(BoxMarginComponent);
        expect(output).to.equal('  Margined');
    });

    it('should render box with gap', async () => {
        @Component({
            selector: 'app-box-gap',
            template: `<box [style]="boxStyle"><text>A</text><text>B</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxGapComponent {
            boxStyle = { gap: 1 };
        }

        const output = await renderToString(BoxGapComponent);
        expect(output).to.equal('A B');
    });

    it('should render box with fixed width and height', async () => {
        @Component({
            selector: 'app-box-fixed',
            template: `<box [style]="boxStyle"><text>Hi</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxFixedComponent {
            boxStyle = { width: 10, height: 3 };
        }

        const output = await renderToString(BoxFixedComponent);
        const lines = output.split('\n');
        expect(lines.length).to.equal(3);
    });

    it('should render box with border', async () => {
        @Component({
            selector: 'app-box-border',
            template: `<box [style]="boxStyle"><text>Bordered</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxBorderComponent {
            boxStyle: any = { borderStyle: 'single', width: 20 };
        }

        const output = await renderToString(BoxBorderComponent, { columns: 20 });
        // Just verify the output contains border characters (Unicode box-drawing)
        expect(output).to.include('┌');
    });
});
