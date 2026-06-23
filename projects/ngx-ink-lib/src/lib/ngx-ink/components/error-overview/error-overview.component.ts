import { Component, computed, effect, input, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import * as fs from 'node:fs';
import { cwd } from 'node:process';
import StackUtils from 'stack-utils';
import codeExcerpt, { type CodeExcerpt } from 'code-excerpt';
import { BoxComponent } from '../box-component/box.component.js';
import { TextComponent } from '../text-component/text.component.js';

// Error's source file is reported as file:///home/user/file.js
// This function removes the file://[cwd] part
export const cleanupPath = (path: string | undefined): string | undefined =>
    path?.replace(`file://${cwd()}/`, '');

const stackUtils = new StackUtils({
    cwd: cwd(),
    internals: StackUtils.nodeInternals(),
});

export type Props = {
    readonly error: Error;
};

@Component({
    selector: 'error-overview',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './error-overview.component.html',
    schemas: [NO_ERRORS_SCHEMA],
})
export class ErrorOverviewComponent {
    readonly error = input.required<Error>();

    readonly excerpt = signal<CodeExcerpt[] | undefined>(undefined);
    readonly lineWidth = signal<number>(0);

    // Track stack line counts for unique keys
    private readonly _stackLineCounts = new Map<string, number>();

    readonly origin = computed(() => {
        const error = this.error();
        const stack = error.stack ? error.stack.split('\n').slice(1) : undefined;
        return stack ? stackUtils.parseLine(stack[0]!) : undefined;
    });

    readonly filePath = computed(() => cleanupPath(this.origin()?.file));

    constructor() {
        effect(() => {
            this.processError();
        });
    }

    private processError(): void {
        const filePath = this.filePath();
        const origin = this.origin();
        let excerpt: CodeExcerpt[] | undefined;
        let lineWidth = 0;

        if (filePath && origin?.line && fs.existsSync(filePath)) {
            const sourceCode = fs.readFileSync(filePath, 'utf8');
            excerpt = codeExcerpt(sourceCode, origin.line);

            if (excerpt) {
                for (const { line } of excerpt) {
                    lineWidth = Math.max(lineWidth, String(line).length);
                }
            }
        }

        this.excerpt.set(excerpt);
        this.lineWidth.set(lineWidth);

        // Reset stack line counts when processing new error
        this._stackLineCounts.clear();
    }

    parseStackLine(line: string): any {
        return stackUtils.parseLine(line);
    }

    getStackKey(line: string): string {
        const lineCount = this._stackLineCounts.get(line) ?? 0;
        this._stackLineCounts.set(line, lineCount + 1);
        return `${line}-${lineCount}`;
    }

    cleanPath(file?: string): string | undefined {
        return cleanupPath(file);
    }

    padLineNumber(line: number, width: number): string {
        return String(line).padStart(width, ' ');
    }
}
