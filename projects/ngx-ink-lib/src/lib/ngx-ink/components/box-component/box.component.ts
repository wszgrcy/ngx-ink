import { Component, computed, inject, input, NO_ERRORS_SCHEMA } from '@angular/core';
import { type Except } from 'type-fest';
import { type Styles } from '../../styles.js';
import { ACCESSIBILITY_CONTEXT_TOKEN } from '../../contexts/accessibility.context.js';
import { BACKGROUND_CONTEXT_TOKEN } from '../../contexts/background.context.js';
import { TextComponent } from '../text-component/text.component.js';

export type Props = Except<Styles, 'textWrap'> & {
    /**
     * A label for the element for screen readers.
     */
    readonly 'aria-label'?: string;

    /**
     * Hide the element from screen readers.
     */
    readonly 'aria-hidden'?: boolean;

    /**
     * The role of the element.
     */
    readonly 'aria-role'?:
        | 'button'
        | 'checkbox'
        | 'combobox'
        | 'list'
        | 'listbox'
        | 'listitem'
        | 'menu'
        | 'menuitem'
        | 'option'
        | 'progressbar'
        | 'radio'
        | 'radiogroup'
        | 'tab'
        | 'tablist'
        | 'table'
        | 'textbox'
        | 'timer'
        | 'toolbar';

    /**
     * The state of the element.
     */
    readonly 'aria-state'?: {
        readonly busy?: boolean;
        readonly checked?: boolean;
        readonly disabled?: boolean;
        readonly expanded?: boolean;
        readonly multiline?: boolean;
        readonly multiselectable?: boolean;
        readonly readonly?: boolean;
        readonly required?: boolean;
        readonly selected?: boolean;
    };
};

/**
 * `<Box>` is an essential Ink component to build your layout. It's like `<div style="display: flex">` in the browser.
 */
@Component({
    selector: 'box',
    standalone: true,
    imports: [TextComponent],
    templateUrl: './box.component.html',
    providers: [
        {
            provide: BACKGROUND_CONTEXT_TOKEN,
            useFactory: () => {
                const box = inject(BoxComponent, { host: true });
                return computed(() => box.style().backgroundColor);
            },
        },
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class BoxComponent {
    // Inject context
    private readonly accessibilityContext = inject(ACCESSIBILITY_CONTEXT_TOKEN);
    // private readonly boxRef = inject(BoxComponent, { self: true });

    // Computed values
    readonly isScreenReaderEnabled = computed(
        () => this.accessibilityContext().isScreenReaderEnabled,
    );
    // Internal accessibility object for rendering (matches React's internal_accessibility prop)
    readonly internalAccessibility = computed(() => {
        const role = this.ariaRole();
        const state = this.ariaState();
        // Only return if at least one is defined
        return {
            role,
            state: state,
        };
    });

    // Single style input for all Styles props (Except textWrap)
    readonly style = input<Except<Styles, 'textWrap'>>({});

    // Computed style with defaults merged
    readonly computedStyle = computed(() => ({
        backgroundColor: this.style().backgroundColor ?? null,
        overflowX: this.style().overflowX ?? this.style().overflow ?? 'visible',
        overflowY: this.style().overflowY ?? this.style().overflow ?? 'visible',
        position: this.style().position ?? null,
        top: this.style().top ?? null,
        right: this.style().right ?? null,
        bottom: this.style().bottom ?? null,
        left: this.style().left ?? null,
        columnGap: this.style().columnGap ?? null,
        rowGap: this.style().rowGap ?? null,
        gap: this.style().gap ?? null,
        margin: this.style().margin ?? null,
        marginX: this.style().marginX ?? null,
        marginY: this.style().marginY ?? null,
        marginTop: this.style().marginTop ?? null,
        marginBottom: this.style().marginBottom ?? null,
        marginLeft: this.style().marginLeft ?? null,
        marginRight: this.style().marginRight ?? null,
        padding: this.style().padding ?? null,
        paddingX: this.style().paddingX ?? null,
        paddingY: this.style().paddingY ?? null,
        paddingTop: this.style().paddingTop ?? null,
        paddingBottom: this.style().paddingBottom ?? null,
        paddingLeft: this.style().paddingLeft ?? null,
        paddingRight: this.style().paddingRight ?? null,
        flexGrow: this.style().flexGrow ?? '0',
        flexShrink: this.style().flexShrink ?? '1',
        flexDirection: this.style().flexDirection ?? 'row',
        flexBasis: this.style().flexBasis ?? null,
        flexWrap: this.style().flexWrap ?? 'nowrap',
        alignItems: this.style().alignItems ?? null,
        alignSelf: this.style().alignSelf ?? null,
        alignContent: this.style().alignContent ?? null,
        justifyContent: this.style().justifyContent ?? null,
        width: this.style().width ?? null,
        height: this.style().height ?? null,
        minWidth: this.style().minWidth ?? null,
        minHeight: this.style().minHeight ?? null,
        maxWidth: this.style().maxWidth ?? null,
        maxHeight: this.style().maxHeight ?? null,
        aspectRatio: this.style().aspectRatio ?? null,
        display: this.style().display ?? null,
        borderStyle: this.style().borderStyle ?? null,
        borderTop: this.style().borderTop ?? null,
        borderBottom: this.style().borderBottom ?? null,
        borderLeft: this.style().borderLeft ?? null,
        borderRight: this.style().borderRight ?? null,
        borderColor: this.style().borderColor ?? null,
        borderTopColor: this.style().borderTopColor ?? null,
        borderBottomColor: this.style().borderBottomColor ?? null,
        borderLeftColor: this.style().borderLeftColor ?? null,
        borderRightColor: this.style().borderRightColor ?? null,
        borderDimColor: this.style().borderDimColor ?? null,
        borderTopDimColor: this.style().borderTopDimColor ?? null,
        borderBottomDimColor: this.style().borderBottomDimColor ?? null,
        borderLeftDimColor: this.style().borderLeftDimColor ?? null,
        borderRightDimColor: this.style().borderRightDimColor ?? null,
        borderBackgroundColor: this.style().borderBackgroundColor ?? null,
        borderTopBackgroundColor: this.style().borderTopBackgroundColor ?? null,
        borderBottomBackgroundColor: this.style().borderBottomBackgroundColor ?? null,
        borderLeftBackgroundColor: this.style().borderLeftBackgroundColor ?? null,
        borderRightBackgroundColor: this.style().borderRightBackgroundColor ?? null,
        overflow: this.style().overflow ?? null,
    }));

    // Computed overflow values (with fallback to overflow shorthand)
    readonly computedOverflowX = computed(
        () => this.style().overflowX ?? this.style().overflow ?? 'visible',
    );
    readonly computedOverflowY = computed(
        () => this.style().overflowY ?? this.style().overflow ?? 'visible',
    );

    // Aria props
    readonly ariaLabel = input<string>(undefined, { alias: 'aria-label' });
    readonly ariaHidden = input(false, { alias: 'aria-hidden' });
    readonly ariaRole = input<string | undefined>(undefined, { alias: 'aria-role' });
    readonly ariaState = input<Props['aria-state']>(undefined, { alias: 'aria-state' });
}
