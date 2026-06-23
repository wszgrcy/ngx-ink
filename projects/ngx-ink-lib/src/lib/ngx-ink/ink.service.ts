import { inject, Injectable, Injector } from '@angular/core';
import { InkOptionToken } from './ink.token';
import Ink from './ink';

@Injectable()
export class InkService {
    config = inject(InkOptionToken);
    ink = new Ink(this.config, inject(Injector));
}
