import { Component, input } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';

@Component({
    selector: 'ink-summary',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    template: `
        <box [style]="{ flexDirection: 'column', marginTop: 1 }">
            <box>
                <box [style]="{ width: 14 }">
                    <text [bold]="true">Test Suites:</text>
                </box>
                @if (failed() > 0) {
                    <text [bold]="true" [color]="'red'"> {{ failed() }} failed, </text>
                }
                @if (passed() > 0) {
                    <text [bold]="true" [color]="'green'"> {{ passed() }} passed, </text>
                }
                <text>{{ passed() + failed() }} total</text>
            </box>

            <box>
                <box [style]="{ width: 14 }">
                    <text [bold]="true">Time:</text>
                </box>
                <text>{{ time() }}</text>
            </box>

            @if (isFinished()) {
                <box>
                    <text [dimColor]="true">Ran all test suites.</text>
                </box>
            }
        </box>
    `,
})
export class SummaryComponent {
    isFinished = input.required<boolean>();
    passed = input.required<number>();
    failed = input.required<number>();
    time = input.required<string>();
}
