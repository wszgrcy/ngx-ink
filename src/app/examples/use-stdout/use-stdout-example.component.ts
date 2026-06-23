import { Component, OnDestroy, computed } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import { useStdout } from '@cyia/ngx-lib';

@Component({
    selector: 'ink-use-stdout-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './use-stdout-example.component.html',
})
export class UseStdoutExampleComponent implements OnDestroy {
    private readonly stdout = useStdout();
    private timer: ReturnType<typeof setInterval> | undefined;
    readonly columns = computed(() => this.stdout().stdout.columns);
    readonly rows = computed(() => this.stdout().stdout.rows);

    ngOnInit() {
        this.timer = setInterval(() => {
            this.stdout().write('Hello from Ink to stdout\n');
        }, 1000);
    }

    ngOnDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}
