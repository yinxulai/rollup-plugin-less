import fs from 'fs'
import path from 'path'
import Rollup from 'rollup'
import parses from './parser'
import postcss from 'postcss'
import postcssModules from 'postcss-modules'
// TODO: 解决 sourceMap

interface Options {
    module?: any // 交给 postcss 的 module 参数
}

function toCaseName(name: string = '') {
    return [...name.replace(/-(\w)/g, (_, $1) => $1.toUpperCase())]
        .filter(t => t !== '-').join('')
}

async function writeFile(filepath: string, contents: any): Promise<void> {
    const dir = path.dirname(filepath)
    fs.mkdirSync(dir, { recursive: true })
    const file = fs.openSync(filepath, 'w');
    fs.writeFileSync(file, contents);
    fs.closeSync(file)
}

interface exportCssOptions {
    module?: boolean,
    emitFile: Rollup.EmitFile
}


// 处理 css
async function exportCss(identity: string, css: PostResult, option: exportCssOptions): Promise<Rollup.TransformResult> {
    if (option.module) { // 输出文件
        const basename = path.basename(identity)
        const name = basename.replace(/\.\w*$/, '.css')
        const referenceId = option.emitFile({ name, source: css.css, type: 'asset' })
        return `require(import.meta.ROLLUP_FILE_URL_${referenceId});\nexport default ${JSON.stringify(css.tokens)}`
    }

    return `export default ${JSON.stringify(css.css)}`
}

interface PostResult {
    css?: string,
    map?: postcss.ResultMap,
    tokens: { [key: string]: string }
}

async function postCss(identity: string, rawcss: string, option: Options): Promise<PostResult> {
    option = option || {}
    const result: PostResult = { tokens: {} }

    const moduleOptions = {
        ...option,
        to: identity,
        from: identity,
        getJSON: (_, token) => result.tokens = token,
    }

    // 调用 postCss 处理
    const data = await postcss([postcssModules(moduleOptions)])
        .process(rawcss)

    result.css = data.css
    result.map = data.map

    Object.keys(result.tokens).forEach(key => {
        const newKey = toCaseName(key)
        result.tokens[newKey] = result.tokens[key]
    })

    return result
}


export default function plugin(options: Options = {}): Rollup.Plugin {
    const enableCssModule = !!options.module
    const exportFiles: Rollup.EmittedFile[] = []

    return {
        name: 'anycss',
        renderStart: function (options: Rollup.OutputOptions) {
            if (!options || !options.file) {
                return
            }

            const dist = path.dirname(options.file)

            exportFiles.filter(Boolean).forEach(file => {
                if (!file.name || !file.fileName) {
                    return
                }

                return this.emitFile({
                    ...file,
                    fileName: undefined
                })
            })
        },
        transform: async function (code: string, identity: string) {
            const emitFile = this.emitFile

            for (let index = 0; index < parses.length; index++) {
                const paser = parses[index]
                const test = parses[index].test

                if (typeof test === 'function') {
                    if (!test(identity)) {
                        return null
                    }
                }

                if (typeof test === 'string') {
                    if (!identity.includes(test)) {
                        return null
                    }
                }

                if (test instanceof RegExp) {
                    if (!test.test(identity)) {
                        return null
                    }
                }

                try {
                    const rawcss = await paser.parse(identity, code, options)
                    const result = await postCss(identity, rawcss, options.module) // 处理 css
                    return await exportCss(identity, result, { emitFile, module: true })
                } catch (err) {
                    throw new Error(err)
                }
            }
        }
    }
}
