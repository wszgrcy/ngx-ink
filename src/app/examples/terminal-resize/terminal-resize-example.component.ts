import { Component, computed } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import { useWindowSize } from '@cyia/ngx-lib';

@Component({
    selector: 'ink-terminal-resize-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './terminal-resize-example.component.html',
})
export class TerminalResizeExampleComponent {
    readonly windowSize = useWindowSize();
    readonly columns = computed(() => this.windowSize().columns);
    readonly rows = computed(() => this.windowSize().rows);
}
