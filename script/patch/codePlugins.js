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
    // todo 临时判断
    if (process.argv.includes('test')) {
      build.initialOptions.sourceRoot = path.join(process.cwd(), './projects/');

      build.initialOptions.entryPoints = fg
        .sync(['./projects/ngx-ink-lib/**/*.spec.ts'], {
          cwd: process.cwd(),
        })
        .map((item) => ({
          in: item,
          out: item.slice(0, -3),
        }));
      build.initialOptions.external = ['mocha'];
      build.initialOptions.outdir = path.join(process.cwd(), 'test-dist');
      build.initialOptions.entryNames = undefined;
    }
  },
};
exports.default = [defaultPlugin];
