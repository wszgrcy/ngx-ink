import { Component } from '@angular/core';
import { renderToString } from '../../helpers/render-to-string';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TextComponent } from '../../../src/lib/ngx-ink/components/text-component/text.component';
import { BoxComponent } from '../../../src/lib/ngx-ink/components/box-component/box.component';

// Based on lib/ink/test/flex-direction.tsx

describe('BoxComponent - Flex Direction', () => {
    it('should render flexDirection row', async () => {
        @Component({
            selector: 'app-box-flex-direction-row',
            template: `<box [style]="boxStyle"><text>A</text><text>B</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxFlexDirectionRowComponent {
            boxStyle: any = { flexDirection: 'row' };
        }

        const output = await renderToString(BoxFlexDirectionRowComponent);
        expect(output).to.equal('AB');
    });

    it('should render flexDirection row-reverse', async () => {
        @Component({
            selector: 'app-box-flex-direction-row-reverse',
            template: `<box [style]="boxStyle"><text>A</text><text>B</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxFlexDirectionRowReverseComponent {
            boxStyle: any = { flexDirection: 'row-reverse', width: 4 };
        }

        const output = await renderToString(BoxFlexDirectionRowReverseComponent);
        expect(output).to.equal('  BA');
    });

    it('should render flexDirection column', async () => {
        @Component({
            selector: 'app-box-flex-direction-column',
            template: `<box [style]="boxStyle"><text>A</text><text>B</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxFlexDirectionColumnComponent {
            boxStyle: any = { flexDirection: 'column' };
        }

        const output = await renderToString(BoxFlexDirectionColumnComponent);
        expect(output).to.equal('A\nB');
    });

    it('should render flexDirection column-reverse', async () => {
        @Component({
            selector: 'app-box-flex-direction-col-reverse',
            template: `<box [style]="boxStyle"><text>A</text><text>B</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxFlexDirectionColReverseComponent {
            boxStyle: any = { flexDirection: 'column-reverse', height: 4 };
        }

        const output = await renderToString(BoxFlexDirectionColReverseComponent);
        expect(output).to.equal('\n\nB\nA');
    });

    it('should not squash text nodes when column direction is applied', async () => {
        @Component({
            selector: 'app-box-flex-direction-column-no-squash',
            template: `<box [style]="boxStyle"><text>A</text><text>B</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxFlexDirectionColumnNoSquashComponent {
            boxStyle: any = { flexDirection: 'column' };
        }

        const output = await renderToString(BoxFlexDirectionColumnNoSquashComponent);
        expect(output).to.equal('A\nB');
    });
});
