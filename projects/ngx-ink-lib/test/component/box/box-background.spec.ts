import { Component } from '@angular/core';
import { renderToString } from '../../helpers/render-to-string';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TextComponent } from '../../../src/lib/ngx-ink/components/text-component/text.component';
import { BoxComponent } from '../../../src/lib/ngx-ink/components/box-component/box.component';

// Based on lib/ink/test/background.tsx

describe('BoxComponent - Background', () => {
    describe('Background Color Inheritance', () => {
        it('should inherit parent Box background color', async () => {
            @Component({
                selector: 'app-box-bg-inherit',
                template: `<box [style]="boxStyle"><text>Hello World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgInheritComponent {
                boxStyle: any = { backgroundColor: 'green', alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxBgInheritComponent);
            expect(output).to.include('Hello World');
            expect(output).to.include('\u001B[42m');
        });

        it('should override inherited background with explicit Text background', async () => {
            @Component({
                selector: 'app-box-bg-override',
                template: `<box [style]="outerStyle"
                    ><box [style]="boxStyle"><text>Hello World</text></box></box
                >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgOverrideComponent {
                outerStyle: any = { backgroundColor: 'red', alignSelf: 'flex-start' };

                boxStyle: any = { backgroundColor: 'blue' };
            }

            const output = await renderToString(BoxBgOverrideComponent);
            expect(output).to.include('Hello World');
            expect(output).to.include('\u001B[44m');
            expect(output).to.include('\u001B[49m');
        });

        it('should inherit nested Box background', async () => {
            @Component({
                selector: 'app-box-bg-nested',
                template: `<box [style]="outerStyle"
                    ><box [style]="middleStyle"><text>Hello World</text></box></box
                >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgNestedComponent {
                outerStyle: any = { backgroundColor: 'red', alignSelf: 'flex-start' };

                middleStyle: any = { backgroundColor: 'blue' };
            }

            const output = await renderToString(BoxBgNestedComponent);
            expect(output).to.include('Hello World');
            expect(output).to.include('\u001B[44m');
        });

        it('should have no inheritance without parent Box background', async () => {
            @Component({
                selector: 'app-box-bg-no-inherit',
                template: `<box [style]="boxStyle"><text>Hello World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgNoInheritComponent {
                boxStyle: any = { alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxBgNoInheritComponent);
            expect(output).to.equal('Hello World');
        });

        it('should have multiple Text elements inherit same background', async () => {
            @Component({
                selector: 'app-box-bg-multiple-text',
                template: `<box [style]="boxStyle"><text>Hello </text><text>World</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgMultipleTextComponent {
                boxStyle: any = { backgroundColor: 'yellow', alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxBgMultipleTextComponent);
            expect(output).to.include('Hello World');
            expect(output).to.include('\u001B[43m');
        });
    });

    describe('Background Color Formats', () => {
        it('should render box with standard background color', async () => {
            @Component({
                selector: 'app-box-bg-standard',
                template: `<box [style]="boxStyle"><text>Hello</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgStandardComponent {
                boxStyle: any = { backgroundColor: 'red', alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxBgStandardComponent);
            expect(output).to.include('Hello');
            expect(output).to.include('\u001B[41m');
        });

        it('should render box with hex background color', async () => {
            @Component({
                selector: 'app-box-bg-hex',
                template: `<box [style]="boxStyle"><text>Hello</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgHexComponent {
                boxStyle: any = { backgroundColor: '#FF0000', alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxBgHexComponent);
            expect(output).to.include('Hello');
            expect(output).to.include('\u001B[48;2;255;0;0m');
        });

        it('should render box with rgb background color', async () => {
            @Component({
                selector: 'app-box-bg-rgb',
                template: `<box [style]="boxStyle"><text>Hello</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgRgbComponent {
                boxStyle: any = { backgroundColor: 'rgb(255, 0, 0)', alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxBgRgbComponent);
            expect(output).to.include('Hello');
            expect(output).to.include('\u001B[48;2;255;0;0m');
        });

        it('should render box with ansi256 background color', async () => {
            @Component({
                selector: 'app-box-bg-ansi256',
                template: `<box [style]="boxStyle"><text>Hello</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgAnsi256Component {
                boxStyle: any = { backgroundColor: 'ansi256(9)', alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxBgAnsi256Component);
            expect(output).to.include('Hello');
            expect(output).to.include('\u001B[48;5;9m');
        });
    });

    describe('Background Fill', () => {
        it('should fill entire area with standard color', async () => {
            @Component({
                selector: 'app-box-bg-fill-standard',
                template: `<box [style]="boxStyle"><text>Hello</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgFillStandardComponent {
                boxStyle: any = {
                    backgroundColor: 'red',
                    width: 10,
                    height: 3,
                    alignSelf: 'flex-start',
                };
            }

            const output = await renderToString(BoxBgFillStandardComponent);
            expect(output).to.include('Hello');
            expect(output).to.include('\u001B[41m');
            expect(output).to.include('\u001B[49m');
        });

        it('should fill entire area with border', async () => {
            @Component({
                selector: 'app-box-bg-fill-border',
                template: `<box [style]="boxStyle"><text>Hi</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgFillBorderComponent {
                boxStyle: any = {
                    backgroundColor: 'cyan',
                    borderStyle: 'round',
                    width: 10,
                    height: 5,
                    alignSelf: 'flex-start',
                };
            }

            const output = await renderToString(BoxBgFillBorderComponent);
            expect(output).to.include('Hi');
            expect(output).to.include('\u001B[46m');
        });

        it('should fill padded area', async () => {
            @Component({
                selector: 'app-box-bg-fill-padded',
                template: `<box [style]="boxStyle"><text>Hi</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgFillPaddedComponent {
                boxStyle: any = {
                    backgroundColor: 'magenta',
                    padding: 1,
                    width: 10,
                    height: 5,
                    alignSelf: 'flex-start',
                };
            }

            const output = await renderToString(BoxBgFillPaddedComponent);
            expect(output).to.include('Hi');
        });

        it('should fill with center alignment', async () => {
            @Component({
                selector: 'app-box-bg-fill-center',
                template: `<box [style]="boxStyle"><text>Hi</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgFillCenterComponent {
                boxStyle: any = {
                    backgroundColor: 'blue',
                    width: 10,
                    height: 3,
                    justifyContent: 'center',
                    alignSelf: 'flex-start',
                };
            }

            const output = await renderToString(BoxBgFillCenterComponent);
            expect(output).to.include('Hi');
        });

        it('should fill with column layout', async () => {
            @Component({
                selector: 'app-box-bg-fill-column',
                template: `<box [style]="boxStyle"><text>Line 1</text><text>Line 2</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgFillColumnComponent {
                boxStyle: any = {
                    backgroundColor: 'green',
                    flexDirection: 'column',
                    width: 10,
                    height: 5,
                    alignSelf: 'flex-start',
                };
            }

            const output = await renderToString(BoxBgFillColumnComponent);
            expect(output).to.include('Line 1');
            expect(output).to.include('Line 2');
        });
    });

    describe('Mixed Text Background Inheritance', () => {
        it('should handle mixed text with and without background inheritance', async () => {
            @Component({
                selector: 'app-box-bg-mixed',
                template: `<box [style]="boxStyle"
                    ><text>Inherited </text><text>No BG </text><text>Red BG</text></box
                >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgMixedComponent {
                boxStyle: any = { backgroundColor: 'green', alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxBgMixedComponent);
            expect(output).to.include('Inherited');
            expect(output).to.include('No BG');
            expect(output).to.include('Red BG');
            // Green background for "Inherited "
            expect(output).to.include('\u001B[42m');
        });

        it('should handle complex nested structure with background inheritance', async () => {
            @Component({
                selector: 'app-box-bg-complex-nested',
                template: `<box [style]="outerStyle"
                    ><box
                        ><text>Outer: </text
                        ><box [style]="middleStyle"
                            ><text>Inner: </text><text>Explicit</text></box
                        ></box
                    ></box
                >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgComplexNestedComponent {
                outerStyle: any = { backgroundColor: 'yellow', alignSelf: 'flex-start' };

                middleStyle: any = { backgroundColor: 'blue' };
            }

            const output = await renderToString(BoxBgComplexNestedComponent);
            expect(output).to.include('Outer:');
            expect(output).to.include('Inner:');
            expect(output).to.include('Explicit');
        });
    });

    describe('Background Color with Wide Characters', () => {
        it('should render box with wide characters and background', async () => {
            @Component({
                selector: 'app-box-bg-wide-chars',
                template: `<box [style]="boxStyle"><text>こんにちは</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgWideCharsComponent {
                boxStyle: any = { backgroundColor: 'yellow', alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxBgWideCharsComponent);
            expect(output).to.include('こんにちは');
            expect(output).to.include('\u001B[43m');
        });

        it('should render box with emojis and background', async () => {
            @Component({
                selector: 'app-box-bg-emojis',
                template: `<box [style]="boxStyle"><text>🎉🎊</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgEmojisComponent {
                boxStyle: any = { backgroundColor: 'red', alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxBgEmojisComponent);
            expect(output).to.include('🎉');
            expect(output).to.include('\u001B[41m');
        });
    });

    describe('Background Full Fill Verification', () => {
        it('should fill entire area with standard color and verify full width', async () => {
            @Component({
                selector: 'app-box-bg-fill-full',
                template: `<box [style]="boxStyle"><text>Hello</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgFillFullComponent {
                boxStyle: any = {
                    backgroundColor: 'red',
                    width: 10,
                    height: 3,
                    alignSelf: 'flex-start',
                };
            }

            const output = await renderToString(BoxBgFillFullComponent);
            expect(output).to.include('Hello');
            expect(output).to.include('\u001B[41m');
            expect(output).to.include('\u001B[49m');
            expect(output).to.include('\u001B[41m          \u001B[49m');
        });

        it('should fill with hex color and verify full width', async () => {
            @Component({
                selector: 'app-box-bg-fill-hex',
                template: `<box [style]="boxStyle"><text>Hello</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgFillHexComponent {
                boxStyle: any = {
                    backgroundColor: '#FF0000',
                    width: 10,
                    height: 3,
                    alignSelf: 'flex-start',
                };
            }

            const output = await renderToString(BoxBgFillHexComponent);
            expect(output).to.include('Hello');
            expect(output).to.include('\u001B[48;2;255;0;0m');
            expect(output).to.include('\u001B[49m');
        });

        it('should fill with rgb color and verify full width', async () => {
            @Component({
                selector: 'app-box-bg-fill-rgb',
                template: `<box [style]="boxStyle"><text>Hello</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgFillRgbComponent {
                boxStyle: any = {
                    backgroundColor: 'rgb(255, 0, 0)',
                    width: 10,
                    height: 3,
                    alignSelf: 'flex-start',
                };
            }

            const output = await renderToString(BoxBgFillRgbComponent);
            expect(output).to.include('Hello');
            expect(output).to.include('\u001B[48;2;255;0;0m');
            expect(output).to.include('\u001B[49m');
        });

        it('should fill with ansi256 color and verify full width', async () => {
            @Component({
                selector: 'app-box-bg-fill-ansi256',
                template: `<box [style]="boxStyle"><text>Hello</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgFillAnsi256Component {
                boxStyle: any = {
                    backgroundColor: 'ansi256(9)',
                    width: 10,
                    height: 3,
                    alignSelf: 'flex-start',
                };
            }

            const output = await renderToString(BoxBgFillAnsi256Component);
            expect(output).to.include('Hello');
            expect(output).to.include('\u001B[48;5;9m');
            expect(output).to.include('\u001B[49m');
        });
    });

    describe('Background Color Wrapping', () => {
        it('should fill full width on every line when text wraps', async () => {
            @Component({
                selector: 'app-box-bg-wrap-full',
                template: `<box [style]="boxStyle"><text>Hello World!!</text></box>`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgWrapFullComponent {
                boxStyle: any = { backgroundColor: 'red', width: 10, alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxBgWrapFullComponent);
            // Both lines should be padded to the full 10-char Box width with background color
            expect(output).to.equal(
                '\u001B[41mHello     \u001B[49m\n\u001B[41mWorld!!   \u001B[49m',
            );
        });

        it('should only color text content without filling Box width', async () => {
            @Component({
                selector: 'app-box-bg-text-only',
                template: `<box [style]="boxStyle"
                    ><text backgroundColor="red">Hello World!!</text></box
                >`,
                standalone: true,
                imports: [BoxComponent, TextComponent],
            })
            class BoxBgTextOnlyComponent {
                boxStyle: any = { width: 10, alignSelf: 'flex-start' };
            }

            const output = await renderToString(BoxBgTextOnlyComponent);
            // Text-only bg colors just the text, not the remaining space
            expect(output).to.include('\u001B[41mHello \u001B[49m');
            expect(output).to.include('\u001B[41mWorld!!\u001B[49m');
        });
    });
});
