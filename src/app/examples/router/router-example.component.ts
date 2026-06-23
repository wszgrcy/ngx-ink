import { Component, computed, signal } from '@angular/core';
import { BoxComponent, TextComponent, useInput, useApp } from '@cyia/ngx-lib';

type Route = 'home' | 'about';

@Component({
    selector: 'ink-router-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './router-example.component.html',
})
export class RouterExampleComponent {
    private readonly app = useApp();
    readonly currentRoute = signal<Route>('home');

    readonly isActive = computed(() => true);

    constructor() {
        useInput((input, key) => {
            if (input === 'q') {
                this.app().exit();
            }

            if (key.return) {
                if (this.currentRoute() === 'home') {
                    this.currentRoute.set('about');
                } else {
                    this.currentRoute.set('home');
                }
            }
        }, this.isActive);
    }

    // Equivalent to React's current route state
    route = computed(() => this.currentRoute());
}
