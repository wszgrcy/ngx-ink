import { describe, it } from 'mocha';
import { expect } from 'chai';
import ansiEscapes from 'ansi-escapes';
import type { CursorPosition } from '../src/lib/ngx-ink/cursor-helpers.js';
import {
    cursorPositionChanged,
    buildCursorSuffix,
    buildReturnToBottom,
    buildCursorOnlySequence,
    buildReturnToBottomPrefix,
    showCursorEscape,
    hideCursorEscape,
} from '../src/lib/ngx-ink/cursor-helpers.js';

describe('cursor-helpers', () => {
    // ---------------------------------------------------------------------------
    // Escape sequence constants
    // ---------------------------------------------------------------------------

    describe('escape sequence constants', () => {
        it('showCursorEscape contains the correct ANSI code (\\u001B[?25h)', () => {
            expect(showCursorEscape).to.equal('\u001B[?25h');
        });

        it('hideCursorEscape contains the correct ANSI code (\\u001B[?25l)', () => {
            expect(hideCursorEscape).to.equal('\u001B[?25l');
        });
    });

    // ---------------------------------------------------------------------------
    // cursorPositionChanged
    // ---------------------------------------------------------------------------

    describe('cursorPositionChanged', () => {
        it('returns false when both positions are undefined', () => {
            expect(cursorPositionChanged(undefined, undefined)).to.be.false;
        });

        it('returns false when positions are identical', () => {
            const pos: CursorPosition = { x: 5, y: 10 };
            expect(cursorPositionChanged(pos, pos)).to.be.false;
        });

        it('returns false when both positions have same values', () => {
            expect(cursorPositionChanged({ x: 3, y: 7 }, { x: 3, y: 7 })).to.be.false;
        });

        it('returns true when x differs', () => {
            expect(cursorPositionChanged({ x: 5, y: 10 }, { x: 6, y: 10 })).to.be.true;
        });

        it('returns true when y differs', () => {
            expect(cursorPositionChanged({ x: 5, y: 10 }, { x: 5, y: 11 })).to.be.true;
        });

        it('returns true when both x and y differ', () => {
            expect(cursorPositionChanged({ x: 5, y: 10 }, { x: 6, y: 11 })).to.be.true;
        });

        it('returns true when comparing undefined to defined position', () => {
            expect(cursorPositionChanged(undefined, { x: 3, y: 7 })).to.be.true;
        });

        it('returns true when comparing defined to undefined position', () => {
            expect(cursorPositionChanged({ x: 3, y: 7 }, undefined)).to.be.true;
        });
    });

    // ---------------------------------------------------------------------------
    // buildCursorSuffix
    // ---------------------------------------------------------------------------

    describe('buildCursorSuffix', () => {
        it('returns empty string when cursorPosition is undefined', () => {
            expect(buildCursorSuffix(10, undefined)).to.equal('');
        });

        it('returns escape sequence with cursorTo when y equals visibleLineCount', () => {
            const pos: CursorPosition = { x: 10, y: 10 };
            const result = buildCursorSuffix(10, pos);
            // moveUp = 0 so no cursorUp prefix; only cursorTo + showCursorEscape
            expect(result).to.equal(ansiEscapes.cursorTo(10) + showCursorEscape);
        });

        it('includes cursorUp when visibleLineCount > cursorPosition.y', () => {
            const pos: CursorPosition = { x: 5, y: 3 };
            const result = buildCursorSuffix(10, pos);
            expect(result).to.include(ansiEscapes.cursorUp(7));
            expect(result).to.include(ansiEscapes.cursorTo(5));
            expect(result).to.include(showCursorEscape);
        });

        it('excludes cursorUp when moveUp would be <= 0', () => {
            const pos: CursorPosition = { x: 5, y: 10 };
            const result = buildCursorSuffix(10, pos);
            expect(result).to.not.include(ansiEscapes.cursorUp(1));
            expect(result).to.include(ansiEscapes.cursorTo(5));
            expect(result).to.include(showCursorEscape);
        });

        it('contains the correct showCursorEscape at the end', () => {
            const pos: CursorPosition = { x: 0, y: 0 };
            const result = buildCursorSuffix(5, pos);
            expect(result).to.include(showCursorEscape);
        });
    });

    // ---------------------------------------------------------------------------
    // buildReturnToBottom
    // ---------------------------------------------------------------------------

    describe('buildReturnToBottom', () => {
        it('returns empty string when previousCursorPosition is undefined', () => {
            expect(buildReturnToBottom(10, undefined)).to.equal('');
        });

        it('returns escape sequence with cursorTo(0) and optional cursorDown', () => {
            const pos: CursorPosition = { x: 5, y: 2 };
            const result = buildReturnToBottom(10, pos);
            expect(result).to.include(ansiEscapes.cursorDown(7));
            expect(result).to.include(ansiEscapes.cursorTo(0));
        });

        it('handles case where cursor is already at bottom', () => {
            const pos: CursorPosition = { x: 0, y: 8 };
            // previousLineCount=10, so visible lines = 9, cursor y=8
            const result = buildReturnToBottom(10, pos);
            expect(result).to.include(ansiEscapes.cursorDown(1));
            expect(result).to.include(ansiEscapes.cursorTo(0));
        });

        it('handles undefined input gracefully', () => {
            expect(buildReturnToBottom(10, undefined)).to.equal('');
        });

        it('does not include cursorDown when down would be <= 0', () => {
            const pos: CursorPosition = { x: 5, y: 9 };
            // previousLineCount=10, visible = 9, cursor y=9 => down = -1
            const result = buildReturnToBottom(10, pos);
            expect(result).to.not.include(ansiEscapes.cursorDown(1));
            expect(result).to.include(ansiEscapes.cursorTo(0));
        });
    });

    // ---------------------------------------------------------------------------
    // buildCursorOnlySequence
    // ---------------------------------------------------------------------------

    describe('buildCursorOnlySequence', () => {
        const baseInput = {
            cursorWasShown: true,
            previousLineCount: 10,
            previousCursorPosition: { x: 0, y: 2 },
            visibleLineCount: 10,
            cursorPosition: { x: 5, y: 8 },
        };

        it('returns empty string when cursor was not shown', () => {
            const input = { ...baseInput, cursorWasShown: false };
            const result = buildCursorOnlySequence(input);
            expect(result).to.not.include(hideCursorEscape);
        });

        it('includes hide prefix when cursor was previously shown', () => {
            const result = buildCursorOnlySequence(baseInput);
            expect(result).to.include(hideCursorEscape);
        });

        it('includes return to bottom sequence', () => {
            const result = buildCursorOnlySequence(baseInput);
            expect(result).to.include(ansiEscapes.cursorTo(0));
        });

        it('includes cursor suffix for new position', () => {
            const result = buildCursorOnlySequence(baseInput);
            expect(result).to.include(ansiEscapes.cursorTo(5));
            expect(result).to.include(showCursorEscape);
        });
    });

    // ---------------------------------------------------------------------------
    // buildReturnToBottomPrefix
    // ---------------------------------------------------------------------------

    describe('buildReturnToBottomPrefix', () => {
        it('returns empty string when cursorWasShown is false', () => {
            expect(buildReturnToBottomPrefix(false, 10, { x: 0, y: 2 })).to.equal('');
        });

        it('includes hideCursorEscape when cursorWasShown is true', () => {
            const result = buildReturnToBottomPrefix(true, 10, { x: 0, y: 2 });
            expect(result).to.include(hideCursorEscape);
        });

        it('includes return to bottom sequence', () => {
            const result = buildReturnToBottomPrefix(true, 10, { x: 0, y: 2 });
            expect(result).to.include(ansiEscapes.cursorDown(7));
            expect(result).to.include(ansiEscapes.cursorTo(0));
        });

        it('handles undefined previousCursorPosition', () => {
            const result = buildReturnToBottomPrefix(true, 10, undefined);
            expect(result).to.equal(hideCursorEscape);
        });
    });
});
