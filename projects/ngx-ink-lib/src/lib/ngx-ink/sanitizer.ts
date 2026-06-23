import { Injectable, Sanitizer, SecurityContext } from '@angular/core';

/**
 * 终端 sanitizer — 终端环境无 XSS 风险，直接返回原始值
 */
@Injectable()
export class TerminalSanitizer extends Sanitizer {
    sanitize(_context: SecurityContext, value: string | {} | null): string | null {
        // 终端环境中，字符串就是纯文本，不需要 XSS 清理
        if (value === null) return null;
        return String(value ?? '');
    }
}
