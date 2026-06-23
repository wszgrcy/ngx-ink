import { signal, effect, computed, Signal } from '@angular/core';
import { type DOMElement, addLayoutListener } from '../dom.js';

// Yoga's `right`/`bottom` are omitted: always `0` for flow layout and unintuitive for absolute positioning.
/**
Metrics of a box element.

All positions are relative to the element's parent.
*/
export type BoxMetrics = {
    /**
	Element width.
	*/
    readonly width: number;

    /**
	Element height.
	*/
    readonly height: number;

    /**
	Distance from the left edge of the parent.
	*/
    readonly left: number;

    /**
	Distance from the top edge of the parent.
	*/
    readonly top: number;
};

export type UseBoxMetricsResult = BoxMetrics & {
    /**
	Whether the currently tracked element has been measured in the latest layout pass.
	*/
    readonly hasMeasured: boolean;
};

const emptyMetrics: BoxMetrics = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
};

const findRootNode = (node: DOMElement | null): DOMElement | undefined => {
    if (!node) {
        return undefined;
    }

    if (!node.parentNode) {
        return node.nodeName === 'ink-root' ? node : undefined;
    }

    return findRootNode(node.parentNode);
};

/**
A React hook that returns the current layout metrics for a tracked box element.
It updates when layout changes (for example terminal resize, sibling/content changes, or position changes).

The hook returns `{width: 0, height: 0, left: 0, top: 0}` until the first layout pass completes. It also returns zeros when the tracked ref is detached.

Use `hasMeasured` to detect when the currently tracked element has been measured.

@example
```tsx
import {useRef} from 'react';
import {Box, Text, useBoxMetrics} from 'ink';

const Example = () => {
	const ref = useRef(null);
	const {width, height, left, top, hasMeasured} = useBoxMetrics(ref);
	return (
		<Box ref={ref}>
			<Text>
				{hasMeasured ? `${width}x${height} at ${left},${top}` : 'Measuring...'}
			</Text>
		</Box>
	);
};
```
*/
export function useBoxMetrics(ref: Signal<DOMElement | null>): Signal<UseBoxMetricsResult> {
    const metrics$ = signal(emptyMetrics);
    const hasMeasured$ = signal(false);

    const updateMetrics = () => {
        const node = ref();
        const layout = node?.yogaNode?.getComputedLayout() ?? emptyMetrics;

        metrics$.update((previousMetrics) => {
            const hasChanged =
                previousMetrics.width !== layout.width ||
                previousMetrics.height !== layout.height ||
                previousMetrics.left !== layout.left ||
                previousMetrics.top !== layout.top;

            return hasChanged ? layout : previousMetrics;
        });

        hasMeasured$.set(Boolean(node));
    };

    // Effect: runs after every render to keep metrics fresh when local state/props in this subtree change.
    effect(() => {
        updateMetrics();
    });

    // Subscribe to root layout commits so memoized components still receive
    // sibling-driven position/size updates, even when they skip re-rendering.
    effect((cleanup) => {
        const rootNode = findRootNode(ref());

        if (!rootNode) {
            return;
        }

        const unsubscribe = addLayoutListener(rootNode, updateMetrics);
        cleanup(unsubscribe);
    });

    return computed(() => ({
        ...metrics$(),
        hasMeasured: hasMeasured$(),
    }));
}
