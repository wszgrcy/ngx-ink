import { Component } from '@angular/core';
import { renderToString } from '../../helpers/render-to-string';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TextComponent } from '../../../src/lib/ngx-ink/components/text-component/text.component';
import { BoxComponent } from '../../../src/lib/ngx-ink/components/box-component/box.component';

// Based on lib/ink/test/borders.tsx

describe('BoxComponent - Borders', () => {
    describe('Border Style', () => {
        it('should render box with round border style', async () => {
            @Component({
                selector: 'app-box-border-round',
                template: `<box [style]="boxStyle"><text>Hello World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderRoundComponent {
                boxStyle: any = { borderStyle: 'round' };
            }

            const output = await renderToString(BoxBorderRoundComponent, { columns: 100 });
            expect(output).to.include('╭');
            expect(output).to.include('Hello World');
        });

        it('should render box with round border and green color', async () => {
            @Component({
                selector: 'app-box-border-round-green',
                template: `<box [style]="boxStyle"><text>Hello World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderRoundGreenComponent {
                boxStyle: any = { borderStyle: 'round', borderColor: 'green' };
            }

            const output = await renderToString(BoxBorderRoundGreenComponent, { columns: 100 });
            expect(output).to.include('Hello World');
            expect(output).to.include('\u001B[32m');
        });

        it('should render fit-content box with round border', async () => {
            @Component({
                selector: 'app-box-border-fit-round',
                template: `<box [style]="boxStyle"><text>Hello World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderFitRoundComponent {
                boxStyle: any = { borderStyle: 'round', alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxBorderFitRoundComponent);
            expect(output).to.equal('╭───────────╮\n│Hello World│\n╰───────────╯');
        });

        it('should render box with border and padding', async () => {
            @Component({
                selector: 'app-box-border-padding',
                template: `<box [style]="boxStyle"><text>Hello World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderPaddingComponent {
                boxStyle: any = { borderStyle: 'round', padding: 1, alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxBorderPaddingComponent);
            // React original: boxen('\n Hello World \n', {borderStyle: 'round'})
            // This produces a box with internal padding spaces
            expect(output).to.equal(
                '╭─────────────╮\n' +
                    '│             │\n' +
                    '│ Hello World │\n' +
                    '│             │\n' +
                    '╰─────────────╯',
            );
        });
    });

    describe('Border Edge Controls', () => {
        it('should hide top border when borderTop is false', async () => {
            @Component({
                selector: 'app-box-border-hide-top',
                template: `<box [style]="outerStyle"
                    ><box [style]="boxStyle"><text>Content</text></box
                    ><text>Below</text></box
                >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderHideTopComponent {
                outerStyle: any = { flexDirection: 'column', alignItems: 'flex-start' };

                boxStyle: any = { borderStyle: 'round', borderTop: false };
            }

            const output = await renderToString(BoxBorderHideTopComponent);
            expect(output).to.include('Content');
            expect(output).to.include('Below');
            expect(output).to.not.include('╭');
            expect(output).to.not.include('╮');
        });

        it('should hide bottom border when borderBottom is false', async () => {
            @Component({
                selector: 'app-box-border-hide-bottom',
                template: `<text>Above</text
                    ><box [style]="outerStyle"
                        ><box [style]="boxStyle"><text>Content</text></box
                        ><text>Below</text></box
                    >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderHideBottomComponent {
                outerStyle: any = { flexDirection: 'column', alignItems: 'flex-start' };

                boxStyle: any = { borderStyle: 'round', borderBottom: false };
            }

            const output = await renderToString(BoxBorderHideBottomComponent);
            expect(output).to.include('Content');
            expect(output).to.include('Below');
            expect(output).to.not.include('╰');
            expect(output).to.not.include('╯');
        });

        it('should hide top and bottom borders', async () => {
            @Component({
                selector: 'app-box-border-hide-top-bottom',
                template: `<text>Above</text
                    ><box [style]="outerStyle"
                        ><box [style]="boxStyle"><text>Content</text></box
                        ><text>Below</text></box
                    >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderHideTopBottomComponent {
                outerStyle: any = { flexDirection: 'column', alignItems: 'flex-start' };

                boxStyle: any = { borderStyle: 'round', borderTop: false, borderBottom: false };
            }

            const output = await renderToString(BoxBorderHideTopBottomComponent);
            expect(output).to.include('Content');
            expect(output).to.not.include('╭');
            expect(output).to.not.include('╮');
            expect(output).to.not.include('╰');
            expect(output).to.not.include('╯');
        });

        it('should hide left border when borderLeft is false', async () => {
            @Component({
                selector: 'app-box-border-hide-left',
                template: `<text>Above</text
                    ><box [style]="outerStyle"
                        ><box [style]="boxStyle"><text>Content</text></box
                        ><text>Below</text></box
                    >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderHideLeftComponent {
                outerStyle: any = { flexDirection: 'column', alignItems: 'flex-start' };

                boxStyle: any = { borderStyle: 'round', borderLeft: false };
            }

            const output = await renderToString(BoxBorderHideLeftComponent);
            expect(output).to.include('Content');
            // Should not have left border corners or left edge
            expect(output).to.not.include('╭');
            expect(output).to.not.include('╰');
        });

        it('should hide right border when borderRight is false', async () => {
            @Component({
                selector: 'app-box-border-hide-right',
                template: `<text>Above</text
                    ><box [style]="outerStyle"
                        ><box [style]="boxStyle"><text>Content</text></box
                        ><text>Below</text></box
                    >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderHideRightComponent {
                outerStyle: any = { flexDirection: 'column', alignItems: 'flex-start' };

                boxStyle: any = { borderStyle: 'round', borderRight: false };
            }

            const output = await renderToString(BoxBorderHideRightComponent);
            expect(output).to.include('Content');
            // Should not have right border corners or right edge
            expect(output).to.not.include('╮');
            expect(output).to.not.include('╯');
        });

        it('should hide left and right borders', async () => {
            @Component({
                selector: 'app-box-border-hide-left-right',
                template: `<text>Above</text
                    ><box [style]="outerStyle"
                        ><box [style]="boxStyle"><text>Content</text></box
                        ><text>Below</text></box
                    >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderHideLeftRightComponent {
                outerStyle: any = { flexDirection: 'column', alignItems: 'flex-start' };

                boxStyle: any = { borderStyle: 'round', borderLeft: false, borderRight: false };
            }

            const output = await renderToString(BoxBorderHideLeftRightComponent);
            expect(output).to.include('Content');
            // Should not have side borders but may have top/bottom
            expect(output).to.not.include('│');
        });

        it('should hide all borders', async () => {
            @Component({
                selector: 'app-box-border-hide-all',
                template: `<text>Above</text
                    ><box [style]="outerStyle"
                        ><box [style]="boxStyle"><text>Content</text></box
                        ><text>Below</text></box
                    >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderHideAllComponent {
                outerStyle: any = { flexDirection: 'column', alignItems: 'flex-start' };

                boxStyle: any = {
                    borderStyle: 'round',
                    borderTop: false,
                    borderBottom: false,
                    borderLeft: false,
                    borderRight: false,
                };
            }

            const output = await renderToString(BoxBorderHideAllComponent);
            expect(output).to.include('Content');
            expect(output).to.not.include('╭');
            expect(output).to.not.include('╮');
            expect(output).to.not.include('╰');
            expect(output).to.not.include('╯');
            expect(output).to.not.include('│');
        });
    });

    describe('Border Color Controls', () => {
        it('should change color of top border with borderTopColor', async () => {
            @Component({
                selector: 'app-box-border-top-color',
                template: `<text>Above</text
                    ><box [style]="outerStyle"
                        ><box [style]="boxStyle"><text>Content</text></box
                        ><text>Below</text></box
                    >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderTopColorComponent {
                outerStyle: any = { flexDirection: 'column', alignItems: 'flex-start' };

                boxStyle: any = { borderStyle: 'round', borderTopColor: 'green' };
            }

            const output = await renderToString(BoxBorderTopColorComponent);
            expect(output).to.include('Content');
            expect(output).to.include('\u001B[32m');
        });

        it('should change color of bottom border with borderBottomColor', async () => {
            @Component({
                selector: 'app-box-border-bottom-color',
                template: `<text>Above</text
                    ><box [style]="outerStyle"
                        ><box [style]="boxStyle"><text>Content</text></box
                        ><text>Below</text></box
                    >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderBottomColorComponent {
                outerStyle: any = { flexDirection: 'column', alignItems: 'flex-start' };

                boxStyle: any = { borderStyle: 'round', borderBottomColor: 'green' };
            }

            const output = await renderToString(BoxBorderBottomColorComponent);
            expect(output).to.include('Content');
            expect(output).to.include('\u001B[32m');
        });

        it('should change color of left border with borderLeftColor', async () => {
            @Component({
                selector: 'app-box-border-left-color',
                template: `<text>Above</text
                    ><box [style]="outerStyle"
                        ><box [style]="boxStyle"><text>Content</text></box
                        ><text>Below</text></box
                    >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderLeftColorComponent {
                outerStyle: any = { flexDirection: 'column', alignItems: 'flex-start' };

                boxStyle: any = { borderStyle: 'round', borderLeftColor: 'green' };
            }

            const output = await renderToString(BoxBorderLeftColorComponent);
            expect(output).to.include('Content');
            expect(output).to.include('\u001B[32m');
        });

        it('should change color of right border with borderRightColor', async () => {
            @Component({
                selector: 'app-box-border-right-color',
                template: `<text>Above</text
                    ><box [style]="outerStyle"
                        ><box [style]="boxStyle"><text>Content</text></box
                        ><text>Below</text></box
                    >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderRightColorComponent {
                outerStyle: any = { flexDirection: 'column', alignItems: 'flex-start' };

                boxStyle: any = { borderStyle: 'round', borderRightColor: 'green' };
            }

            const output = await renderToString(BoxBorderRightColorComponent);
            expect(output).to.include('Content');
            expect(output).to.include('\u001B[32m');
        });
    });

    describe('Multiple Nodes Border Tests', () => {
        it('should render multiple text nodes with fit-content round border', async () => {
            @Component({
                selector: 'app-box-border-multi-fit',
                template: `<box [style]="boxStyle"><text>Hello </text><text>World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderMultiFitComponent {
                boxStyle: any = { borderStyle: 'round', alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxBorderMultiFitComponent);
            expect(output).to.equal('╭───────────╮\n│Hello World│\n╰───────────╯');
        });

        it('should render multiple nodes with wrapping and long text', async () => {
            @Component({
                selector: 'app-box-border-multi-long-wrap',
                template: `<box [style]="boxStyle"><text>Helloooooo World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderMultiLongWrapComponent {
                boxStyle: any = { borderStyle: 'round', width: 10 };
            }

            const output = await renderToString(BoxBorderMultiLongWrapComponent);
            // React original: boxen('Hello   \nWorld', {borderStyle: 'round'}) for width=10
            // "Helloooooo" (10 chars) fits exactly, "World" wraps to next line
            expect(output).to.include('Hello');
            expect(output).to.include('World');
            expect(output).to.include('╭');
            expect(output).to.include('╮');
        });

        it('should render multiple nodes with wrapping and very long text', async () => {
            @Component({
                selector: 'app-box-border-multi-very-long-wrap',
                template: `<box [style]="boxStyle"><text>Hellooooooooooooo World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBorderMultiVeryLongWrapComponent {
                boxStyle: any = { borderStyle: 'round', width: 10 };
            }

            const output = await renderToString(BoxBorderMultiVeryLongWrapComponent);
            // React original: verifies wrapping behavior for very long text
            // "Hellooooooooooooo World" (21 chars) with width=10 will wrap multiple times
            expect(output).to.include('Hello');
            expect(output).to.include('World');
            expect(output).to.include('╭');
            expect(output).to.include('╮');
        });
    });
});
