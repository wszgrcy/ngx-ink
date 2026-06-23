import { Component } from '@angular/core';
import { renderToString } from '../helpers/render-to-string';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TransformComponent } from '../../src/lib/ngx-ink/components/transform-component/transform.component';
import { TextComponent } from '../../src/lib/ngx-ink/components/text-component/text.component';

// ============================================================================
// Component tests (placeholder)
// ============================================================================

describe('TransformComponent', () => {
    // TODO: Add component unit tests
});

// ============================================================================
// renderToString tests
// ============================================================================

describe('print', () => {
    it('should transform text to uppercase', async () => {
        @Component({
            selector: 'app-transform-uppercase',
            template: `<transform [transform]="transformFn"><text>hello</text></transform>`,
            standalone: true,
            imports: [TransformComponent, TextComponent],
        })
        class TransformUppercaseComponent {
            transformFn = (o: string) => o.toUpperCase();
        }

        const output = await renderToString(TransformUppercaseComponent);
        expect(output).to.equal('HELLO');
    });

    it('should transform text to lowercase', async () => {
        @Component({
            selector: 'app-transform-lowercase',
            template: `<transform [transform]="transformFn"><text>HELLO</text></transform>`,
            standalone: true,
            imports: [TransformComponent, TextComponent],
        })
        class TransformLowercaseComponent {
            transformFn = (o: string) => o.toLowerCase();
        }

        const output = await renderToString(TransformLowercaseComponent);
        expect(output).to.equal('hello');
    });
});
