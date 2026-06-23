# ngx-ink

> **Language**: English | [中文](./README.zh-hans.md)

An Angular Terminal UI Framework. Built on top of [Ink](https://github.com/vadimdemedes/ink), it enables you to build CLI application UIs using Angular components in the terminal.

> Currently synced with version 7.1.0

## Installation

```bash
npm install @cyia/ngx-ink
```

Requires `@angular/core ^22.0.0` as a peer dependency.

> **Prerequisite**: You need to install `@types/node` since `process.stdout/stdin/stderr` require type definitions during TypeScript compilation.

```bash
npm install @types/node --save-dev
```

## Quick Start

### Integration Configuration

Before using ngx-ink, you need to complete the following build configurations.

#### 1. Install patch-package

This project requires modifying the behavior of `@angular/build` to support ES Module output:

```bash
npm install patch-package --save-dev
```

Add a postinstall script in `package.json`:

```json
{
    "scripts": {
        "postinstall": "patch-package"
    }
}
```

#### 2. Create Patch File

Create `patches/@angular+build+22.0.1.patch`:

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

#### 3. Create Build Scripts

Create the `script/patch/` directory and add the following two files:

**`script/patch/codePlugins.js`** — esbuild plugin configuration:

> Note: `fast-glob` is only used in `test` mode (for building test entry points). If you don't need to run internal tests, you can remove the `fg`-related `require` and code branch.

```javascript
let path = require('path');
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

**`script/patch/cjs-shim.js`** — CommonJS compatibility shim:

```javascript
import { createRequire } from 'node:module';
import path from 'node:path';
import url from 'node:url';

globalThis.require = createRequire(import.meta.url);
globalThis.__filename = url.fileURLToPath(import.meta.url);
globalThis.__dirname = path.dirname(__filename);
```

> The `if (process.argv.includes('test'))` branch in `codePlugins.js` is only used for internal project testing and is not needed when integrating.

#### 4. Configure angular.json

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

| Configuration      | Value                 | Description                    |
| ------------------ | --------------------- | ------------------------------ |
| `index`            | `false`               | No HTML file needed            |
| `styles`           | `[]`                  | No CSS styles needed           |
| `index.html`       | —                     | Delete `index.html` if it exists, not needed for CLI apps |
| `outputHashing`    | `"none"`              | Disable filename hashing       |
| `outputPath.browser` | `""`                | Output to current directory    |
| `outputPath.base`  | `"./dist/your-app"`   | Base output path               |

#### 5. Build and Run

```bash
npm run build
node ./dist/your-app/main.mjs
```

### Rendering Your App

ngx-ink uses standard Angular application bootstrapping, just like regular Angular web projects. Start the app with `bootstrapApplication` and configure terminal options using `InkOptionToken`.

```typescript
// main.ts — Application entry point
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
// app.ts — Root component
import { Component } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-ink';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    template: `
        <box>
            <text [color]="'green'">Hello, ngx-ink!</text>
        </box>
    `,
})
export class AppComponent {}
```

### Using Built-in Components

#### Box — Flexbox Layout

```typescript
import { Component } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-ink';

@Component({
    selector: 'my-app',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    template: `
        <box [style]="{ flexDirection: 'column', padding: 1 }">
            <text [color]="'cyan'">Title</text>
            <text>Content</text>
        </box>
    `,
})
export class MyAppComponent {}
```

`<box>` is similar to `<div style="display: flex">` in the browser. **All styles are applied through a single `style` input binding** that accepts an object containing style properties:

```html
<box [style]="{ flexDirection: 'column', padding: 1, gap: 2 }"></box>
```

Supported style properties (corresponding to the `Styles` type):

| Category   | Properties                                                                                                 |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| Flex Direction | `flexDirection`: `'row' \| 'column' \| 'row-reverse' \| 'column-reverse'`                              |
| Flex Properties | `flexGrow`, `flexShrink`, `flexBasis`, `flexWrap`                                                       |
| Alignment  | `alignItems`, `alignSelf`, `alignContent`, `justifyContent`                                                |
| Dimensions | `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight` (numbers or strings like `'100%'`)    |
| Margin     | `margin`, `marginTop`, `marginBottom`, `marginLeft`, `marginRight`, `marginX`, `marginY`                  |
| Padding    | `padding`, `paddingTop`, `paddingBottom`, `paddingLeft`, `paddingRight`, `paddingX`, `paddingY`            |
| Position   | `position`: `'static' \| 'relative' \| 'absolute'`, plus `top`, `right`, `bottom`, `left`                  |
| Overflow   | `overflow`: `'visible' \| 'hidden'`, plus `overflowX`, `overflowY`                                         |
| Text Wrap  | `textWrap`: `'wrap' \| 'hard' \| 'truncate' \| 'truncate-end' \| 'truncate-middle' \| 'truncate-start'`   |
| Spacing    | `gap`, `rowGap`, `columnGap`                                                                               |
| Border     | `borderStyle`, `borderTop`, `borderBottom`, `borderLeft`, `borderRight`, `borderColor`, etc.               |
| ARIA       | `aria-label`, `aria-hidden`, `aria-role`, `aria-state`                                                     |

#### Text — Text Display

```typescript
import { Component } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-ink';

@Component({
    selector: 'my-app',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    template: `
        <text
            [color]="'green'"
            [backgroundColor]="'blue'"
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

Supported color and style properties (**all properties are `input()` types; boolean and string values require `[property]="value"` binding**):

| Property          | Type                                                                                        | Description                                                    |
| ----------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `color`           | `string`                                                                                    | Foreground color (uses Chalk, supports all ANSI color names)   |
| `backgroundColor` | `string`                                                                                    | Background color                                               |
| `dimColor`        | `boolean`                                                                                   | Dim brightness (requires `[dimColor]="true"`)                  |
| `bold`            | `boolean`                                                                                   | Bold                                                           |
| `italic`          | `boolean`                                                                                   | Italic                                                         |
| `underline`       | `boolean`                                                                                   | Underline                                                      |
| `strikethrough`   | `boolean`                                                                                   | Strikethrough                                                  |
| `inverse`         | `boolean`                                                                                   | Invert foreground/background colors                            |
| `wrap`            | `'wrap' \| 'hard' \| 'truncate-end' \| 'truncate' \| 'truncate-middle' \| 'truncate-start'` | Text wrapping or truncation strategy, default `'wrap'`         |

#### Newline — Line Break

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

#### Spacer — Flexible Space

```typescript
import { Component } from '@angular/core';
import { BoxComponent, SpacerComponent, TextComponent } from '@cyia/ngx-ink';

@Component({
    selector: 'my-app',
    standalone: true,
    imports: [BoxComponent, SpacerComponent, TextComponent],
    template: `
        <box [style]="{ flexDirection: 'row' }">
            <text>Left</text>
            <spacer></spacer>
            <text>Right</text>
        </box>
    `,
})
export class MyAppComponent {}
```

#### Static — Static Content

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

Useful for unchanging output such as logs, completed task lists, etc.

#### Transform — Text Transformation

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

Transform the string representation of child components before outputting to the terminal.

### Using Hooks

#### useInput — Keyboard Input

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
                // Enter key
            }
            if (key.upArrow) {
                // Up arrow
            }
            if (input === 'q') {
                // Press Q to exit
            }
        });
    }
}
```

The returned `key` object includes: `upArrow`, `downArrow`, `leftArrow`, `rightArrow`, `pageDown`, `pageUp`, `home`, `end`, `return`, `escape`, `ctrl`, `shift`, `tab`, `backspace`, `delete`, `alt`, `f1`-`f19`, `space`, `enter`, `slash`, `dot`, `comma`, as well as the raw character of the key pressed.

#### useWindowSize — Window Size

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

Automatically updates when the terminal is resized.

#### useAnimation — Animation

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

Returns:

- `frame`: counter that increments every interval
- `time`: total milliseconds since start
- `delta`: milliseconds since the last frame
- `reset()`: reset all values

#### useFocus — Focus Management

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

Switch focus between components using the Tab key.

#### useCursor — Cursor Control

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

#### useStdin / useStdout / useStderr — Stream Access

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

#### Other Hooks

- `useApp` — Application context
- `useFocusManager` — Focus manager
- `usePaste` — Paste event listener
- `useIsScreenReaderEnabled` — Detect screen reader
- `useBoxMetrics` — Get Box size information

## Context Tokens

Injectable via Angular's `inject`:

- `APP_CONTEXT_TOKEN` — Application context
- `STDIN_CONTEXT_TOKEN` — Stdin context
- `STDOUT_CONTEXT_TOKEN` — Stdout context
- `STDERR_CONTEXT_TOKEN` — Stderr context
- `FOCUS_CONTEXT_TOKEN` — Focus context
- `CURSOR_CONTEXT_TOKEN` — Cursor context
- `ANIMATION_CONTEXT_TOKEN` — Animation context
- `ACCESSIBILITY_CONTEXT_TOKEN` — Accessibility context
- `BACKGROUND_CONTEXT_TOKEN` — Background color context

## Exports

### Core

| Export                      | Description                                    |
| ------------------------- | ---------------------------------------------- |
| `render`                  | Render app to terminal, returns `RenderResult` |
| `TerminalRenderer`        | Terminal renderer                              |
| `TerminalRendererFactory` | Renderer factory                               |

### Components

| Component                  | Description                |
| -------------------------- | -------------------------- |
| `BoxComponent`             | Flexbox layout container   |
| `TextComponent`            | Text display with styling  |
| `NewlineComponent`         | Line break                 |
| `SpacerComponent`          | Flexible space             |
| `StaticComponent`          | Static content rendering   |
| `TransformComponent`       | Text transformation        |
| `ErrorOverviewComponent`   | Error message display      |

### Hooks

| Hook                       | Return Type                  | Description                    |
| -------------------------- | ---------------------------- | ------------------------------ |
| `useInput`                 | `void`                       | Listen to keyboard input       |
| `useWindowSize`            | `Signal<WindowSize>`         | Terminal window size           |
| `useAnimation`             | `Signal<AnimationResult>`    | Animation driver               |
| `useFocus`                 | `Signal<FocusResult>`        | Focus state and control        |
| `useFocusManager`          | `void`                       | Focus manager                  |
| `useCursor`                | `{ setCursorPosition }`      | Cursor position control        |
| `useStdin`                 | `Signal<StdinContextValue>`  | Stdin access                   |
| `useStdinContext`          | `Signal<StdinContextValue>`  | Stdin context                  |
| `useStdout`                | `Signal<StdoutContextValue>` | Stdout access                  |
| `useStderr`                | `Signal<StderrContextValue>` | Stderr access                  |
| `useApp`                   | `Signal<AppContextValue>`    | Application context            |
| `usePaste`                 | `void`                       | Paste event                    |
| `useIsScreenReaderEnabled` | `boolean`                    | Screen reader detection        |
| `useBoxMetrics`            | `Signal<BoxMetrics>`         | Box size information           |

### Utilities

| Export                           | Description                  |
| -------------------------------- | ---------------------------- |
| `colorize`                       | ANSI color handling          |
| `sanitizeAnsi`                   | Sanitize ANSI escape sequences |
| `kittyFlags`, `kittyModifiers`   | Kitty keyboard protocol support |

## Differences from Ink

ngx-ink reuses Ink's core logic (ANSI processing, Yoga layout calculation, rendering pipeline), but adapted for Angular:

- Uses Angular components (`@Component`) instead of React function components
- Uses `input()` / `output()` instead of props
- Uses Angular Signals for state management
- Standard Angular application bootstrapping (`bootstrapApplication`)

## Project Structure

```
projects/ngx-ink-lib/
├── src/
│   ├── lib/ngx-ink/
│   │   ├── components/       # Box, Text, Newline, Spacer, Static, Transform, ErrorOverview
│   │   ├── contexts/         # Angular context Token definitions
│   │   ├── hooks/            # useInput, useWindowSize, useAnimation, etc.
│   │   ├── service/          # AppContextService and other services
│   │   ├── render.ts         # Rendering entry point
│   │   ├── renderer2.ts      # Renderer implementation
│   │   ├── application.ts    # Angular application startup
│   │   ├── platform.ts       # Platform providers
│   │   └── ...              # Core utility functions
│   └── public-api.ts        # Public API exports
```
