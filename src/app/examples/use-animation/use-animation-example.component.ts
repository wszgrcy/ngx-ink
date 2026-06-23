import { Component, signal, computed, effect } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import { useInput, useAnimation } from '@cyia/ngx-lib';

const rainbowColors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'] as const;

const sparkleChars = ['✦', '✧', '·', '⋆'];
const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const trailChar = '━';
const maxTrail = rainbowColors.length * 3;
const trackWidth = 44;

@Component({
    selector: 'ink-use-animation-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './use-animation-example.component.html',
})
export class UseAnimationExampleComponent {
    paused = signal(false);

    // Three animations at different speeds
    fast = useAnimation(computed(() => ({ interval: 80, isActive: !this.paused() })));
    movement = useAnimation(computed(() => ({ interval: 50, isActive: !this.paused() })));
    slow = useAnimation(computed(() => ({ interval: 400, isActive: !this.paused() })));

    // Frozen values for pause support
    frozenFast = signal(0);
    frozenMovement = signal(0);
    frozenSlow = signal(0);

    constructor() {
        // Update frozen values when not paused
        effect(() => {
            if (!this.paused()) {
                this.frozenFast.set(this.fast().frame);
                this.frozenMovement.set(this.movement().frame);
                this.frozenSlow.set(this.slow().frame);
            }
        });

        useInput((input: string) => {
            if (input === ' ') {
                this.paused.update((p) => !p);
            }
        });
    }

    readonly position = computed(() => this.frozenMovement() % trackWidth);

    readonly segments = computed(() => {
        const position = this.position();
        const cells: Array<{ text: string; color?: (typeof rainbowColors)[number] }> = [];

        for (let column = 0; column < trackWidth; column++) {
            if (column === position) {
                cells.push({ text: '🦄' });
            } else {
                const distBehind = (position - column + trackWidth) % trackWidth;

                if (distBehind > 0 && distBehind <= maxTrail) {
                    const colorIndex = rainbowColors.length - 1 - Math.floor((distBehind - 1) / 3);
                    cells.push({ text: trailChar, color: rainbowColors[colorIndex] });
                } else {
                    cells.push({ text: ' ' });
                }
            }
        }

        // Group consecutive cells with the same color into segments
        const segments: Array<{
            text: string;
            color?: (typeof rainbowColors)[number];
        }> = [];

        for (const cell of cells) {
            const last = segments.at(-1);

            if (last !== undefined && last.color === cell.color) {
                last.text += cell.text;
            } else {
                segments.push({ ...cell });
            }
        }

        return segments;
    });

    readonly sparkleLine = computed(() => this.generateSparkleLine(0));
    readonly sparkleLineBottom = computed(() => this.generateSparkleLine(5));

    private generateSparkleLine(seed: number): string {
        const frame = this.frozenSlow();
        return Array.from({ length: trackWidth + 4 }, (_, index) =>
            (index * 7 + seed * 13) % 19 < 3
                ? sparkleChars[(frame + index + seed) % sparkleChars.length]!
                : ' ',
        ).join('');
    }

    readonly title = 'Unicorns are magical!';
    readonly titleChars = computed(() => [...this.title]);
    readonly spinner = computed(() => spinnerFrames[this.frozenFast() % spinnerFrames.length]!);

    getTitleColor(index: number): (typeof rainbowColors)[number] {
        return rainbowColors[(this.frozenFast() + index) % rainbowColors.length];
    }
}
