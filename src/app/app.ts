import { Component, computed, NO_ERRORS_SCHEMA, signal, Type } from '@angular/core';
import { BoxComponent, TextComponent, useInput } from '@cyia/ngx-lib';
import { BordersExampleComponent } from './examples/borders';
import { AriaExampleComponent } from './examples/aria';
import { BorderBackgroundsExampleComponent } from './examples/border-backgrounds';
import { BoxBackgroundsExampleComponent } from './examples/box-backgrounds';
import { ChatExampleComponent } from './examples/chat';
import { ConcurrentSuspenseExampleComponent } from './examples/concurrent-suspense';
import { CounterExampleComponent } from './examples/counter';
import { CursorImeExampleComponent } from './examples/cursor-ime';
import { JustifyContentExampleComponent } from './examples/justify-content';
import { SelectInputExampleComponent } from './examples/select-input';
import { StaticExampleComponent } from './examples/static';
import { SubprocessOutputExampleComponent } from './examples/subprocess-output';
import { SuspenseExampleComponent } from './examples/suspense';
import { TableExampleComponent } from './examples/table';
import { TerminalResizeExampleComponent } from './examples/terminal-resize';
import { UseAnimationExampleComponent } from './examples/use-animation';
import { UseFocusExampleComponent } from './examples/use-focus';
import { UseFocusWithIdExampleComponent } from './examples/use-focus-with-id';
import { UseInputExampleComponent } from './examples/use-input';
import { UseStderrExampleComponent } from './examples/use-stderr';
import { UseStdoutExampleComponent } from './examples/use-stdout';
import { IncrementalRenderingExampleComponent } from './examples/incremental-rendering';
import { JestExampleComponent } from './examples/jest';
import { RenderThrottleExampleComponent } from './examples/render-throttle';
import { RouterExampleComponent } from './examples/router';
import { UseTransitionExampleComponent } from './examples/use-transition';
import { NgComponentOutlet } from '@angular/common';
import { AlternateScreenExampleComponent } from './examples/alternate-screen';
import { SuspendTerminalExampleComponent } from './examples/suspend-terminal';
@Component({
    selector: 'ink-root',
    imports: [TextComponent, BoxComponent, NgComponentOutlet],
    providers: [],
    templateUrl: './app.html',
    schemas: [NO_ERRORS_SCHEMA],
})
export class App {
    items = [
        { name: 'alternate-screen', component: AlternateScreenExampleComponent },
        { name: 'aria', component: AriaExampleComponent },
        { name: 'border-backgrounds', component: BorderBackgroundsExampleComponent },
        { name: 'borders', component: BordersExampleComponent },
        { name: 'box-backgrounds', component: BoxBackgroundsExampleComponent },
        { name: 'chat', component: ChatExampleComponent },
        { name: 'concurrent-suspense', component: ConcurrentSuspenseExampleComponent },
        { name: 'counter', component: CounterExampleComponent },
        { name: 'cursor-ime', component: CursorImeExampleComponent },
        { name: 'incremental-rendering', component: IncrementalRenderingExampleComponent },
        { name: 'jest', component: JestExampleComponent },
        { name: 'justify-content', component: JustifyContentExampleComponent },
        { name: 'render-throttle', component: RenderThrottleExampleComponent },
        { name: 'router', component: RouterExampleComponent },
        { name: 'select-input', component: SelectInputExampleComponent },
        { name: 'static', component: StaticExampleComponent },
        { name: 'subprocess-output', component: SubprocessOutputExampleComponent },
        { name: 'suspense', component: SuspenseExampleComponent },
        { name: 'table', component: TableExampleComponent },
        { name: 'terminal-resize', component: TerminalResizeExampleComponent },
        { name: 'use-animation', component: UseAnimationExampleComponent },
        { name: 'use-focus', component: UseFocusExampleComponent },
        { name: 'use-focus-with-id', component: UseFocusWithIdExampleComponent },
        { name: 'use-input', component: UseInputExampleComponent },
        { name: 'use-stderr', component: UseStderrExampleComponent },
        { name: 'use-stdout', component: UseStdoutExampleComponent },
        { name: 'suspend-terminal', component: SuspendTerminalExampleComponent },
        { name: 'use-transition', component: UseTransitionExampleComponent },
    ];
    activatedItem$ = signal<{ name: string; component: Type<any> } | undefined>(undefined);
    selectIndex$ = signal<number>(0);

    inputData = useInput(
        (input, key) => {
            if (key.rightArrow || key.downArrow) {
                this.selectIndex$.update((index) => (index + 1) % this.items.length);
            } else if (key.leftArrow || key.upArrow) {
                this.selectIndex$.update(
                    (index) => (index - 1 + this.items.length) % this.items.length,
                );
            } else if (key.return) {
                this.activatedItem$.set(this.items[this.selectIndex$()]);
            }
        },
        computed(() => ({ isActive: !this.activatedItem$() })),
    );
}
