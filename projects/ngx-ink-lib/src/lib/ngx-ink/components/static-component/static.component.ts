import {
    Component,
    computed,
    contentChild,
    input,
    NO_ERRORS_SCHEMA,
    signal,
    TemplateRef,
    untracked,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { type Styles } from '../../styles.js';

export type Props<T> = {
    /**
	Array of items of any type to render using the function you pass as a component child.
	*/
    readonly items: T[];

    /**
	Styles to apply to a container of child elements. See <Box> for supported properties.
	*/
    readonly style?: Styles;
};

/**
`<Static>` component permanently renders its output above everything else. It's useful for displaying activity like completed tasks or logs—things that don't change after they're rendered (hence the name "Static").

It's preferred to use `<Static>` for use cases like these when you can't know or control the number of items that need to be rendered.

For example, [Tap](https://github.com/tapjs/node-tap) uses `<Static>` to display a list of completed tests. [Gatsby](https://github.com/gatsbyjs/gatsby) uses it to display a list of generated pages while still displaying a live progress bar.
*/
@Component({
    selector: 'static',
    standalone: true,
    imports: [NgTemplateOutlet],
    templateUrl: './static.component.html',
    schemas: [NO_ERRORS_SCHEMA],
})
export class StaticComponent<T = unknown> {
    readonly items = input.required<T[]>();
    readonly style = input<Styles>({});

    // Template ref projected via <ng-template>
    readonly template = contentChild.required(TemplateRef, { read: TemplateRef });

    private _renderIndex = signal(0);

    readonly itemsToRender = computed(() => {
        const items = this.items();
        const start = this._renderIndex();
        untracked(() => {
            this._renderIndex.set(items.length);
        });
        return items.slice(start);
    });

    // Computed style (equivalent to React's useMemo for style)
    readonly computedStyle = computed(() => ({
        position: 'absolute' as const,
        flexDirection: 'column' as const,
        ...this.style(),
    }));
}
