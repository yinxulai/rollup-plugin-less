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
// const { rollup } = require('rollup')
// const less = require('@yinxulai/rollup-plugin-less')

rollup({
    input: 'src/index.js',
    plugins: [less(options)],
}).then(/* ... */)
```
**OR**

```js
// rollup.config.js
import less from '@yinxulai/rollup-plugin-less'
// const less = require('@yinxulai/rollup-plugin-less')

export default {
  entry: 'entry.js',
  dest: 'bundle.js',
  plugins: [
    less({options}) // will output compiled styles to bundle.css
  ]
}
```

### Configuration

#### `insert` boolean 

将编译后的 css，namedObject 内嵌入 js 里，使模块的使用者
无需手动 import css 文件，同时对 ssr 支持友好，默认 `false`

#### `include` string[]

 include 用来设置仅进行处理的文件

#### `exclude` string[]

 exclude 用来设置需要忽略处理的文件

#### `cssModule` object | bool

 本插件使用 `postcss-modules` 插件来处理 `cssModule`
 同时完整支持 `postcss-modules` 插件配置具，体请查看
 [postcss-modules 文档](https://github.com/css-modules/postcss-modules)

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

#### `lessOptions` object
 本插件使用 `less` 包来对 less 文件进行预处理，同时完整支持 `less` 的相关配置
 详细信息查看 [less](https://github.com/less/less-docs/blob/master/content/usage/less-options.md)

## License

MIT
