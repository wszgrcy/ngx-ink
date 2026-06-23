import { Component } from '@angular/core';
import { renderToString } from '../../helpers/render-to-string';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TextComponent } from '../../../src/lib/ngx-ink/components/text-component/text.component';
import { BoxComponent } from '../../../src/lib/ngx-ink/components/box-component/box.component';

// Based on lib/ink/test/borders.tsx

describe('BoxComponent - Dimensions', () => {
    describe('Full Width Box', () => {
        it('should render single node full width box with round border', async () => {
            @Component({
                selector: 'app-box-full-width',
                template: `<box [style]="boxStyle"><text>Hello World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxFullWidthComponent {
                boxStyle: any = { borderStyle: 'round' };
            }

            const output = await renderToString(BoxFullWidthComponent, { columns: 100 });
            expect(output).to.include('Hello World');
            expect(output).to.include('╭');
            expect(output).to.include('╮');
        });
    });

    describe('Fit Content Box', () => {
        it('should render fit-content box', async () => {
            @Component({
                selector: 'app-box-fit-content',
                template: `<box [style]="boxStyle"><text>Hello World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxFitContentComponent {
                boxStyle: any = { borderStyle: 'round', alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxFitContentComponent);
            expect(output).to.equal('╭───────────╮\n│Hello World│\n╰───────────╯');
        });

        it('should render fit-content box with wide characters', async () => {
            @Component({
                selector: 'app-box-fit-wide',
                template: `<box [style]="boxStyle"><text>こんにちは</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxFitWideComponent {
                boxStyle: any = { borderStyle: 'round', alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxFitWideComponent);
            expect(output).to.include('こんにちは');
        });

        it('should render fit-content box with emojis', async () => {
            @Component({
                selector: 'app-box-fit-emojis',
                template: `<box [style]="boxStyle"><text>ឳ￿ឳ￿</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxFitEmojisComponent {
                boxStyle: any = { borderStyle: 'round', alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxFitEmojisComponent);
            expect(output).to.include('ឳ￿');
        });
    });

    describe('Fixed Width Box', () => {
        it('should render fixed width box', async () => {
            @Component({
                selector: 'app-box-fixed-width',
                template: `<box [style]="boxStyle"><text>Hello World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxFixedWidthComponent {
                boxStyle: any = { borderStyle: 'round', width: 20 };
            }

            const output = await renderToString(BoxFixedWidthComponent);
            expect(output).to.include('Hello World');
        });

        it('should render fixed width and height box', async () => {
            @Component({
                selector: 'app-box-fixed-dimensions',
                template: `<box [style]="boxStyle"><text>Hello World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxFixedDimensionsComponent {
                boxStyle: any = { borderStyle: 'round', width: 20, height: 20 };
            }

            const output = await renderToString(BoxFixedDimensionsComponent);
            expect(output).to.include('Hello World');
        });
    });

    describe('Box With Padding', () => {
        it('should render box with padding', async () => {
            @Component({
                selector: 'app-box-with-padding',
                template: `<box [style]="boxStyle"><text>Hello World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxWithPaddingComponent {
                boxStyle: any = { borderStyle: 'round', padding: 1, alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxWithPaddingComponent);
            // React original: boxen('\n Hello World \n', {borderStyle: 'round'})
            expect(output).to.equal(
                '╭─────────────╮\n' +
                    '│             │\n' +
                    '│ Hello World │\n' +
                    '│             │\n' +
                    '╰─────────────╯',
            );
        });
    });

    describe('Box With Alignment', () => {
        it('should render box with horizontal alignment justifyContent center', async () => {
            @Component({
                selector: 'app-box-h-align-center',
                template: `<box [style]="boxStyle"><text>Hello World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxHAlignCenterComponent {
                boxStyle: any = { borderStyle: 'round', width: 20, justifyContent: 'center' };
            }

            const output = await renderToString(BoxHAlignCenterComponent);
            // Angular width=20 includes border, so content area is 18 chars
            // justifyContent center centers 'Hello World' (11 chars) in 18-char area
            expect(output).to.include('Hello World');
            expect(output).to.include('╭');
            expect(output).to.include('╰');
        });

        it('should render box with vertical alignment alignItems center', async () => {
            @Component({
                selector: 'app-box-v-align-center',
                template: `<box [style]="boxStyle"><text>Hello World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxVAlignCenterComponent {
                boxStyle: any = {
                    borderStyle: 'round',
                    height: 20,
                    alignItems: 'center',
                    alignSelf: 'flex-start',
                };
            }

            const output = await renderToString(BoxVAlignCenterComponent);
            expect(output).to.include('Hello World');
        });
    });

    describe('Box With Wrapping', () => {
        it('should render box with wrapping', async () => {
            @Component({
                selector: 'app-box-with-wrapping',
                template: `<box [style]="boxStyle"><text>Hello World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxWithWrappingComponent {
                boxStyle: any = { borderStyle: 'round', width: 10 };
            }

            const output = await renderToString(BoxWithWrappingComponent);
            // Angular width=10 includes border, content area is 8 chars
            // 'Hello World' wraps to 'Hello   ' (8 chars) and 'World   ' (8 chars)
            expect(output).to.equal('╭────────╮\n│Hello   │\n│World   │\n╰────────╯');
        });
    });
});
