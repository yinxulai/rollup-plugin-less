import path from 'path'
import Rollup from 'rollup'
import postcss from 'postcss'
import { less } from './parser'
import { insertStyle } from './utils'
import autoprefixer from 'autoprefixer'
import { LessOptions } from './parser/less'
import postcssModules from 'postcss-modules'
import { createFilter } from 'rollup-pluginutils'

const injectFnName = `__any_css_style_inject__`

type GenerateScopedNameFunction = (name: string, filename: string, css: string) => string

// 具体请查看 https://github.com/css-modules/postcss-modules
interface CssModuleOptions {
  scopeBehaviour?: 'global' | 'local'
  globalModulePaths?: (RegExp | string)[]
  // generateScopedName 占位符： https://github.com/webpack/loader-utils#interpolatename
  generateScopedName?: string | GenerateScopedNameFunction
  hashPrefix?: string
  camelCase?: boolean
  root?: string
}

// 插件配置
interface Options {
  insert?: boolean
  include?: string[]
  exclude?: string[]
  cssModule?: CssModuleOptions | boolean // 交给 postcss 的 module 参数
  lessOptions?: LessOptions
}

interface ExportCodeOptions {
  fileName: string
  postResult: PostResult
  emitFile: Rollup.EmitFile

  insert?: boolean
  enableModule?: boolean
}

interface PostResult {
  css?: string,
  map?: postcss.ResultMap,
  tokens: { [key: string]: string }
}

interface PostCssOptions {
  source: string
  fileName: string
  cssModule?: CssModuleOptions
}

async function postCss(options: PostCssOptions): Promise<PostResult> {
  const { fileName, source, cssModule } = options
  const result: PostResult = { tokens: {} }

  if (!source || !fileName) {
    return result
  }

  const moduleOptions = {
    ...(typeof cssModule === 'object' && cssModule),
    getJSON: (_, token) => result.tokens = token,
  }

  const processOptions = {
    from: fileName
  }

  let data = {} as any

  try {
    // 调用 postCss 处理
    data = await postcss(
      [
        autoprefixer(), // 自动补充浏览器前缀
        postcssModules(moduleOptions), // css module
      ]
    ).process(source, processOptions)
  } catch (err) {

    throw new Error('postcss error')
  }

  result.css = data.css
  result.map = data.map

  return result
}

async function exportCode(options: ExportCodeOptions): Promise<Rollup.TransformResult> {
  const { fileName, postResult, insert, emitFile, enableModule } = options

  if (enableModule) { // 启用了 css module

    if (insert) {
      return { // 插入 dom
        map: { mappings: '' }, // TODO: 正确处理 map
        code: `${injectFnName}(${JSON.stringify(postResult.css)});
        export default ${JSON.stringify(postResult.tokens)};`
      }
    }

    // 否则作为文件导出
    const basename = path.basename(fileName)
    const name = basename.replace(/\.\w*$/, '.css')
    const referenceId = emitFile({ name, source: postResult.css, type: 'asset' })

    return {
      map: { mappings: '' }, // TODO: 正确处理 map
      code: `require(import.meta.ROLLUP_FILE_URL_${referenceId});\n
      export default ${JSON.stringify(postResult.tokens)}`
    }
  }

  if (insert) {
    return { // 插入 dom
      map: { mappings: '' }, // TODO: 正确处理 map
      code: `export default ${injectFnName}(${JSON.stringify(postResult.css)})`
    }
  }

  return {
    map: { mappings: '' },
    code: `export default ${JSON.stringify(postResult.css)}`
  }
}

export default function plugin(options: Options = {}): Rollup.Plugin {
  const filter = createFilter(
    options.include || ['/**/*.css', '/**/*.less'],
    options.exclude
  )

  return {
    name: 'anycss',
    intro() {
      return options.insert
        ? insertStyle.toString().replace(/insertStyle/, injectFnName)
        : '';
    },

    transform: async function (code: string, fileName: string) {
      if (!filter(fileName)) {
        return
      }

      const { cssModule } = options
      const insert = options.insert
      const emitFile = this.emitFile
      const emitChunk = this.emitChunk
      const enableModule = !!options.cssModule

      const exportOptions = {
        insert,
        fileName,
        emitFile,
        emitChunk,
        enableModule,
      }

      const lessOptions: LessOptions = {
        ...options.lessOptions
      }

      const postCssOptions: PostCssOptions = {
        fileName,
        source: code,
        cssModule: typeof cssModule === 'object' && cssModule || {}
      }

      const css = await less(code, { ...lessOptions, paths: [path.dirname(fileName)] }) // 预处理 less 语法
      const postResult = await postCss({ ...postCssOptions, source: css.css }) // 处理 css
      return await exportCode({ ...exportOptions, postResult }) // 导出转换后的代码
    }
  }
}
