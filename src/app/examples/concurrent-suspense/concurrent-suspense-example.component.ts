import { Component, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';

const cache = new Map<string, { status: string; data?: string }>();

/**
 * Represents a Suspense-bound data item.
 * - data: undefined = pending (Suspense will show fallback)
 * - data: string = resolved (Suspense shows data)
 */
type DataItem = {
    /** undefined while pending (throws promise in React), string when resolved */
    data: string | undefined;
};

@Component({
    selector: 'ink-concurrent-suspense-example',
    standalone: true,
    imports: [BoxComponent, NgTemplateOutlet, TextComponent],
    templateUrl: './concurrent-suspense-example.component.html',
})
export class ConcurrentSuspenseExampleComponent implements AfterViewInit, OnDestroy {
    /** Controls whether the dynamic data section is rendered (like React's conditional rendering) */
    showMore = signal(false);

    /** Each data item uses a single signal: undefined = pending (Suspense fallback), string = resolved */
    fastData = signal<string | undefined>(undefined);
    mediumData = signal<string | undefined>(undefined);
    slowData = signal<string | undefined>(undefined);
    dynamicData = signal<string | undefined>(undefined);

    private timers: ReturnType<typeof setTimeout>[] = [];

    ngAfterViewInit() {
        // Auto-trigger "show more" after 2 seconds (like React's useEffect)
        this.timers.push(
            setTimeout(() => {
                this.showMore.set(true);
                this.fetchData('dynamic', 500);
            }, 2000),
        );

        // Start all data fetches concurrently (like React's concurrent mode)
        this.fetchData('fast', 200);
        this.fetchData('medium', 800);
        this.fetchData('slow', 1500);
    }

    ngOnDestroy() {
        this.timers.forEach((timer) => clearTimeout(timer));
    }

    /**
     * Simulates React's fetchData + Suspense pattern.
     * In React: throws promise while pending, returns data when resolved.
     * In Angular: sets signal to undefined while pending, sets data when resolved.
     * Template uses @if(data()) to show data or fallback.
     */
    private fetchData(key: string, delay: number) {
        const cached = cache.get(key);

        if (cached?.status === 'resolved') {
            this.setData(key, cached.data!);
            return;
        } else if (cached?.status === 'pending') {
            return;
        }

        // Signal is already undefined (pending state)
        const timer = setTimeout(() => {
            const data = `Data for "${key}" (fetched in ${delay}ms)`;
            cache.set(key, { status: 'resolved', data });
            this.setData(key, data);
        }, delay);
        cache.set(key, { status: 'pending' });
        this.timers.push(timer);
    }

    private setData(key: string, data: string) {
        switch (key) {
            case 'fast':
                this.fastData.set(data);
                break;
            case 'medium':
                this.mediumData.set(data);
                break;
            case 'slow':
                this.slowData.set(data);
                break;
            case 'dynamic':
                this.dynamicData.set(data);
                break;
        }
    }
}
