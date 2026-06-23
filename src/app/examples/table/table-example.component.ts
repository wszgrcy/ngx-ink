import { Component, signal } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';

interface User {
    id: number;
    name: string;
    email: string;
}

@Component({
    selector: 'ink-table-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './table-example.component.html',
})
export class TableExampleComponent {
    users = signal<User[]>([
        { id: 0, name: 'jdoe_123', email: 'jdoe@example.com' },
        { id: 1, name: 'sarah_k', email: 'sarah.k@example.com' },
        { id: 2, name: 'mike.j', email: 'mike.j@example.com' },
        { id: 3, name: 'emily_w', email: 'emily.w@example.com' },
        { id: 4, name: 'alex_dev', email: 'alex.dev@example.com' },
        { id: 5, name: 'lisa_m', email: 'lisa.m@example.com' },
        { id: 6, name: 'chris_p', email: 'chris.p@example.com' },
        { id: 7, name: 'katie_b', email: 'katie.b@example.com' },
        { id: 8, name: 'david_lee', email: 'david.lee@example.com' },
        { id: 9, name: 'anna_s', email: 'anna.s@example.com' },
    ]);
}
