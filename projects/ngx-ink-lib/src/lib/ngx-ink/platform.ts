/**
 * 终端平台配置
 *
 * 提供 Angular platform 的自定义配置，替换默认的 RendererFactory2、
 *   Sanitizer。
 */

import {
    EnvironmentProviders,
    Provider,
    RendererFactory2,
    Sanitizer,
    DOCUMENT,
    providePlatformInitializer,
    PLATFORM_ID,
    ɵINJECTOR_SCOPE,
    ErrorHandler,
} from '@angular/core';
import signalExit from 'signal-exit';
import {
    LocationChangeListener,
    PlatformLocation,
    ɵsetRootDomAdapter,
    ɵDomAdapter,
} from '@angular/common';
// TPlatformLocation defined below in this file

import { TerminalRendererFactory } from './renderer-factory.js';
import { TerminalSanitizer } from './sanitizer.js';
import { ɵsetDocument } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
const doc: Document = {} as any;

class TDomAdapter extends ɵDomAdapter {
    dispatchEvent(el: any, evt: any): any {
        return null;
    }
    readonly supportsDOMEvents: boolean = false;
    remove(el: any): void {}
    createElement(tagName: any, doc?: any): HTMLElement {
        throw new Error('createElement not found');
    }
    createHtmlDocument(): Document {
        return doc;
    }
    getDefaultDocument(): Document {
        return doc;
    }
    isElementNode(node: any): boolean {
        return false;
    }
    isShadowRoot(node: any): boolean {
        return false;
    }
    onAndCancel(el: any, evt: any, listener: any, options?: any): Function {
        return () => {};
    }
    getGlobalEventTarget(doc: Document, target: string): any {
        return null;
    }
    getBaseHref(doc: Document): string | null {
        return null;
    }
    resetBaseElement(): void {}
    getUserAgent(): string {
        return '';
    }
    getCookie(name: string): string | null {
        return null;
    }
}
export function getDocument() {
    // ɵsetDocument(doc as any);
    return doc;
}
class TPlatformLocation implements PlatformLocation {
    getBaseHrefFromDOM(): string {
        return '';
    }
    getState(): unknown {
        return null;
    }
    onPopState(fn: LocationChangeListener): VoidFunction {
        return () => {};
    }
    onHashChange(fn: LocationChangeListener): VoidFunction {
        return () => {};
    }
    get href(): string {
        return '';
    }
    get protocol(): string {
        return '';
    }
    get hostname(): string {
        return '';
    }
    get port(): string {
        return '';
    }
    get pathname(): string {
        return '';
    }
    get search(): string {
        return '';
    }
    get hash(): string {
        return '';
    }
    replaceState(state: any, title: string, url: string): void {
        // noop
    }
    pushState(state: any, title: string, url: string): void {
        // noop
    }
    forward(): void {
        // noop
    }
    back(): void {
        // noop
    }
    historyGo?(relativePosition: number): void {
        // noop
    }
}
/**
 *
 * 终端环境提供的公共 Provider
 */
export function providePlatformTerminalProviders() {
    return [
        { provide: PLATFORM_ID, useValue: 'ink' },
        // 提供空的 DOCUMENT 对象（不需要真正的 DOM Document）
        { provide: DOCUMENT, useFactory: getDocument },
        providePlatformInitializer(() => {
            ɵsetDocument(doc as any);
            ɵsetRootDomAdapter(new TDomAdapter());
        }),
    ];
}

export function provideAppProviders(): (Provider | EnvironmentProviders)[] {
    return [
        { provide: ɵINJECTOR_SCOPE, useValue: 'root' },
        { provide: ErrorHandler, useFactory: () => new ErrorHandler() },
        EventManager,
        // 自定义 Sanitizer（终端环境无 XSS 风险）
        { provide: Sanitizer, useClass: TerminalSanitizer },

        // ⭐ 核心：用 TerminalRendererFactory 替换默认的 RendererFactory2
        {
            provide: RendererFactory2,
            useClass: TerminalRendererFactory,
        },
        {
            provide: PlatformLocation,
            useClass: TPlatformLocation,
        },
        // 保持进程运行（类似 React Ink 的 signalExit 监听器）
        providePlatformInitializer(() => {
            // 监听进程退出信号，防止应用立即退出
            // 这与 React Ink 中的 signalExit(this.unmount) 效果相同
            signalExit(
                () => {
                    // 清理逻辑可以在这里添加
                },
                { alwaysLast: false },
            );
        }),
    ];
}
