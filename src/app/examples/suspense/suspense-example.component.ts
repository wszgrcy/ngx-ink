import { Component, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TextComponent } from '@cyia/ngx-lib';

@Component({
    selector: 'ink-suspense-example',
    standalone: true,
    imports: [NgTemplateOutlet, TextComponent],
    templateUrl: './suspense-example.component.html',
})
export class SuspenseExampleComponent {
    // Represents the Suspense read() result
    // undefined = pending (throws promise in React)
    // 'Hello World' = resolved (returns data in React)
    message = signal<string | undefined>(undefined);

    ngOnInit() {
        this.read();
    }

    /**
     * Simulates React's Suspense read() function.
     * In React: throws promise while pending, returns data when resolved.
     * In Angular: uses signal to track state, template shows fallback while undefined.
     */
    private read() {
        // Simulate async data fetching (like throwing a promise in React)
        setTimeout(() => {
            this.message.set('Hello World');
        }, 500);
    }
}
