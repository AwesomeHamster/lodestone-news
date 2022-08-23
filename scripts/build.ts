import { build, BuildOptions } from 'esbuild'
import { sync as glob } from 'fast-glob'

const options: BuildOptions = {
  entryPoints: glob(['src/**/*.ts']),
  platform: 'node',
  minify: !process.env.NODE_ENV?.startsWith('dev'),
  sourcemap: 'linked',
}

console.log('Building CommonJS module...')
build({
  ...options,
  target: 'node12',
  format: 'cjs',
  outdir: './dist/cjs',
})

console.log('Building ESM module...')
build({
  ...options,
  target: 'node16',
  format: 'esm',
  outdir: './dist/esm',
})
