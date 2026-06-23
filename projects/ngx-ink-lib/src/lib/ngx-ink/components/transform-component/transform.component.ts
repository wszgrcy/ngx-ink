import { Component, computed, inject, input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ACCESSIBILITY_CONTEXT_TOKEN } from '../../contexts/accessibility.context.js';

export type Props = {
    /**
     * Screen-reader-specific text to output. If this is set, all children will be ignored.
     */
    readonly accessibilityLabel?: string;

    /**
     * Function that transforms children output. It accepts children and must return transformed children as well. Note that when children use `<Text>` styling props (e.g. `color`, `bold`), the string will contain ANSI escape codes.
     */
    readonly transform: (children: string, index: number) => string;
};

/**
 * Transform a string representation of React components before they're written to output. For example, you might want to apply a gradient to text, add a clickable link, or create some text effects. These use cases can't accept React nodes as input; they expect a string. That's what the <Transform> component does: it gives you an output string of its child components and lets you transform it in any way.
 */
@Component({
    selector: 'transform',
    standalone: true,
    imports: [],
    templateUrl: './transform.component.html',
    schemas: [NO_ERRORS_SCHEMA],
})
export class TransformComponent {
    // Inject accessibility context
    private readonly accessibilityContext = inject(ACCESSIBILITY_CONTEXT_TOKEN);

    // Inputs
    readonly accessibilityLabel = input<string>();
    readonly transform = input.required<(children: string, index: number) => string>();

    // Computed: whether to render (has children)
    // In Angular, transform is a required input, so if the component is used,
    // it implies there are children to transform. This matches React behavior
    // where Transform is only rendered when explicitly used with children.
    readonly hasChildren = computed(() => true);

    // Computed: screen reader state
    readonly isScreenReaderEnabled = computed(
        () => this.accessibilityContext().isScreenReaderEnabled,
    );
}
