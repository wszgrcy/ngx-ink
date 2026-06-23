import { Component, OnInit } from '@angular/core';
import { TextComponent } from '@cyia/ngx-lib';
@Component({
    selector: 'app-name',
    template: `<text>aaa</text> `,
    imports: [TextComponent],
})
export class TextTestComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
