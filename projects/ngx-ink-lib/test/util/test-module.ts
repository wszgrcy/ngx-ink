import { ɵprovideFakePlatformNavigation } from '@angular/common/testing';
import { NgModule, APP_ID, Injectable } from '@angular/core';
import { TestComponentRenderer } from '@angular/core/testing';
@Injectable()
export class DOMTestComponentRenderer extends TestComponentRenderer {
    constructor() {
        super();
    }

    override insertRootElement(rootElId: string, tagName = 'div') {}

    override removeAllRootElements() {}
}

@NgModule({
    providers: [
        { provide: APP_ID, useValue: 'a' },
        ɵprovideFakePlatformNavigation(),
        { provide: TestComponentRenderer, useClass: DOMTestComponentRenderer },
    ],
})
export class TerminalTestingModule {}
