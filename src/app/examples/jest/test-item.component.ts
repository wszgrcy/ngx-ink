import { Component, input } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';

@Component({
    selector: 'ink-test-item',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    template: `
        <box>
            <text [style]="{ color: 'black' }" [backgroundColor]="getBackgroundForStatus(status())">
                {{ getStatusLabel() }}
            </text>
            <box [style]="{ marginLeft: 1 }">
                <text [dimColor]="true">{{ path().split('/')[0] }}/</text>
                <text [bold]="true" [color]="'white'">{{ path().split('/')[1] }}</text>
            </box>
        </box>
    `,
})
export class TestItemComponent {
    status = input.required<string>();
    path = input.required<string>();

    getBackgroundForStatus(status: string): string | undefined {
        switch (status) {
            case 'runs':
                return 'yellow';
            case 'pass':
                return 'green';
            case 'fail':
                return 'red';
            default:
                return undefined;
        }
    }

    getStatusLabel(): string {
        const status = this.status();
        return ` ${status.toUpperCase()} `;
    }
}
