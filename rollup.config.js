import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import { browser, module } from './package.json';

const config = {
  input: module,
  output: {
    file: browser,
    format: 'umd',
    name: 'ReactSweetWizard',
  },
  plugins: [
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    commonjs(),
    terser(),
  ],
  external: ['react'],
};

// eslint-disable-next-line import/no-default-export
export default config;
