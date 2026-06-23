import { Component, signal, OnDestroy } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';

@Component({
    selector: 'ink-render-throttle-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './render-throttle-example.component.html',
})
export class RenderThrottleExampleComponent implements OnDestroy {
    count = signal(0);
    private timer: ReturnType<typeof setInterval> | undefined;

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.timer = setInterval(() => {
            this.count.update((v) => v + 1);
        }, 10);
    }
    ngOnDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}
