import { expect } from 'chai';
import chalk from 'chalk';
import { describe, it, beforeEach, afterEach } from 'mocha';
import colorize from '../src/lib/ngx-ink/colorize.js';
import { green, red, hex, rgb, bgGreen, bgRed } from './helpers/chalk-utils.js';

const chalkAny = chalk as any;

describe('colorize', () => {
    let originalLevel: number;

    beforeEach(() => {
        originalLevel = chalkAny.level;
        chalkAny.level = 3; // Force ANSI color output
    });

    afterEach(() => {
        chalkAny.level = originalLevel;
    });

    describe('foreground colors', () => {
        it('should apply named foreground color (green)', () => {
            const result = colorize('hello', 'green', 'foreground');
            expect(result).to.equal(green('hello'));
        });

        it('should apply named foreground color (red)', () => {
            const result = colorize('hello', 'red', 'foreground');
            expect(result).to.equal(red('hello'));
        });

        it('should apply named foreground color (blue)', () => {
            const result = colorize('hello', 'blue', 'foreground');
            expect(result).to.equal(chalk.blue('hello'));
        });

        it('should return unchanged string when color is undefined', () => {
            const result = colorize('hello', undefined, 'foreground');
            expect(result).to.equal('hello');
        });

        it('should return unchanged string when color is empty string', () => {
            const result = colorize('hello', '', 'foreground');
            expect(result).to.equal('hello');
        });

        it('should return unchanged string for unknown color name', () => {
            const result = colorize('hello', 'notacolor', 'foreground');
            expect(result).to.equal('hello');
        });
    });

    describe('background colors', () => {
        it('should apply named background color (green)', () => {
            const result = colorize('hello', 'green', 'background');
            expect(result).to.equal(bgGreen('hello'));
        });

        it('should apply named background color (red)', () => {
            const result = colorize('hello', 'red', 'background');
            expect(result).to.equal(bgRed('hello'));
        });

        it('should return unchanged string for unknown color in background mode', () => {
            const result = colorize('hello', 'notacolor', 'background');
            expect(result).to.equal('hello');
        });
    });

    describe('hex colors', () => {
        it('should apply foreground hex color', () => {
            const result = colorize('hello', '#FF0000', 'foreground');
            expect(result).to.equal(hex('hello', '#FF0000'));
        });

        it('should apply background hex color', () => {
            const result = colorize('hello', '#00FF00', 'background');
            expect(result).to.equal(chalk.bgHex('#00FF00')('hello'));
        });
    });

    describe('rgb colors', () => {
        it('should apply foreground rgb color', () => {
            const result = colorize('hello', 'rgb(255, 0, 0)', 'foreground');
            expect(result).to.equal(rgb('hello', 255, 0, 0));
        });

        it('should apply background rgb color', () => {
            const result = colorize('hello', 'rgb(0, 255, 0)', 'background');
            expect(result).to.equal(chalk.bgRgb(0, 255, 0)('hello'));
        });

        it('should return unchanged string for invalid rgb format', () => {
            const result = colorize('hello', 'rgb(invalid)', 'foreground');
            expect(result).to.equal('hello');
        });
    });

    describe('ansi256 colors', () => {
        it('should apply foreground ansi256 color', () => {
            const result = colorize('hello', 'ansi256(196)', 'foreground');
            expect(result).to.equal(chalk.ansi256(196)('hello'));
        });

        it('should apply background ansi256 color', () => {
            const result = colorize('hello', 'ansi256(46)', 'background');
            expect(result).to.equal(chalk.bgAnsi256(46)('hello'));
        });

        it('should return unchanged string for invalid ansi256 format', () => {
            const result = colorize('hello', 'ansi256(invalid)', 'foreground');
            expect(result).to.equal('hello');
        });
    });

    describe('edge cases', () => {
        it('should handle empty string input', () => {
            const result = colorize('', 'green', 'foreground');
            expect(result).to.equal(green(''));
        });

        it('should preserve whitespace in the string', () => {
            const result = colorize('  hello  ', 'green', 'foreground');
            expect(result).to.equal(green('  hello  '));
        });
    });
});
