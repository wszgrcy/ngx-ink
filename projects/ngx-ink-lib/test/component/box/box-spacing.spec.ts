import { Component } from '@angular/core';
import { renderToString } from '../../helpers/render-to-string';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TextComponent } from '../../../src/lib/ngx-ink/components/text-component/text.component';
import { BoxComponent } from '../../../src/lib/ngx-ink/components/box-component/box.component';

// Based on lib/ink/test/margin.tsx, padding.tsx, gap.tsx

describe('BoxComponent - Margin', () => {
    it('should render box with margin', async () => {
        @Component({
            selector: 'app-box-margin',
            template: `<box [style]="boxStyle"><text>X</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxMarginComponent {
            boxStyle: any = { margin: 2 };
        }

        const output = await renderToString(BoxMarginComponent);
        expect(output).to.equal('\n\n  X\n\n');
    });

    it('should render box with marginX', async () => {
        @Component({
            selector: 'app-box-margin-x',
            template: `<box [style]="outerStyle"
                ><box [style]="boxStyle"><text>X</text></box
                ><text>Y</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxMarginXComponent {
            outerStyle: any = {};

            boxStyle: any = { marginX: 2 };
        }

        const output = await renderToString(BoxMarginXComponent);
        expect(output).to.equal('  X  Y');
    });

    it('should render box with marginY', async () => {
        @Component({
            selector: 'app-box-margin-y',
            template: `<box [style]="boxStyle"><text>X</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxMarginYComponent {
            boxStyle: any = { marginY: 2 };
        }

        const output = await renderToString(BoxMarginYComponent);
        expect(output).to.equal('\n\nX\n\n');
    });

    it('should render box with marginTop', async () => {
        @Component({
            selector: 'app-box-margin-top',
            template: `<box [style]="boxStyle"><text>X</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxMarginTopComponent {
            boxStyle: any = { marginTop: 2 };
        }

        const output = await renderToString(BoxMarginTopComponent);
        expect(output).to.equal('\n\nX');
    });

    it('should render box with marginBottom', async () => {
        @Component({
            selector: 'app-box-margin-bottom',
            template: `<box [style]="boxStyle"><text>X</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxMarginBottomComponent {
            boxStyle: any = { marginBottom: 2 };
        }

        const output = await renderToString(BoxMarginBottomComponent);
        expect(output).to.equal('X\n\n');
    });

    it('should render box with marginLeft', async () => {
        @Component({
            selector: 'app-box-margin-left',
            template: `<box [style]="boxStyle"><text>X</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxMarginLeftComponent {
            boxStyle: any = { marginLeft: 2 };
        }

        const output = await renderToString(BoxMarginLeftComponent);
        expect(output).to.equal('  X');
    });

    it('should render box with marginRight', async () => {
        @Component({
            selector: 'app-box-margin-right',
            template: `<box [style]="outerStyle"
                ><box [style]="boxStyle"><text>X</text></box
                ><text>Y</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxMarginRightComponent {
            outerStyle: any = {};

            boxStyle: any = { marginRight: 2 };
        }

        const output = await renderToString(BoxMarginRightComponent);
        expect(output).to.equal('X  Y');
    });

    it('should render nested margin', async () => {
        @Component({
            selector: 'app-box-nested-margin',
            template: `<box [style]="outerStyle"
                ><box [style]="innerStyle"><text>X</text></box></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxNestedMarginComponent {
            outerStyle: any = { margin: 2 };

            innerStyle: any = { margin: 2 };
        }

        const output = await renderToString(BoxNestedMarginComponent);
        expect(output).to.equal('\n\n\n\n    X\n\n\n\n');
    });

    it('should apply margin to text with newlines', async () => {
        @Component({
            selector: 'app-box-margin-newlines',
            template: `<box [style]="boxStyle"
                ><text>{{ content }}</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxMarginNewlinesComponent {
            boxStyle: any = { margin: 2 };
            content = 'A\nB';
        }

        const output = await renderToString(BoxMarginNewlinesComponent);
        expect(output).to.equal('\n\n  A\n  B\n\n');
    });

    it('should apply margin to wrapped text', async () => {
        @Component({
            selector: 'app-box-margin-wrapped',
            template: `<box [style]="boxStyle"><text>Hello World</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxMarginWrappedComponent {
            boxStyle: any = { margin: 1, width: 6 };
        }

        const output = await renderToString(BoxMarginWrappedComponent);
        expect(output).to.equal('\n Hello\n World\n');
    });
});

describe('BoxComponent - Padding', () => {
    it('should render box with padding', async () => {
        @Component({
            selector: 'app-box-padding',
            template: `<box [style]="boxStyle"><text>X</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxPaddingComponent {
            boxStyle: any = { padding: 2 };
        }

        const output = await renderToString(BoxPaddingComponent);
        expect(output).to.equal('\n\n  X\n\n');
    });

    it('should render box with paddingX', async () => {
        @Component({
            selector: 'app-box-padding-x',
            template: `<box [style]="outerStyle"
                ><box [style]="boxStyle"><text>X</text></box
                ><text>Y</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxPaddingXComponent {
            outerStyle: any = {};

            boxStyle: any = { paddingX: 2 };
        }

        const output = await renderToString(BoxPaddingXComponent);
        expect(output).to.equal('  X  Y');
    });

    it('should render box with paddingY', async () => {
        @Component({
            selector: 'app-box-padding-y',
            template: `<box [style]="boxStyle"><text>X</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxPaddingYComponent {
            boxStyle: any = { paddingY: 2 };
        }

        const output = await renderToString(BoxPaddingYComponent);
        expect(output).to.equal('\n\nX\n\n');
    });

    it('should render box with paddingTop', async () => {
        @Component({
            selector: 'app-box-padding-top',
            template: `<box [style]="boxStyle"><text>X</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxPaddingTopComponent {
            boxStyle: any = { paddingTop: 2 };
        }

        const output = await renderToString(BoxPaddingTopComponent);
        expect(output).to.equal('\n\nX');
    });

    it('should render box with paddingBottom', async () => {
        @Component({
            selector: 'app-box-padding-bottom',
            template: `<box [style]="boxStyle"><text>X</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxPaddingBottomComponent {
            boxStyle: any = { paddingBottom: 2 };
        }

        const output = await renderToString(BoxPaddingBottomComponent);
        expect(output).to.equal('X\n\n');
    });

    it('should render box with paddingLeft', async () => {
        @Component({
            selector: 'app-box-padding-left',
            template: `<box [style]="boxStyle"><text>X</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxPaddingLeftComponent {
            boxStyle: any = { paddingLeft: 2 };
        }

        const output = await renderToString(BoxPaddingLeftComponent);
        expect(output).to.equal('  X');
    });

    it('should render box with paddingRight', async () => {
        @Component({
            selector: 'app-box-padding-right',
            template: `<box [style]="outerStyle"
                ><box [style]="boxStyle"><text>X</text></box
                ><text>Y</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxPaddingRightComponent {
            outerStyle: any = {};

            boxStyle: any = { paddingRight: 2 };
        }

        const output = await renderToString(BoxPaddingRightComponent);
        expect(output).to.equal('X  Y');
    });

    it('should render nested padding', async () => {
        @Component({
            selector: 'app-box-nested-padding',
            template: `<box [style]="outerStyle"
                ><box [style]="innerStyle"><text>X</text></box></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxNestedPaddingComponent {
            outerStyle: any = { padding: 2 };

            innerStyle: any = { padding: 2 };
        }

        const output = await renderToString(BoxNestedPaddingComponent);
        expect(output).to.equal('\n\n\n\n    X\n\n\n\n');
    });

    it('should apply padding to text with newlines', async () => {
        @Component({
            selector: 'app-box-padding-newlines',
            template: `<box [style]="boxStyle"
                ><text>{{ content }}</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxPaddingNewlinesComponent {
            boxStyle: any = { padding: 1 };
            content = 'Hello\nWorld';
        }

        const output = await renderToString(BoxPaddingNewlinesComponent);
        expect(output).to.equal('\n Hello\n World\n');
    });

    it('should apply padding to wrapped text', async () => {
        @Component({
            selector: 'app-box-padding-wrapped',
            template: `<box [style]="boxStyle"><text>Hello World</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxPaddingWrappedComponent {
            boxStyle: any = { padding: 1, width: 5 };
        }

        const output = await renderToString(BoxPaddingWrappedComponent);
        expect(output).to.equal('\n Hel\n lo\n Wor\n ld\n');
    });
});

describe('BoxComponent - Gap', () => {
    it('should render box with gap', async () => {
        @Component({
            selector: 'app-box-gap',
            template: `<box [style]="boxStyle"><text>A</text><text>B</text><text>C</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxGapComponent {
            boxStyle: any = { gap: 1, width: 3, flexWrap: 'wrap' };
        }

        const output = await renderToString(BoxGapComponent);
        expect(output).to.equal('A B\n\nC');
    });

    it('should render box with column gap', async () => {
        @Component({
            selector: 'app-box-column-gap',
            template: `<box [style]="boxStyle"><text>A</text><text>B</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxColumnGapComponent {
            boxStyle: any = { gap: 1 };
        }

        const output = await renderToString(BoxColumnGapComponent);
        expect(output).to.equal('A B');
    });

    it('should render box with row gap', async () => {
        @Component({
            selector: 'app-box-row-gap',
            template: `<box [style]="boxStyle"><text>A</text><text>B</text></box>`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxRowGapComponent {
            boxStyle: any = { flexDirection: 'column', gap: 1 };
        }

        const output = await renderToString(BoxRowGapComponent);
        expect(output).to.equal('A\n\nB');
    });

    it('should respect paddingX with flexGrow on text wrapping', async () => {
        @Component({
            selector: 'app-box-padding-flexgrow-wrap',
            template: `<box [style]="outerStyle"
                ><box [style]="paddingStyle"
                    ><box [style]="marginLeftStyle"
                        ><text>•</text
                        ><box [style]="flexStyle"
                            ><text
                                >Lorem ipsum dolor sit amet, consectetur adipiscing elit</text
                            ></box
                        ></box
                    ></box
                ></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxPaddingFlexGrowWrapComponent {
            outerStyle: any = { width: 40, borderStyle: 'single' };

            paddingStyle: any = { paddingX: 2 };

            marginLeftStyle: any = { marginLeft: 2 };

            flexStyle: any = { flexGrow: 1, marginLeft: 1 };
        }

        const output = await renderToString(BoxPaddingFlexGrowWrapComponent);
        const lines = output.split('\n');
        for (const line of lines) {
            expect(line.length).to.be.lessThanOrEqual(40);
        }
    });
});
