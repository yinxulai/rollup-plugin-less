import fs from 'fs'
import path from 'path'
import parses from './parser'
import postcss from 'postcss'
import postcssModules from 'postcss-modules'

interface Options {
    module: any
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

// 处理 css
async function handleCss(rawcss: string, identity: string, option: Options): Promise<string> {
    const cwd = process.cwd()
    const data = await postCss(rawcss, option)
    const relaPath = '.' + identity.slice(cwd.length)
    const newFilePath = path.resolve(relaPath.replace(/\.\w*$/, '.css'))

    await writeFile(newFilePath, data.css)
    return `require('./${path.basename(newFilePath)}')\nexport default ${JSON.stringify(data.tokens)}`
}

interface PostResult {
    css: string,
    tokens: { [key: string]: string }
}

async function postCss(rawcss: string, option: Options): Promise<PostResult> {
    option = option || {}
    const result: PostResult = { css: '', tokens: {} }

    const moduleOptions = {
        ...option.module,
        getJSON: (_, token) => result.tokens = token,
    }
    // 调用 postCss 处理

    const data = await postcss([postcssModules(moduleOptions)])
        .process(rawcss)

    result.css = data.css

    Object.keys(result.tokens).forEach(key => {
        const newKey = toCaseName(key)
        result.tokens[newKey] = result.tokens[key]
    })

    return result
}


export default function plugin(options: Options) {
    return {
        name: 'anycss',
        transform: async (code: string, identity: string) => {
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

                const rawcss = await paser.parse(code, {})
                const exportCode = await handleCss(rawcss, identity, options)

                return {
                    code: exportCode,
                    map: { mappings: '' }
                };
            }
        }
    }
}
