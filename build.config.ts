import { defineBuildConfig } from 'unbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  clean: true,
  failOnWarn: false,
  alias: {
    '@': path.resolve(__dirname, 'src'), // ← cukup ini saja
  },
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
    esbuild: {
      target: 'es2022',
    },
  },
});
