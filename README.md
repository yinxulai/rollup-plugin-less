# rollup-plugin-less

SSR 支持 
typescript 支持
转换 less 语法并支持 cssModule

## Installation

```
npm install --save-dev @yinxulai/rollup-plugin-less
```

## Usage

```js
import { rollup } from 'rollup'
import less from '@yinxulai/rollup-plugin-less'

rollup({
    input: 'src/index.js',
    plugins: [less(options)],
}).then(/* ... */)
```

### Configuration

**insert** `boolean`

将 css 内置，支持 ssr

Defaults to `false`

**include** `string[]`

指定包含的文件

**exclude** `string[]`

指定忽略的文件

**cssModule** `object | bool`

具体请查看 https://github.com/css-modules/postcss-modules

```ts
interface CssModuleOptions {
  scopeBehaviour?: 'global' | 'local'
  globalModulePaths?: (RegExp | string)[]
  generateScopedName?: string | GenerateScopedNameFunction
  hashPrefix?: string
  camelCase?: boolean
  root?: string
}
```

**lessOptions** `object`

 详细信息查看 https://github.com/less/less-docs/blob/master/content/usage/less-options.md

## Examples

## License

MIT
