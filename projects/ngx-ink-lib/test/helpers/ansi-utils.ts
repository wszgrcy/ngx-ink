/**
 * ANSI escape code assertion helpers for testing terminal output.
 */

// ---------------------------------------------------------------------------
// Core
// ---------------------------------------------------------------------------

/** Check if *str* contains a specific ANSI escape code. */
export function hasAnsiCode(str: string, code: string): boolean {
    return str.includes(`\x1b[${code}m`);
}

// ---------------------------------------------------------------------------
// Predefined colour / modifier palettes  (const objects enable compiler
// errors when an unknown colour is typed because they are `as const`).
// ---------------------------------------------------------------------------

/** Standard foreground colours. */
export const FG = {
    black: '30',
    red: '31',
    green: '32',
    yellow: '33',
    blue: '34',
    magenta: '35',
    cyan: '36',
    white: '37',
} as const;

/** Standard background colours. */
export const BG = {
    black: '40',
    red: '41',
    green: '42',
    yellow: '43',
    blue: '44',
    magenta: '45',
    cyan: '46',
    white: '47',
} as const;

/** Text modifier codes. */
export const MOD = {
    bold: '1',
    italic: '3',
    underline: '4',
    striethrough: '9',
    dim: '2',
    reset: '0',
} as const;

// ---------------------------------------------------------------------------
// Convenience predicates
// ---------------------------------------------------------------------------

/** Check if *str* contains a specific foreground colour sequence. */
export function hasAnsiColor(str: string, colorName: string): boolean {
    const code = FG[colorName as keyof typeof FG];
    return code !== undefined && hasAnsiCode(str, code);
}

/** Check if *str* contains a specific background colour sequence. */
export function hasAnsiBackgroundColor(str: string, colorName: string): boolean {
    const code = BG[colorName as keyof typeof BG];
    return code !== undefined && hasAnsiCode(str, code);
}

// ---------------------------------------------------------------------------
// Debugging & utilities
// ---------------------------------------------------------------------------

/** Parse all ANSI SGR escape code parameter strings from *str*. */
export function parseAnsiCodes(str: string): string[] {
    const codes: string[] = [];
    const regex = /\x1b\[([0-9;]+)m/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(str)) !== null) {
        codes.push(match[1]);
    }
    return codes;
}

/** Strip ANSI escape sequences from *str* (for plain-text comparison). */
export function stripAnsi(str: string): string {
    return str.replace(/\x1b\[[0-9;]*m/g, '');
}

/**
 * Get the display width of *str*, accounting for ANSI codes and
 * full-width characters.
 */
export function getStringWidth(str: string): number {
    const stripped = stripAnsi(str);
    let width = 0;
    for (const char of stripped) {
        width += char.length > 1 ? 2 : 1;
    }
    return width;
}
