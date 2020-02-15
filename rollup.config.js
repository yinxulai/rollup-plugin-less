import pkg from './package.json';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve'
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: '.build/index.js',

  plugins: [
    resolve({ jsnext: true, preferBuiltins: true }),
    commonjs(),
    typescript(),
    peerDepsExternal()
  ],
  
	output: [
		{
      format: 'cjs',
      file: pkg.main,
      sourcemap: true

		},
		{
      format: 'es',
      sourcemap: true,
      file: pkg.module,
		}
	]
};