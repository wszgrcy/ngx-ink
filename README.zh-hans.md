# ngx-ink

> **语言**: [English](./README.md) | 中文

Angular 终端 UI 框架。基于 [Ink](https://github.com/vadimdemedes/ink) 实现，使用 Angular 组件在终端中构建 CLI 应用的用户界面。

> 当前同步到7.1.0

## 安装

```bash
npm install ngx-ink
```

需要 `@angular/core ^22.0.0` 作为 peer dependency。

## 快速开始

### 集成配置

在使用 ngx-ink 之前，需要完成以下构建配置。

#### 1. 安装 patch-package

本项目需要修改 `@angular/build` 的行为以支持 ES Module 输出：

```bash
npm install patch-package --save-dev
```

在 `package.json` 中添加 postinstall 脚本：

```json
{
    "scripts": {
        "postinstall": "patch-package"
    }
}
```

#### 2. 创建补丁文件

创建 `patches/@angular+build+22.0.1.patch`（根据实际安装的版本调整版本号）：

```diff
diff --git a/node_modules/@angular/build/src/builders/application/index.js b/node_modules/@angular/build/src/builders/application/index.js
index 6bee086..0a54ee8 100644
--- a/node_modules/@angular/build/src/builders/application/index.js
+++ b/node_modules/@angular/build/src/builders/application/index.js
@@ -64,6 +64,13 @@ const results_1 = require("./results");
 async function* buildApplicationInternal(options,
 // TODO: Integrate abort signal support into builder system
 context, extensions) {
+    const path1 = require('path')
+    const filePath=path1.join(context.workspaceRoot, 'script/patch/codePlugins.js')
+    console.log('codePlugins filePath:',filePath)
+    const codePlugins = require(filePath)
+    extensions??={}
+    extensions.codePlugins??=[]
+    extensions.codePlugins.push(...('default' in  codePlugins?codePlugins.default:codePlugins))
     const { workspaceRoot, logger, target } = context;
     // Check Angular version.
     (0, version_1.assertCompatibleAngularVersion)(workspaceRoot);
```

#### 3. 创建构建脚本

创建 `script/patch/` 目录，添加以下两个文件：

**`script/patch/codePlugins.js`** — esbuild 插件配置：

```javascript
let path = require('path');
let fg = require('fast-glob');
/** @type {import('esbuild').Plugin} */
const defaultPlugin = {
    name: 'raw-code',
    setup(build) {
        build.initialOptions.platform = 'node';
        build.initialOptions.outExtension ??= {
            ...build.initialOptions.outExtension,
            '.js': '.mjs',
        };
        build.initialOptions.inject = [path.join(__dirname, './cjs-shim.js')];
        if (build.initialOptions.sourcemap) {
            build.initialOptions.sourcemap = 'linked';
            build.initialOptions.sourceRoot = path.join(build.initialOptions.absWorkingDir, '/');
        }
    },
};
exports.default = [defaultPlugin];
```

**`script/patch/cjs-shim.js`** — CommonJS 兼容性 shim：

```javascript
import { createRequire } from 'node:module';
import path from 'node:path';
import url from 'node:url';

globalThis.require = createRequire(import.meta.url);
globalThis.__filename = url.fileURLToPath(import.meta.url);
globalThis.__dirname = path.dirname(__filename);
```

> `codePlugins.js` 中的 `if (process.argv.includes('test'))` 分支仅用于项目内部测试，用户集成时不需要。

#### 4. 配置 angular.json

```json
{
    "projects": {
        "your-app": {
            "architect": {
                "build": {
                    "builder": "@angular/build:application",
                    "options": {
                        "index": false,
                        "browser": "src/main.ts",
                        "tsConfig": "tsconfig.app.json",
                        "assets": [
                            {
                                "glob": "**/*",
                                "input": "public"
                            }
                        ],
                        "styles": [],
                        "outputHashing": "none",
                        "outputPath": {
                            "browser": "",
                            "base": "./dist/your-app"
                        }
                    }
                }
            }
        }
    }
}
```

| 配置项               | 值                  | 说明             |
| -------------------- | ------------------- | ---------------- |
| `index`              | `false`             | 不需要 HTML 文件 |
| `styles`             | `[]`                | 不需要 CSS 样式  |
| `outputHashing`      | `"none"`            | 禁用文件名哈希   |
| `outputPath.browser` | `""`                | 输出到当前目录   |
| `outputPath.base`    | `"./dist/your-app"` | 基础输出路径     |

#### 5. 构建和运行

```bash
npm run build
node ./dist/your-app/main.mjs
```

### 渲染应用

ngx-ink 使用标准的 Angular 应用启动方式，与常规 Angular Web 项目无异。通过 `bootstrapApplication` 启动应用，并使用 `InkOptionToken` 配置终端选项。

```typescript
// main.ts — 应用入口
import { App } from './app/app';
import { bootstrapApplication, InkOption, InkOptionToken } from '@cyia/ngx-ink';

bootstrapApplication(App, {
    providers: [
        {
            provide: InkOptionToken,
            useValue: {
                stdout: process.stdout,
                stdin: process.stdin,
                stderr: process.stderr,
                debug: false,
                exitOnCtrlC: true,
                patchConsole: true,
                maxFps: 30,
                incrementalRendering: false,
                concurrent: false,
                alternateScreen: true,
            } as InkOption,
        },
    ],
});
```

```typescript
// app.ts — 根组件
import { Component } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-ink';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    template: `
        <box>
            <text color="green">Hello, ngx-ink!</text>
        </box>
    `,
})
export class AppComponent {}
```

### 使用内置组件

#### Box — 弹性盒子布局

```typescript
import { Component } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-ink';

@Component({
    selector: 'my-app',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    template: `
        <box [flexDirection]="'column'" [padding]="1">
            <text color="cyan">Title</text>
            <text>Content</text>
        </box>
    `,
})
export class MyAppComponent {}
```

`<box>` 类似于浏览器中的 `<div style="display: flex">`，支持以下样式属性：

- `flexDirection`: `'row' | 'column'`
- `flexGrow`, `flexShrink`, `basis`
- `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight`（数字或 `'100%'`）
- `margin`, `marginTop`, `marginBottom`, `marginLeft`, `marginRight`, `marginX`, `marginY`
- `padding`, `paddingTop`, `paddingBottom`, `paddingLeft`, `paddingRight`, `paddingX`, `paddingY`
- `position`: `'static' | 'relative' | 'absolute'`
- `top`, `right`, `bottom`, `left`
- `overflow`: `'visible' | 'hidden'`
- `textWrap`: `'wrap' | 'hard' | 'truncate' | 'truncate-end' | 'truncate-middle' | 'truncate-start'`
- `gap`, `rowGap`, `columnGap`
- ARIA 属性: `aria-label`, `aria-hidden`, `aria-role`, `aria-state`

#### Text — 文本显示

```typescript
import { Component } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-ink';

@Component({
    selector: 'my-app',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    template: `
        <text
            color="green"
            backgroundColor="blue"
            [bold]="true"
            [italic]="true"
            [underline]="true"
            [strikethrough]="true"
            [dimColor]="true"
            [inverse]="true"
            [wrap]="'wrap'"
            >Styled text</text
        >
    `,
})
export class MyAppComponent {}
```

支持的颜色和样式属性：

- `color`: 前景色（使用 Chalk，支持所有 ANSI 颜色名称）
- `backgroundColor`: 背景色
- `dimColor`: 降低亮度
- `bold`: 粗体
- `italic`: 斜体
- `underline`: 下划线
- `strikethrough`: 删除线
- `inverse`: 反转前景/背景色
- `wrap`: 文本换行或截断策略

#### Newline — 换行

```typescript
import { Component } from '@angular/core';
import { NewlineComponent, TextComponent } from '@cyia/ngx-ink';

@Component({
    selector: 'my-app',
    standalone: true,
    imports: [NewlineComponent, TextComponent],
    template: `<text>Line 1<newline [count]="2" />Line 2</text>`,
})
export class MyAppComponent {}
```

#### Spacer — 弹性空白

```typescript
import { Component } from '@angular/core';
import { BoxComponent, SpacerComponent, TextComponent } from '@cyia/ngx-ink';

@Component({
    selector: 'my-app',
    standalone: true,
    imports: [BoxComponent, SpacerComponent, TextComponent],
    template: `
        <box [flexDirection]="'row'">
            <text>Left</text>
            <spacer></spacer>
            <text>Right</text>
        </box>
    `,
})
export class MyAppComponent {}
```

#### Static — 静态内容

```typescript
import { Component } from '@angular/core';
import { StaticComponent, TextComponent } from '@cyia/ngx-ink';

@Component({
    selector: 'my-app',
    standalone: true,
    imports: [StaticComponent, TextComponent],
    template: `
        <static [items]="logs" [ngTemplateOutlet]="logTemplate"></static>
        <text>Live progress: {{ progress }}%</text>

        <ng-template #logTemplate let-log>
            <text>{{ log }}</text>
        </ng-template>
    `,
})
export class MyAppComponent {}
```

适用于不改变的输出，如日志、已完成的任务列表等。

#### Transform — 文本变换

```typescript
import { Component } from '@angular/core';
import { TextComponent, TransformComponent } from '@cyia/ngx-ink';

@Component({
    selector: 'my-app',
    standalone: true,
    imports: [TextComponent, TransformComponent],
    template: `
        <transform [transform]="transformFn" accessibilityLabel="Transformed text">
            <text>Original</text>
        </transform>
    `,
})
export class MyAppComponent {
    transformFn = (children: string, index: number) => {
        return children.toUpperCase();
    };
}
```

在输出到终端前转换子组件的字符串表示。

### 使用 Hooks

#### useInput — 键盘输入

```typescript
import { Component } from '@angular/core';
import { useInput } from '@cyia/ngx-ink';

@Component({
    /* ... */
})
export class InputComponent {
    constructor() {
        useInput((input, key) => {
            if (key.return) {
                // 回车键
            }
            if (key.upArrow) {
                // 上箭头
            }
            if (input === 'q') {
                // 按 Q 退出
            }
        });
    }
}
```

返回的 `key` 对象包含：`upArrow`, `downArrow`, `leftArrow`, `rightArrow`, `pageDown`, `pageUp`, `home`, `end`, `return`, `escape`, `ctrl`, `shift`, `tab`, `backspace`, `delete`, `alt`, `f1`-`f19`, `space`, `enter`, `slash`, `dot`, `comma`，以及按键的原始字符。

#### useWindowSize — 窗口大小

```typescript
import { Component } from '@angular/core';
import { useWindowSize } from '@cyia/ngx-ink';

@Component({
    /* ... */
})
export class WindowSizeComponent {
    size = useWindowSize();
}
```

终端调整大小时自动更新。

#### useAnimation — 动画

```typescript
import { Component } from '@angular/core';
import { useAnimation } from '@cyia/ngx-ink';

@Component({
    /* ... */
})
export class SpinnerComponent {
    animation = useAnimation({ interval: 80 });

    get spinnerChar() {
        const chars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        return chars[this.animation().frame % chars.length];
    }
}
```

返回：

- `frame`: 每 interval 递增的计数器
- `time`: 自开始以来的总毫秒数
- `delta`: 上一帧以来的毫秒数
- `reset()`: 重置所有值

#### useFocus — 焦点管理

```typescript
import { Component } from '@angular/core';
import { useFocus } from '@cyia/ngx-ink';

@Component({
    /* ... */
})
export class FocusItemComponent {
    focus = useFocus({
        autoFocus: false,
        id: 'item-1',
    });
}
```

使用 Tab 键在组件间切换焦点。

#### useCursor — 光标控制

```typescript
import { Component } from '@angular/core';
import { useCursor } from '@cyia/ngx-ink';

@Component({
    /* ... */
})
export class CursorComponent {
    constructor() {
        const { setCursorPosition } = useCursor();
    }
}
```

#### useStdin / useStdout / useStderr — 流访问

```typescript
import { useStdin, useStdout } from '@cyia/ngx-ink';

@Component({
    /* ... */
})
export class StreamComponent {
    stdin = useStdin();
    stdout = useStdout();
    stderr = useStderr();
}
```

#### 其他 Hooks

- `useApp` — 应用上下文
- `useFocusManager` — 焦点管理器
- `usePaste` — 粘贴事件监听
- `useIsScreenReaderEnabled` — 检测屏幕阅读器
- `useBoxMetrics` — 获取 Box 尺寸信息

## Context Tokens

可通过 Angular 的 `inject` 注入：

- `APP_CONTEXT_TOKEN` — 应用上下文
- `STDIN_CONTEXT_TOKEN` — stdin 上下文
- `STDOUT_CONTEXT_TOKEN` — stdout 上下文
- `STDERR_CONTEXT_TOKEN` — stderr 上下文
- `FOCUS_CONTEXT_TOKEN` — 焦点上下文
- `CURSOR_CONTEXT_TOKEN` — 光标上下文
- `ANIMATION_CONTEXT_TOKEN` — 动画上下文
- `ACCESSIBILITY_CONTEXT_TOKEN` — 无障碍上下文
- `BACKGROUND_CONTEXT_TOKEN` — 背景色上下文

## 导出列表

### 核心

| 导出                      | 说明                                |
| ------------------------- | ----------------------------------- |
| `render`                  | 渲染应用到终端，返回 `RenderResult` |
| `TerminalRenderer`        | 终端渲染器                          |
| `TerminalRendererFactory` | 渲染器工厂                          |

### 组件

| 组件                     | 说明               |
| ------------------------ | ------------------ |
| `BoxComponent`           | 弹性盒子布局容器   |
| `TextComponent`          | 文本显示，支持样式 |
| `NewlineComponent`       | 换行符             |
| `SpacerComponent`        | 弹性空白           |
| `StaticComponent`        | 静态内容渲染       |
| `TransformComponent`     | 文本变换           |
| `ErrorOverviewComponent` | 错误信息展示       |

### Hooks

| Hook                       | 返回类型                     | 说明           |
| -------------------------- | ---------------------------- | -------------- |
| `useInput`                 | `void`                       | 监听键盘输入   |
| `useWindowSize`            | `Signal<WindowSize>`         | 终端窗口尺寸   |
| `useAnimation`             | `Signal<AnimationResult>`    | 动画驱动       |
| `useFocus`                 | `Signal<FocusResult>`        | 焦点状态和控制 |
| `useFocusManager`          | `void`                       | 焦点管理器     |
| `useCursor`                | `{ setCursorPosition }`      | 光标位置控制   |
| `useStdin`                 | `Signal<StdinContextValue>`  | stdin 访问     |
| `useStdinContext`          | `Signal<StdinContextValue>`  | stdin 上下文   |
| `useStdout`                | `Signal<StdoutContextValue>` | stdout 访问    |
| `useStderr`                | `Signal<StderrContextValue>` | stderr 访问    |
| `useApp`                   | `Signal<AppContextValue>`    | 应用上下文     |
| `usePaste`                 | `void`                       | 粘贴事件       |
| `useIsScreenReaderEnabled` | `boolean`                    | 屏幕阅读器检测 |
| `useBoxMetrics`            | `Signal<BoxMetrics>`         | Box 尺寸信息   |

### 工具

| 导出                           | 说明               |
| ------------------------------ | ------------------ |
| `colorize`                     | ANSI 颜色处理      |
| `sanitizeAnsi`                 | 清理 ANSI 转义序列 |
| `kittyFlags`, `kittyModifiers` | Kitty 键盘协议支持 |

## 与 Ink 的差异

ngx-ink 复用 Ink 的核心逻辑（ANSI 处理、Yoga 布局计算、渲染管道），但适配为 Angular：

- 使用 Angular 组件（`@Component`）而非 React 函数组件
- 使用 `input()` / `output()` 替代 props
- 使用 Angular Signals 进行状态管理
- 标准的 Angular 应用启动方式（`bootstrapApplication`）

## 项目结构

```
projects/ngx-ink-lib/
├── src/
│   ├── lib/ngx-ink/
│   │   ├── components/       # Box, Text, Newline, Spacer, Static, Transform, ErrorOverview
│   │   ├── contexts/         # Angular 上下文 Token 定义
│   │   ├── hooks/            # useInput, useWindowSize, useAnimation 等
│   │   ├── service/          # AppContextService 等服务
│   │   ├── render.ts         # 渲染入口
│   │   ├── renderer2.ts      # 渲染器实现
│   │   ├── application.ts    # Angular 应用启动
│   │   ├── platform.ts       # Platform 提供器
│   │   └── ...              # 核心工具函数
│   └── public-api.ts        # 公共 API 导出
└── package.json
```
