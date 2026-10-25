import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

const input = 'src/index.ts';
const external = ['react', 'react/jsx-runtime'];

// Code: ESM as .mjs and CommonJS as .cjs, so Node picks the format from the extension
// without a "type" field. Declarations: one bundled file per format (.d.mts / .d.cts) so
// TypeScript resolves the right module kind for import and require consumers.
// `npm run build` cleans `dist/` first.
export default [
  {
    input,
    external,
    output: [
      {
        dir: 'dist',
        entryFileNames: 'esm/index.mjs',
        format: 'es',
        sourcemap: true,
      },
      {
        dir: 'dist',
        entryFileNames: 'cjs/index.cjs',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.build.json',
        outDir: 'dist',
        rootDir: 'src',
        declaration: false,
      }),
    ],
  },
  {
    input,
    external,
    output: [
      { file: 'dist/esm/index.d.mts', format: 'es' },
      { file: 'dist/cjs/index.d.cts', format: 'es' },
    ],
    plugins: [dts({ tsconfig: './tsconfig.build.json' })],
  },
];
