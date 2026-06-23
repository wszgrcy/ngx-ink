import { Component, signal, computed, OnDestroy } from '@angular/core';
import { BoxComponent } from '@cyia/ngx-lib';
import { StaticComponent } from '@cyia/ngx-lib';
import { TestItemComponent } from './test-item.component';
import { SummaryComponent } from './summary.component';
import PQueue from 'p-queue';
import delay from 'delay';
import ms from 'ms';

const paths = [
    'tests/login.js',
    'tests/signup.js',
    'tests/forgot-password.js',
    'tests/reset-password.js',
    'tests/view-profile.js',
    'tests/edit-profile.js',
    'tests/delete-profile.js',
    'tests/posts.js',
    'tests/post.js',
    'tests/comments.js',
];

type TestResult = {
    path: string;
    status: string;
};

@Component({
    selector: 'ink-jest-example',
    standalone: true,
    imports: [BoxComponent, StaticComponent, TestItemComponent, SummaryComponent],
    templateUrl: './jest-example.component.html',
})
export class JestExampleComponent implements OnDestroy {
    startTime = Date.now();
    completedTests = signal<TestResult[]>([]);
    runningTests = signal<TestResult[]>([]);

    private async runTest(path: string) {
        this.runningTests.update((prev) => [...prev, { status: 'runs', path }]);

        await delay(1000 * Math.random());

        this.runningTests.update((prev) => prev.filter((t) => t.path !== path));
        this.completedTests.update((prev) => [
            ...prev,
            { status: Math.random() < 0.5 ? 'pass' : 'fail', path },
        ]);
    }

    ngOnInit() {
        const queue = new PQueue({ concurrency: 4 });

        for (const path of paths) {
            void queue.add(async () => this.runTest(path));
        }
    }

    // Equivalent to React's derived state in Summary component props
    isFinished = computed(() => this.runningTests().length === 0);

    passedCount = computed(() => this.completedTests().filter((t) => t.status === 'pass').length);

    failedCount = computed(() => this.completedTests().filter((t) => t.status === 'fail').length);

    elapsedTime = computed(() => ms(Date.now() - this.startTime));

    ngOnDestroy() {
        // cleanup if needed
    }
}
