import typescript from '@rollup/plugin-typescript';

// One build, two module formats, one set of declarations. `npm run build` cleans `dist/` first.
export default {
  input: 'src/index.ts',
  external: ['react', 'react/jsx-runtime'],
  output: [
    {
      dir: 'dist',
      entryFileNames: 'esm/index.js',
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
      declaration: true,
      declarationDir: 'dist/types',
      rootDir: 'src',
    }),
  ],
};
