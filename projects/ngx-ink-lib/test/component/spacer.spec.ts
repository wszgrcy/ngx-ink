import { Component } from '@angular/core';
import { renderToString } from '../helpers/render-to-string';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { SpacerComponent } from '../../src/lib/ngx-ink/components/spacer-component/spacer.component';
import { TextComponent } from '../../src/lib/ngx-ink/components/text-component/text.component';
import { BoxComponent } from '../../src/lib/ngx-ink/components/box-component/box.component';

// ============================================================================
// Component tests (placeholder)
// ============================================================================

describe('SpacerComponent', () => {
    // TODO: Add component unit tests
});

// ============================================================================
// renderToString tests
// ============================================================================

describe('print', () => {
    // TODO: Spacer uses nested BoxComponent which has Yoga flex issues
    // The spacer should push content apart but currently renders as 'LeftRight'
    // instead of 'Left           Right'
    it('should render spacer pushing content apart', async () => {
        @Component({
            selector: 'app-spacer-basic',
            template: `<box [style]="boxStyle"
                ><text>Left</text><spacer></spacer><text>Right</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent, SpacerComponent],
        })
        class SpacerBasicComponent {
            boxStyle: any = { width: 20 };
        }

        const output = await renderToString(SpacerBasicComponent, { columns: 80 });
        expect(output).to.equal('Left           Right');
    });
});
