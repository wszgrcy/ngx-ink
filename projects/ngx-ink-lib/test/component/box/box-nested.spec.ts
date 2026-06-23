import { Component } from '@angular/core';
import { renderToString } from '../../helpers/render-to-string';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TextComponent } from '../../../src/lib/ngx-ink/components/text-component/text.component';
import { BoxComponent } from '../../../src/lib/ngx-ink/components/box-component/box.component';

// Based on lib/ink/test/borders.tsx

describe('BoxComponent - Nested', () => {
    it('should render nested boxes with round borders', async () => {
        @Component({
            selector: 'app-box-nested-round',
            template: `<box [style]="outerStyle"
                ><box [style]="innerStyle"><text>Hello World</text></box></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxNestedRoundComponent {
            outerStyle: any = { borderStyle: 'round', width: 40, padding: 1 };

            innerStyle: any = { borderStyle: 'round', justifyContent: 'center', padding: 1 };
        }

        const output = await renderToString(BoxNestedRoundComponent);
        expect(output).to.include('Hello World');
        expect(output).to.include('╭');
    });

    it('should render nested fit-content boxes on row', async () => {
        @Component({
            selector: 'app-box-nested-row',
            template: `<box [style]="outerStyle"
                ><box [style]="box1Style"><text>Box1</text></box
                ><box [style]="box2Style"><text>Box2</text></box
                ><box [style]="box3Style"><text>Box3</text></box></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxNestedRowComponent {
            outerStyle: any = { borderStyle: 'round', alignSelf: 'flex-start' };

            box1Style: any = { borderStyle: 'round' };

            box2Style: any = { borderStyle: 'round' };

            box3Style: any = { borderStyle: 'round' };
        }

        const output = await renderToString(BoxNestedRowComponent);
        expect(output).to.include('Box1');
        expect(output).to.include('Box2');
        expect(output).to.include('Box3');
    });

    it('should render nested fit-content boxes on column', async () => {
        @Component({
            selector: 'app-box-nested-col',
            template: `<box [style]="outerStyle"
                ><box [style]="box1Style"><text>Box1</text></box
                ><box [style]="box2Style"><text>Box2</text></box
                ><box [style]="box3Style"><text>Box3</text></box></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxNestedColComponent {
            outerStyle: any = {
                borderStyle: 'round',
                alignSelf: 'flex-start',
                flexDirection: 'column',
            };

            box1Style: any = { borderStyle: 'round' };

            box2Style: any = { borderStyle: 'round' };

            box3Style: any = { borderStyle: 'round' };
        }

        const output = await renderToString(BoxNestedColComponent);
        expect(output).to.include('Box1');
        expect(output).to.include('Box2');
        expect(output).to.include('Box3');
    });
});
