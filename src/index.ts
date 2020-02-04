import path from 'path'
import Rollup from 'rollup'
import postcss from 'postcss'
import postcssLess from 'postcss-less'
import postcssScss from 'postcss-scss'
import postcssSass from 'postcss-sass'
import postcssModules from 'postcss-modules'
import { createFilter } from 'rollup-pluginutils'

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

interface Options {
    include?: string[]
    exclude?: string[]
    cssModule?: CssModuleOptions | boolean // 交给 postcss 的 module 参数
}

function toCaseName(name: string = '') {
    return [...name.replace(/-(\w)/g, (_, $1) => $1.toUpperCase())]
        .filter(t => t !== '-').join('')
}

interface ExportCodeOptions {
    fileName: string
    postResult: PostResult
    emitFile: Rollup.EmitFile
    enableModule?: boolean
}

// 处理 css
async function exportCode(options: ExportCodeOptions): Promise<Rollup.TransformResult> {
    const { fileName, postResult, emitFile, enableModule } = options
    if (enableModule) { // 启用了 css module
        const basename = path.basename(fileName)
        const name = basename.replace(/\.\w*$/, '.css')
        const referenceId = emitFile({ name, source: postResult.css, type: 'asset' })

        return {
            map: { mappings: '' }, // TODO: 正确处理 map
            code: `require(import.meta.ROLLUP_FILE_URL_${referenceId});\nexport default ${JSON.stringify(postResult.tokens)}`
        }
    }

    return {
        map: { mappings: '' },
        code: `export default ${JSON.stringify(postResult.css)}`
    }
}

interface PostResult {
    css?: string,
    map?: postcss.ResultMap,
    tokens: { [key: string]: string }
}

interface PostCssOptions {
    source: string
    fileName: string
    postCss?: postcss.ProcessOptions
    cssModule?: CssModuleOptions
}


async function handlePostCss(options: PostCssOptions): Promise<PostResult> {
    const { fileName, source, postCss, cssModule } = options
    const result: PostResult = { tokens: {} }

    const moduleOptions = {
        ...(typeof cssModule === 'object' && cssModule),
        getJSON: (_, token) => result.tokens = token,
    }

    // 调用 postCss 处理
    const data = await postcss(
        [postcssModules(moduleOptions)]
    ).process(source, { ...postCss, from: fileName })

    result.css = data.css
    result.map = data.map

    Object.keys(result.tokens).forEach(key => {
        const newKey = toCaseName(key)
        result.tokens[newKey] = result.tokens[key]
    })

    return result
}

function getPostSyntaxPlugin(file: string): [postcss.Syntax | undefined, boolean] {
    switch (path.extname(file)) {
        case '.less':
            return [postcssLess, true];
        case '.scss':
            return [postcssScss, true];
        case '.sass':
            return [postcssSass, true];
        case '.css':
            return [undefined, true];
        default:
            return [undefined, false]
    }
}

export default function plugin(options: Options = {}): Rollup.Plugin {
    const filter = createFilter(
        options.include || ['/**/*.css', '/**/*.less', '/**/*.scss', '/**/*.sass'],
        options.exclude
    )

    return {
        name: 'anycss',
        transform: async function (code: string, fileName: string) {
            if (!filter(fileName)) {
                return
              }

            const { cssModule } = options
            const emitFile = this.emitFile
            const emitChunk = this.emitChunk
            const enableModule = !!options.cssModule

            const [syntax, ok] = getPostSyntaxPlugin(fileName)
            if (!ok) { return }

            const exportOptions = {
                fileName,
                emitFile,
                emitChunk,
                enableModule,
            }

            const handleOptions: PostCssOptions = {
                fileName,
                source: code,
                postCss: { syntax },
                cssModule: typeof cssModule === 'object' && cssModule || {}
            }

            try {
                const postResult = await handlePostCss(handleOptions) // 处理 css
                return await exportCode({ ...exportOptions, postResult })
            } catch (err) {
                throw new Error(err)
            }
        },
        generateBundle: function (options, bundle, isWrite) {
            // 输出文件

        }
    }
}
