import { expect } from 'chai';
import { describe, it } from 'mocha';
import sanitizeAnsi from '../src/lib/ngx-ink/sanitize-ansi.js';

describe('sanitizeAnsi', () => {
    // Helper: ESC is \u001b (same as \x1b)
    const ESC = '\u001b';

    describe('preserving SGR sequences', () => {
        it('should preserve color codes (CSI + m)', () => {
            const input = `Hello${ESC}[31m Red Text ${ESC}[0m Normal`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(input);
        });

        it('should preserve multiple SGR codes', () => {
            const input = `${ESC}[1;31mBold Red${ESC}[0m Normal`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(input);
        });

        it('should preserve semicolon-separated SGR parameters', () => {
            const input = `${ESC}[38;2;255;128;0mCustom Color${ESC}[0m`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(input);
        });

        it('should preserve bold modifier', () => {
            const input = `${ESC}[1mBold${ESC}[0m Normal`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(input);
        });

        it('should preserve italic modifier', () => {
            const input = `${ESC}[3mItalic${ESC}[0m Normal`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(input);
        });

        it('should preserve underline modifier', () => {
            const input = `${ESC}[4mUnderline${ESC}[0m Normal`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(input);
        });
    });

    describe('preserving OSC sequences', () => {
        it('should preserve hyperlink OSC sequences', () => {
            // OSC 8 ;; URL ST (ESC \) to define hyperlink
            const input = `${ESC}]8;;https://example.com${ESC}\\Link Text${ESC}]8;;${ESC}\\`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(input);
        });

        it('should preserve other OSC sequences', () => {
            const input = `${ESC}]0;Window Title${ESC}\\Some text`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(input);
        });
    });

    describe('stripping cursor movement codes', () => {
        it('should strip cursor up (CSI A)', () => {
            const input = `${ESC}[A${ESC}[B text`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(' text');
        });

        it('should strip cursor down (CSI B)', () => {
            const input = `${ESC}[2B${ESC}[3C text`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(' text');
        });

        it('should strip cursor forward (CSI C)', () => {
            const input = `${ESC}[3C text`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(' text');
        });

        it('should strip cursor backward (CSI D)', () => {
            const input = `${ESC}[3D text`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(' text');
        });

        it('should strip cursor position (CSI H)', () => {
            const input = `${ESC}[10;20H text`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(' text');
        });
    });

    describe('stripping screen clearing codes', () => {
        it('should clear screen (CSI 2J)', () => {
            const input = `${ESC}[2J text`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(' text');
        });

        it('should clear entire line (CSI 2K)', () => {
            const input = `${ESC}[2K text`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(' text');
        });

        it('should clear line from cursor (CSI 1K)', () => {
            const input = `${ESC}[1K text`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(' text');
        });

        it('should clear line to cursor (CSI 0K / CSI K)', () => {
            const input = `${ESC}[K text`;
            const result = sanitizeAnsi(input);
            expect(result).to.equal(' text');
        });
    });

    describe('plain text passthrough', () => {
        it('should return plain text unchanged', () => {
            const input = 'Hello World';
            const result = sanitizeAnsi(input);
            expect(result).to.equal(input);
        });

        it('should return empty string unchanged', () => {
            const input = '';
            const result = sanitizeAnsi(input);
            expect(result).to.equal(input);
        });

        it('should return string with no control characters unchanged', () => {
            const input = 'Hello 123!@#';
            const result = sanitizeAnsi(input);
            expect(result).to.equal(input);
        });
    });

    describe('mixed content', () => {
        it('should preserve colors while stripping cursor codes', () => {
            const input = `${ESC}[31m${ESC}[2J Colored ${ESC}[0m Normal`;
            const result = sanitizeAnsi(input);
            const expected = `${ESC}[31m Colored ${ESC}[0m Normal`;
            expect(result).to.equal(expected);
        });

        it('should preserve SGR while stripping other sequences', () => {
            const input = `${ESC}[1;34m${ESC}[H Blue Bold ${ESC}[0m text`;
            const result = sanitizeAnsi(input);
            const expected = `${ESC}[1;34m Blue Bold ${ESC}[0m text`;
            expect(result).to.equal(expected);
        });
    });
});
