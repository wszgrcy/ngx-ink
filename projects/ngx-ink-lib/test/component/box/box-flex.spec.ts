import { Component } from '@angular/core';
import { renderToString } from '../../helpers/render-to-string';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TextComponent } from '../../../src/lib/ngx-ink/components/text-component/text.component';
import { BoxComponent } from '../../../src/lib/ngx-ink/components/box-component/box.component';

// Based on lib/ink/test/flex.tsx

describe('BoxComponent - Flex Grow', () => {
    it('should grow equally', async () => {
        @Component({
            selector: 'app-box-flex-grow-equal',
            template: `<box [style]="containerStyle"
                ><box [style]="box1Style"><text>A</text></box
                ><box [style]="box2Style"><text>B</text></box></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxFlexGrowEqualComponent {
            containerStyle: any = { width: 6 };

            box1Style: any = { flexGrow: 1 };

            box2Style: any = { flexGrow: 1 };
        }

        const output = await renderToString(BoxFlexGrowEqualComponent);
        expect(output).to.equal('A  B');
    });

    it('should grow one element', async () => {
        @Component({
            selector: 'app-box-flex-grow-one',
            template: `<box [style]="containerStyle"
                ><box [style]="boxStyle"><text>A</text></box
                ><text>B</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxFlexGrowOneComponent {
            containerStyle: any = { width: 6 };

            boxStyle: any = { flexGrow: 1 };
        }

        const output = await renderToString(BoxFlexGrowOneComponent);
        expect(output).to.equal('A    B');
    });
});

describe('BoxComponent - Flex Shrink', () => {
    it('should not shrink when flexShrink is 0', async () => {
        @Component({
            selector: 'app-box-flex-shrink-no',
            template: `<box [style]="containerStyle"
                ><box [style]="box1Style"><text>A</text></box
                ><box [style]="box2Style"><text>B</text></box
                ><box [style]="box3Style"><text>C</text></box></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxFlexShrinkNoComponent {
            containerStyle: any = { width: 16 };

            box1Style: any = { flexShrink: 0, width: 6 };

            box2Style: any = { flexShrink: 0, width: 6 };

            box3Style: any = { width: 6 };
        }

        const output = await renderToString(BoxFlexShrinkNoComponent);
        expect(output).to.equal('A     B     C');
    });

    it('should shrink equally', async () => {
        @Component({
            selector: 'app-box-flex-shrink-equal',
            template: `<box [style]="containerStyle"
                ><box [style]="box1Style"><text>A</text></box
                ><box [style]="box2Style"><text>B</text></box
                ><text>C</text></box
            >`,
            standalone: true,
            imports: [BoxComponent, TextComponent],
        })
        class BoxFlexShrinkEqualComponent {
            containerStyle: any = { width: 10 };

            box1Style: any = { flexShrink: 1, width: 6 };

            box2Style: any = { flexShrink: 1, width: 6 };
        }

        const output = await renderToString(BoxFlexShrinkEqualComponent);
        expect(output).to.equal('A    B   C');
    });
});

describe('BoxComponent - Flex Basis', () => {
    describe('row container', () => {
        it('should set flex basis with number', async () => {
            @Component({
                selector: 'app-box-flex-basis-number',
                template: `<box [style]="containerStyle"
                    ><box [style]="boxStyle"><text>A</text></box
                    ><text>B</text></box
                >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxFlexBasisNumberComponent {
                containerStyle: any = { width: 6 };

                boxStyle: any = { flexBasis: 3 };
            }

            const output = await renderToString(BoxFlexBasisNumberComponent);
            expect(output).to.equal('A  B');
        });

        it('should set flex basis in percent', async () => {
            @Component({
                selector: 'app-box-flex-basis-percent',
                template: `<box [style]="containerStyle"
                    ><box [style]="boxStyle"><text>A</text></box
                    ><text>B</text></box
                >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxFlexBasisPercentComponent {
                containerStyle: any = { width: 6 };

                boxStyle: any = { flexBasis: '50%' };
            }

            const output = await renderToString(BoxFlexBasisPercentComponent);
            expect(output).to.equal('A  B');
        });
    });

    describe('column container', () => {
        it('should set flex basis with number', async () => {
            @Component({
                selector: 'app-box-flex-basis-col-number',
                template: `<box [style]="containerStyle"
                    ><box [style]="boxStyle"><text>A</text></box
                    ><text>B</text></box
                >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxFlexBasisColNumberComponent {
                containerStyle: any = { height: 6, flexDirection: 'column' };

                boxStyle: any = { flexBasis: 3 };
            }

            const output = await renderToString(BoxFlexBasisColNumberComponent);
            expect(output).to.equal('A\n\n\nB\n\n');
        });

        it('should set flex basis in percent', async () => {
            @Component({
                selector: 'app-box-flex-basis-col-percent',
                template: `<box [style]="containerStyle"
                    ><box [style]="boxStyle"><text>A</text></box
                    ><text>B</text></box
                >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxFlexBasisColPercentComponent {
                containerStyle: any = { height: 6, flexDirection: 'column' };

                boxStyle: any = { flexBasis: '50%' };
            }

            const output = await renderToString(BoxFlexBasisColPercentComponent);
            expect(output).to.equal('A\n\n\nB\n\n');
        });
    });
});
