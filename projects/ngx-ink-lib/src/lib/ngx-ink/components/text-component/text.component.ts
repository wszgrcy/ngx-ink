import { Component, computed, inject, input, NO_ERRORS_SCHEMA } from '@angular/core';
import chalk from 'chalk';
import { type LiteralUnion } from 'type-fest';
import { type ForegroundColorName } from 'ansi-styles';
import colorize from '../../colorize.js';
import { ACCESSIBILITY_CONTEXT_TOKEN } from '../../contexts/accessibility.context.js';
import {
    BACKGROUND_CONTEXT_TOKEN,
    type BackgroundColor,
} from '../../contexts/background.context.js';

export type Props = {
    /**
     * A label for the element for screen readers.
     */
    readonly 'aria-label'?: string;

    /**
     * Hide the element from screen readers.
     */
    readonly 'aria-hidden'?: boolean;

    /**
     * Change text color. Ink uses Chalk under the hood, so all its functionality is supported.
     */
    readonly color?: LiteralUnion<ForegroundColorName, string>;

    /**
     * Same as `color`, but for the background.
     */
    readonly backgroundColor?: LiteralUnion<ForegroundColorName, string>;

    /**
     * Dim the color (make it less bright).
     */
    readonly dimColor?: boolean;

    /**
     * Make the text bold.
     */
    readonly bold?: boolean;

    /**
     * Make the text italic.
     */
    readonly italic?: boolean;

    /**
     * Make the text underlined.
     */
    readonly underline?: boolean;

    /**
     * Make the text crossed out with a line.
     */
    readonly strikethrough?: boolean;

    /**
     * Inverse background and foreground colors.
     */
    readonly inverse?: boolean;

    /**
     * This property tells Ink to wrap or truncate text if its width is larger than the container.
     */
    readonly wrap?:
        | 'wrap'
        | 'hard'
        | 'truncate-end'
        | 'truncate'
        | 'truncate-middle'
        | 'truncate-start';
};

/**
 * This component can display text and change its style to make it bold, underlined, italic, or strikethrough.
 */
@Component({
    selector: 'text',
    standalone: true,
    imports: [],
    templateUrl: './text.component.html',
    schemas: [NO_ERRORS_SCHEMA],
})
export class TextComponent {
    // Inject contexts
    private readonly accessibilityContext = inject(ACCESSIBILITY_CONTEXT_TOKEN);
    private readonly inheritedBackgroundColor = inject(BACKGROUND_CONTEXT_TOKEN);

    // Inputs
    readonly color = input<LiteralUnion<ForegroundColorName, string>>();
    readonly backgroundColor = input<BackgroundColor>();
    readonly dimColor = input(false);
    readonly bold = input(false);
    readonly italic = input(false);
    readonly underline = input(false);
    readonly strikethrough = input(false);
    readonly inverse = input(false);
    readonly wrap = input<
        'wrap' | 'hard' | 'truncate-end' | 'truncate' | 'truncate-middle' | 'truncate-start'
    >('wrap');
    readonly ariaLabel = input<string>(undefined, { alias: 'aria-label' });
    readonly ariaHidden = input(false, { alias: 'aria-hidden' });

    // Computed values
    readonly isScreenReaderEnabled = computed(
        () => this.accessibilityContext().isScreenReaderEnabled,
    );

    // Effective background color: use explicit backgroundColor if provided, otherwise inherit from parent Box
    // Matches React: const effectiveBackgroundColor = backgroundColor ?? inheritedBackgroundColor;
    readonly effectiveBackgroundColor = computed(
        () => this.backgroundColor() ?? this.inheritedBackgroundColor(),
    );

    // Check if component should render
    // Matches React: if (childrenOrAriaLabel === undefined || childrenOrAriaLabel === null) { return null; }

    // Transform function for text styling (matches React's transform logic)
    // This is a regular function, not computed - it reads signals at call time
    readonly transform = (children: string): string => {
        if (this.dimColor()) {
            children = chalk.dim(children);
        }

        const color = this.color();
        if (color) {
            children = colorize(children, color, 'foreground');
        }

        const effectiveBackgroundColor = this.effectiveBackgroundColor();
        if (effectiveBackgroundColor) {
            children = colorize(children, effectiveBackgroundColor, 'background');
        }

        if (this.bold()) {
            children = chalk.bold(children);
        }

        if (this.italic()) {
            children = chalk.italic(children);
        }

        if (this.underline()) {
            children = chalk.underline(children);
        }

        if (this.strikethrough()) {
            children = chalk.strikethrough(children);
        }

        if (this.inverse()) {
            children = chalk.inverse(children);
        }

        return children;
    };
}
