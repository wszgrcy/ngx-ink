import { Component } from '@angular/core';
import { renderToString } from '../helpers/render-to-string';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { StaticComponent } from '../../src/lib/ngx-ink/components/static-component/static.component';
import { TextComponent } from '../../src/lib/ngx-ink/components/text-component/text.component';
import { BoxComponent } from '../../src/lib/ngx-ink/components/box-component/box.component';

// ============================================================================
// Component tests (placeholder)
// ============================================================================

describe('StaticComponent', () => {
    // TODO: Add component unit tests
});

// ============================================================================
// renderToString tests
// ============================================================================

describe('print', () => {
    // TODO: Static component rendering returns empty string - needs investigation
    // The issue is likely related to how internal_static is propagated through
    // the Angular template rendering with nested BoxComponent
    it('should render static items with dynamic content', async () => {
        @Component({
            selector: 'app-static-with-dynamic',
            template: `
                <box [style]="boxStyle">
                    <static [items]="items"
                        ><ng-template let-item
                            ><text>{{ item }}</text></ng-template
                        ></static
                    >
                    <text>Dynamic</text>
                </box>
            `,
            standalone: true,
            imports: [BoxComponent, StaticComponent, TextComponent],
        })
        class StaticWithDynamicComponent {
            boxStyle: any = { flexDirection: 'column' };
            items = ['A', 'B', 'C'];
        }

        const output = await renderToString(StaticWithDynamicComponent);
        expect(output).to.equal('A\nB\nC\nDynamic');
    });

    it('should render static-only without trailing newline', async () => {
        @Component({
            selector: 'app-static-only',
            template: `<static [items]="items"
                ><ng-template let-item
                    ><text>{{ item }}</text></ng-template
                ></static
            >`,
            standalone: true,
            imports: [StaticComponent, TextComponent],
        })
        class StaticOnlyComponent {
            items = ['A', 'B'];
        }

        const output = await renderToString(StaticOnlyComponent);
        expect(output).to.equal('A\nB\n');
    });
});
