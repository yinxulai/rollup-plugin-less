var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from 'path';
import postcss from 'postcss';
import { less } from './parser';
import { insertStyle } from './utils';
import autoprefixer from 'autoprefixer';
import postcssModules from 'postcss-modules';
import { createFilter } from 'rollup-pluginutils';
const injectFnName = `__any_css_style_inject__`;
function postCss(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { fileName, source, cssModule } = options;
        const result = { tokens: {} };
        if (!source || !fileName) {
            return result;
        }
        const moduleOptions = Object.assign(Object.assign({}, (typeof cssModule === 'object' && cssModule)), { getJSON: (_, token) => result.tokens = token });
        const processOptions = {
            from: fileName
        };
        let data = {};
        try {
            // 调用 postCss 处理
            data = yield postcss([
                autoprefixer(),
                postcssModules(moduleOptions),
            ]).process(source, processOptions);
        }
        catch (err) {
            throw new Error('postcss error');
        }
        result.css = data.css;
        result.map = data.map;
        return result;
    });
}
function exportCode(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { fileName, postResult, insert, emitFile, enableModule } = options;
        if (enableModule) { // 启用了 css module
            if (insert) {
                return {
                    map: { mappings: '' },
                    code: `${injectFnName}(${JSON.stringify(postResult.css)});
        export default ${JSON.stringify(postResult.tokens)};`
                };
            }
            // 否则作为文件导出
            const basename = path.basename(fileName);
            const name = basename.replace(/\.\w*$/, '.css');
            const referenceId = emitFile({ name, source: postResult.css, type: 'asset' });
            return {
                map: { mappings: '' },
                code: `require(import.meta.ROLLUP_FILE_URL_${referenceId});\n
      export default ${JSON.stringify(postResult.tokens)}`
            };
        }
        if (insert) {
            return {
                map: { mappings: '' },
                code: `export default ${injectFnName}(${JSON.stringify(postResult.css)})`
            };
        }
        return {
            map: { mappings: '' },
            code: `export default ${JSON.stringify(postResult.css)}`
        };
    });
}
export function plugin(options = {}) {
    const filter = createFilter(options.include || ['/**/*.css', '/**/*.less'], options.exclude);
    return {
        name: 'anycss',
        intro() {
            return options.insert
                ? insertStyle.toString().replace(/insertStyle/, injectFnName)
                : '';
        },
        transform: function (code, fileName) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!filter(fileName)) {
                    return;
                }
                const { cssModule } = options;
                const insert = options.insert;
                const emitFile = this.emitFile;
                const emitChunk = this.emitChunk;
                const enableModule = !!options.cssModule;
                const exportOptions = {
                    insert,
                    fileName,
                    emitFile,
                    emitChunk,
                    enableModule,
                };
                const lessOptions = Object.assign({}, options.lessOptions);
                const postCssOptions = {
                    fileName,
                    source: code,
                    cssModule: typeof cssModule === 'object' && cssModule || {}
                };
                const css = yield less(code, Object.assign(Object.assign({}, lessOptions), { paths: [path.dirname(fileName)] })); // 预处理 less 语法
                const postResult = yield postCss(Object.assign(Object.assign({}, postCssOptions), { source: css.css })); // 处理 css
                return yield exportCode(Object.assign(Object.assign({}, exportOptions), { postResult })); // 导出转换后的代码
            });
        }
    };
}
export default plugin;
//# sourceMappingURL=index.js.map