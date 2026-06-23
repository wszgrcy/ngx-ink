import chalk from 'chalk';

/**
 * 生成带颜色的预期输出文本 — 与 lib/ink 测试策略一致
 */
export function green(text: string): string {
    return chalk.green(text);
}

export function red(text: string): string {
    return chalk.red(text);
}

export function blue(text: string): string {
    return chalk.blue(text);
}

export function yellow(text: string): string {
    return chalk.yellow(text);
}

export function hex(text: string, colorCode: string): string {
    return chalk.hex(colorCode)(text);
}

export function rgb(text: string, r: number, g: number, b: number): string {
    return chalk.rgb(r, g, b)(text);
}

export function bgGreen(text: string): string {
    return chalk.bgGreen(text);
}

export function bgRed(text: string): string {
    return chalk.bgRed(text);
}

/**
 * 检查字符串是否包含 ANSI 转义码（ESC = \u001b）
 * ESC character is \u001b (same as \x1b)
 */
export function hasAnsiCode(str: string, code: string): boolean {
    return str.includes('\u001b[' + code + 'm');
}

/**
 * 使用 chalk 生成预期值并断言匹配
 * 这是 lib/ink 推荐的测试策略 — 用 chalk.level=3 确保颜色被渲染
 */
export function expectColorMatch(actual: string, expectedFn: (t: string) => string): void {
    const originalLevel = chalk.level;
    chalk.level = 3; // Force ANSI color output
    try {
        const expected = expectedFn('Test');
        if (actual !== expected) {
            throw new Error(
                `Expected:\n${JSON.stringify(expected)}\nActual:\n${JSON.stringify(actual)}`,
            );
        }
    } finally {
        chalk.level = originalLevel;
    }
}
