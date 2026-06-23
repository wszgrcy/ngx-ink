import { Component, OnDestroy, signal } from '@angular/core';
import { TextComponent } from '@cyia/ngx-lib';

@Component({
    selector: 'ink-counter-example',
    standalone: true,
    imports: [TextComponent],
    templateUrl: './counter-example.component.html',
})
export class CounterExampleComponent implements OnDestroy {
    counter = signal(0);
    private timer: ReturnType<typeof setInterval> | undefined;
    ngOnInit(): void {
        this.timer = setInterval(() => {
            this.counter.update((v) => v + 1);
        }, 100);
    }

    ngOnDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}
