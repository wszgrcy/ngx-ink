import { Component, signal, OnDestroy } from '@angular/core';
import { BoxComponent, StaticComponent, TextComponent } from '@cyia/ngx-lib';

interface Test {
    id: number;
    title: string;
}

@Component({
    selector: 'ink-static-example',
    standalone: true,
    imports: [BoxComponent, StaticComponent, TextComponent],
    templateUrl: './static-example.component.html',
})
export class StaticExampleComponent implements OnDestroy {
    tests = signal<Test[]>([]);
    private timer: ReturnType<typeof setTimeout> | undefined;
    private completedTests = 0;

    ngOnInit() {
        const run = () => {
            if (this.completedTests++ < 10) {
                this.tests.update((previousTests) => [
                    ...previousTests,
                    {
                        id: previousTests.length,
                        title: `Test #${previousTests.length + 1}`,
                    },
                ]);

                this.timer = setTimeout(run, 100);
            }
        };

        run();
    }

    ngOnDestroy() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
}
