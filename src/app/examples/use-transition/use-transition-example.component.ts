import { Component, signal, computed } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import { useInput } from '@cyia/ngx-lib';

// Generate a large list of items for demonstration
function generateItems(filter: string): string[] {
    const allItems: string[] = [];
    for (let i = 0; i < 200; i++) {
        allItems.push(
            `Item ${i + 1}: ${['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'][i % 5]}`,
        );
    }

    if (!filter) {
        return allItems.slice(0, 10);
    }

    // Simulate expensive filtering
    const start = Date.now();
    while (Date.now() - start < 100) {
        // Artificial delay to simulate expensive computation
    }

    return allItems
        .filter((item) => item.toLowerCase().includes(filter.toLowerCase()))
        .slice(0, 10);
}

@Component({
    selector: 'ink-use-transition-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './use-transition-example.component.html',
})
export class UseTransitionExampleComponent {
    query = signal('');
    deferredQuery = signal('');
    isPending = signal(false);

    constructor() {
        useInput((input, key) => {
            if (key.backspace || key.delete) {
                this.query.update((prev) => prev.slice(0, -1));
                this.startTransition(() => {
                    this.deferredQuery.update((prev) => prev.slice(0, -1));
                });
            } else if (input && !key.ctrl && !key.meta) {
                this.query.update((prev) => prev + input);
                this.startTransition(() => {
                    this.deferredQuery.update((prev) => prev + input);
                });
            }
        });
    }

    // Simulate React's useTransition behavior
    private startTransition(callback: () => void) {
        this.isPending.set(true);
        // Use Promise to defer the expensive computation to the next microtask
        Promise.resolve().then(() => {
            callback();
            this.isPending.set(false);
        });
    }

    // Equivalent to React's useMemo(() => generateItems(deferredQuery), [deferredQuery])
    filteredItems = computed(() => generateItems(this.deferredQuery()));

    // Equivalent to React's derived state from template
    resultsTitle = computed(() => {
        const deferred = this.deferredQuery();
        return deferred ? `Results for "${deferred}":` : 'Results (showing first 10):';
    });
}
