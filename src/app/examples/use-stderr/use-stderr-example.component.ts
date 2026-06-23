import { Component, OnDestroy } from '@angular/core';
import { TextComponent, useStderr } from '@cyia/ngx-lib';

@Component({
    selector: 'ink-use-stderr-example',
    standalone: true,
    imports: [TextComponent],
    templateUrl: './use-stderr-example.component.html',
})
export class UseStderrExampleComponent implements OnDestroy {
    private readonly stderr = useStderr();
    private timer: ReturnType<typeof setInterval> | undefined;

    ngOnInit() {
        this.timer = setInterval(() => {
            this.stderr().write('Hello from Ink to stderr\n');
        }, 1000);
    }

    ngOnDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}
