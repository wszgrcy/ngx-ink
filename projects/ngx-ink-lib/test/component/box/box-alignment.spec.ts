import { Component } from '@angular/core';
import { renderToString } from '../../helpers/render-to-string';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TextComponent } from '../../../src/lib/ngx-ink/components/text-component/text.component';
import { BoxComponent } from '../../../src/lib/ngx-ink/components/box-component/box.component';

// Based on lib/ink/test/flex-align-content.tsx, flex-align-items.tsx, flex-justify-content.tsx

describe('BoxComponent - Align Content', () => {
    const alignContentTests = [
        ['flex-start', 'AB\nCD\n\n\n\n'],
        ['center', '\n\nAB\nCD\n\n'],
        ['flex-end', '\n\n\n\nAB\nCD'],
        ['space-between', 'AB\n\n\n\n\nCD'],
        ['space-around', '\nAB\n\n\nCD\n'],
        ['space-evenly', '\nAB\n\nCD\n\n'],
        ['stretch', 'AB\n\n\nCD\n\n'],
    ] as const;

    for (const [alignContent, expectedOutput] of alignContentTests) {
        it(`should render alignContent ${alignContent}`, async () => {
            @Component({
                selector: 'app-box-align-content',
                template: `<box [style]="boxStyle"
                    ><text>A</text><text>B</text><text>C</text><text>D</text></box
                >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxAlignContentComponent {
                boxStyle: any = { width: 2, height: 6, flexWrap: 'wrap', alignContent };
            }

            const output = await renderToString(BoxAlignContentComponent);
            expect(output).to.equal(expectedOutput);
        });
    }

    it('should default alignContent to flex-start', async () => {
        @Component({
            selector: 'app-box-align-content-default',
            template: `<box [style]="boxStyle"
                ><text>A</text><text>B</text><text>C</text><text>D</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxAlignContentDefaultComponent {
            boxStyle: any = { width: 2, height: 6, flexWrap: 'wrap' };
        }

        const output = await renderToString(BoxAlignContentDefaultComponent);
        expect(output).to.equal('AB\nCD\n\n\n\n');
    });

    it('should not add extra spacing when there is no free cross-axis space', async () => {
        @Component({
            selector: 'app-box-align-content-tight',
            template: `<box [style]="boxStyle"
                ><text>A</text><text>B</text><text>C</text><text>D</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxAlignContentTightComponent {
            boxStyle: any = { width: 2, height: 2, flexWrap: 'wrap', alignContent: 'center' };
        }

        const output = await renderToString(BoxAlignContentTightComponent);
        expect(output).to.equal('AB\nCD');
    });
});

describe('BoxComponent - Align Items', () => {
    describe('row layout', () => {
        it('should align text to center', async () => {
            @Component({
                selector: 'app-box-align-items-center',
                template: `<box [style]="boxStyle"><text>Test</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxAlignItemsCenterComponent {
                boxStyle: any = { alignItems: 'center', height: 3 };
            }

            const output = await renderToString(BoxAlignItemsCenterComponent);
            expect(output).to.equal('\nTest\n');
        });

        it('should align multiple text nodes to center', async () => {
            @Component({
                selector: 'app-box-align-items-center-multi',
                template: `<box [style]="boxStyle"><text>A</text><text>B</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxAlignItemsCenterMultiComponent {
                boxStyle: any = { alignItems: 'center', height: 3 };
            }

            const output = await renderToString(BoxAlignItemsCenterMultiComponent);
            expect(output).to.equal('\nAB\n');
        });

        it('should align text to bottom (flex-end)', async () => {
            @Component({
                selector: 'app-box-align-items-flex-end',
                template: `<box [style]="boxStyle"><text>Test</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxAlignItemsFlexEndComponent {
                boxStyle: any = { alignItems: 'flex-end', height: 3 };
            }

            const output = await renderToString(BoxAlignItemsFlexEndComponent);
            expect(output).to.equal('\n\nTest');
        });

        it('should align multiple text nodes to bottom (flex-end)', async () => {
            @Component({
                selector: 'app-box-align-items-flex-end-multi',
                template: `<box [style]="boxStyle"><text>A</text><text>B</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxAlignItemsFlexEndMultiComponent {
                boxStyle: any = { alignItems: 'flex-end', height: 3 };
            }

            const output = await renderToString(BoxAlignItemsFlexEndMultiComponent);
            expect(output).to.equal('\n\nAB');
        });

        it('should stretch children by default', async () => {
            @Component({
                selector: 'app-box-align-items-stretch-default',
                template: `<box [style]="boxStyle"
                    ><box [style]="innerStyle"><text>X</text></box></box
                >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxAlignItemsStretchDefaultComponent {
                boxStyle: any = { height: 5 };

                innerStyle: any = { borderStyle: 'single' };
            }

            const output = await renderToString(BoxAlignItemsStretchDefaultComponent);
            expect(output).to.equal('┌─┐\n│X│\n│ │\n│ │\n└─┘');
        });

        it('should stretch children with alignItems stretch', async () => {
            @Component({
                selector: 'app-box-align-items-stretch',
                template: `<box [style]="boxStyle"
                    ><box [style]="innerStyle"><text>X</text></box></box
                >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxAlignItemsStretchComponent {
                boxStyle: any = { alignItems: 'stretch', height: 5 };

                innerStyle: any = { borderStyle: 'single' };
            }

            const output = await renderToString(BoxAlignItemsStretchComponent);
            expect(output).to.equal('┌─┐\n│X│\n│ │\n│ │\n└─┘');
        });
    });

    describe('column layout', () => {
        it('should align text to center', async () => {
            @Component({
                selector: 'app-box-align-items-col-center',
                template: `<box [style]="boxStyle"><text>Test</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxAlignItemsColCenterComponent {
                boxStyle: any = { flexDirection: 'column', alignItems: 'center', width: 10 };
            }

            const output = await renderToString(BoxAlignItemsColCenterComponent);
            expect(output).to.equal('   Test');
        });

        it('should align text to right (flex-end)', async () => {
            @Component({
                selector: 'app-box-align-items-col-flex-end',
                template: `<box [style]="boxStyle"><text>Test</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxAlignItemsColFlexEndComponent {
                boxStyle: any = { flexDirection: 'column', alignItems: 'flex-end', width: 10 };
            }

            const output = await renderToString(BoxAlignItemsColFlexEndComponent);
            expect(output).to.equal('      Test');
        });
    });
});

describe('BoxComponent - Justify Content', () => {
    describe('row layout', () => {
        it('should align single text to center', async () => {
            @Component({
                selector: 'app-box-justify-center-single',
                template: `<box [style]="boxStyle"><text>Test</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxJustifyCenterSingleComponent {
                boxStyle: any = { justifyContent: 'center', width: 10 };
            }

            const output = await renderToString(BoxJustifyCenterSingleComponent);
            expect(output).to.equal('   Test');
        });

        it('should align multiple text nodes to center', async () => {
            @Component({
                selector: 'app-box-justify-center-multi',
                template: `<box [style]="boxStyle"><text>A</text><text>B</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxJustifyCenterMultiComponent {
                boxStyle: any = { justifyContent: 'center', width: 10 };
            }

            const output = await renderToString(BoxJustifyCenterMultiComponent);
            expect(output).to.equal('    AB');
        });

        it('should align single text to right (flex-end)', async () => {
            @Component({
                selector: 'app-box-justify-flex-end-single',
                template: `<box [style]="boxStyle"><text>Test</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxJustifyFlexEndSingleComponent {
                boxStyle: any = { justifyContent: 'flex-end', width: 10 };
            }

            const output = await renderToString(BoxJustifyFlexEndSingleComponent);
            expect(output).to.equal('      Test');
        });

        it('should align multiple text nodes to right (flex-end)', async () => {
            @Component({
                selector: 'app-box-justify-flex-end-multi',
                template: `<box [style]="boxStyle"><text>A</text><text>B</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxJustifyFlexEndMultiComponent {
                boxStyle: any = { justifyContent: 'flex-end', width: 10 };
            }

            const output = await renderToString(BoxJustifyFlexEndMultiComponent);
            expect(output).to.equal('        AB');
        });

        it('should align two text nodes on the edges (space-between)', async () => {
            @Component({
                selector: 'app-box-justify-space-between',
                template: `<box [style]="boxStyle"><text>A</text><text>B</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxJustifySpaceBetweenComponent {
                boxStyle: any = { justifyContent: 'space-between', width: 4 };
            }

            const output = await renderToString(BoxJustifySpaceBetweenComponent);
            expect(output).to.equal('A  B');
        });

        it('should space evenly two text nodes', async () => {
            @Component({
                selector: 'app-box-justify-space-evenly',
                template: `<box [style]="boxStyle"><text>A</text><text>B</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxJustifySpaceEvenlyComponent {
                boxStyle: any = { justifyContent: 'space-evenly', width: 10 };
            }

            const output = await renderToString(BoxJustifySpaceEvenlyComponent);
            expect(output).to.equal('  A   B');
        });
    });

    describe('column layout', () => {
        it('should align text to center', async () => {
            @Component({
                selector: 'app-box-justify-col-center',
                template: `<box [style]="boxStyle"><text>Test</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxJustifyColCenterComponent {
                boxStyle: any = { flexDirection: 'column', justifyContent: 'center', height: 3 };
            }

            const output = await renderToString(BoxJustifyColCenterComponent);
            expect(output).to.equal('\nTest\n');
        });

        it('should align text to bottom (flex-end)', async () => {
            @Component({
                selector: 'app-box-justify-col-flex-end',
                template: `<box [style]="boxStyle"><text>Test</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxJustifyColFlexEndComponent {
                boxStyle: any = { flexDirection: 'column', justifyContent: 'flex-end', height: 3 };
            }

            const output = await renderToString(BoxJustifyColFlexEndComponent);
            expect(output).to.equal('\n\nTest');
        });

        it('should align two text nodes on the edges (space-between)', async () => {
            @Component({
                selector: 'app-box-justify-col-space-between',
                template: `<box [style]="boxStyle"><text>A</text><text>B</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxJustifyColSpaceBetweenComponent {
                boxStyle: any = {
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: 4,
                };
            }

            const output = await renderToString(BoxJustifyColSpaceBetweenComponent);
            expect(output).to.equal('A\n\n\nB');
        });
    });
});
