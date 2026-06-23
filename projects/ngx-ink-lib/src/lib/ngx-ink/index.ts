/**
 * ngx-ink — Angular 终端 UI 框架
 *
 * 用法：
 *   import { render, BoxComponent as Box, TextComponent as Text } from '@cyia/ngx-ink';
 */

// 核心渲染
export { TerminalRendererFactory } from './renderer-factory.js';
export { TerminalRenderer } from './renderer2.js';
export { render } from './render.js';
export type { RenderResult, RenderOptions } from './render.js';

// Platform
export { TerminalSanitizer } from './sanitizer.js';
export { providePlatformTerminalProviders, getDocument, provideAppProviders } from './platform.js';

// Hooks
export { useInput } from './hooks/use-input.js';
export type { Key } from './hooks/use-input.js';
export { kittyFlags, kittyModifiers } from './kitty-keyboard.js';
export { useWindowSize } from './hooks/use-window-size.js';
export type { WindowSize } from './hooks/use-window-size.js';
export { useApp } from './hooks/use-app.js';
export { useStdin, useStdinContext } from './hooks/use-stdin.js';
export { useStdout } from './hooks/use-stdout.js';
export { useStderr } from './hooks/use-stderr.js';
export { useCursor } from './hooks/use-cursor.js';
export { useFocus, type FocusOptions } from './hooks/use-focus.js';
export { useFocusManager } from './hooks/use-focus-manager.js';
export { useAnimation, type AnimationResult } from './hooks/use-animation.js';
export { usePaste, type Options as PasteOptions } from './hooks/use-paste.js';
export { useIsScreenReaderEnabled } from './hooks/use-is-screen-reader-enabled.js';

// Context Tokens
export {
    APP_CONTEXT_TOKEN,
    type AppContextValue,
    type TerminalSuspension,
    type SuspendTerminal,
} from './contexts/app.context.js';
export {
    STDIN_CONTEXT_TOKEN,
    type StdinContextValue,
    type PublicStdinProps,
} from './contexts/stdin.context.js';
export { STDOUT_CONTEXT_TOKEN, type StdoutContextValue } from './contexts/stdout.context.js';
export { STDERR_CONTEXT_TOKEN, type StderrContextValue } from './contexts/stderr.context.js';
export {
    ACCESSIBILITY_CONTEXT_TOKEN,
    type AccessibilityContextValue,
} from './contexts/accessibility.context.js';
export {
    FOCUS_CONTEXT_TOKEN,
    type FocusContextValue,
    type FocusEntry,
} from './contexts/focus.context.js';
export { CURSOR_CONTEXT_TOKEN, type CursorContextValue } from './contexts/cursor.context.js';
export {
    ANIMATION_CONTEXT_TOKEN,
    type AnimationContextValue,
} from './contexts/animation.context.js';
export { BACKGROUND_CONTEXT_TOKEN, type BackgroundColor } from './contexts/background.context.js';

// 文本工具
export { default as sanitizeAnsi } from './sanitize-ansi.js';

// 颜色处理
export { default as colorize } from './colorize.js';

// 光标辅助
export {
    type CursorPosition,
    cursorPositionChanged,
    buildCursorSuffix,
    buildReturnToBottom,
    buildCursorOnlySequence,
    buildReturnToBottomPrefix,
    showCursorEscape,
    hideCursorEscape,
} from './cursor-helpers.js';

// VNode 类型与 DOMNode 工厂
export type {
    ADOMNode as InkVNode,
    DOMElement,
    TextNode,
    ElementNames,
    TextName,
} from './vnode.js';
export { createNode, createTextNode, setAttribute, setStyle } from './vnode.js';

// 公开组件
export { BoxComponent } from './components/box-component/box.component.js';
export { TextComponent } from './components/text-component/text.component.js';
export { ErrorOverviewComponent } from './components/error-overview/error-overview.component.js';
export { NewlineComponent } from './components/newline-component/newline.component.js';
export { SpacerComponent } from './components/spacer-component/spacer.component.js';
export { StaticComponent } from './components/static-component/static.component.js';
export { TransformComponent } from './components/transform-component/transform.component.js';

// useBoxMetrics Hook
export { useBoxMetrics } from './hooks/use-box-metrics.js';
export type { BoxMetrics, UseBoxMetricsResult } from './hooks/use-box-metrics.js';

// 应用启动
export * from './application.js';
export * from './ink.js';
export * from './ink.token.js';

export { AppContextService } from './service/app.context.service.js';
export * from './styles.js';
