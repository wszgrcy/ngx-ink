import { Component } from '@angular/core';
import { renderToString } from '../helpers/render-to-string';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { NewlineComponent } from '../../src/lib/ngx-ink/components/newline-component/newline.component';
import { TextComponent } from '../../src/lib/ngx-ink/components/text-component/text.component';
import { BoxComponent } from '../../src/lib/ngx-ink/components/box-component/box.component';

// ============================================================================
// Component tests (placeholder)
// ============================================================================

describe('NewlineComponent', () => {
    // TODO: Add component unit tests
});

// ============================================================================
// renderToString tests
// ============================================================================

describe('print', () => {
    it('should render single newline', async () => {
        @Component({
            selector: 'app-newline-basic',
            template: `<box [style]="boxStyle"
                ><text>Above</text><newline></newline><text>Below</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent, NewlineComponent],
        })
        class NewlineBasicComponent {
            boxStyle: any = { flexDirection: 'column' };
        }

        const output = await renderToString(NewlineBasicComponent);
        expect(output).to.equal('Above\n\n\nBelow');
    });

    it('should render multiple newlines with count', async () => {
        @Component({
            selector: 'app-newline-count',
            template: `<box [style]="boxStyle"
                ><text>A</text><newline [count]="3"></newline><text>B</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent, NewlineComponent],
        })
        class NewlineCountComponent {
            boxStyle: any = { flexDirection: 'column' };
        }

        const output = await renderToString(NewlineCountComponent);
        expect(output).to.equal('A\n\n\n\n\nB');
    });
});
