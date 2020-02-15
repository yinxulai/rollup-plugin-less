"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var postcss_1 = __importDefault(require("postcss"));
var parser_1 = require("./parser");
var utils_1 = require("./utils");
var autoprefixer_1 = __importDefault(require("autoprefixer"));
var postcss_modules_1 = __importDefault(require("postcss-modules"));
var rollup_pluginutils_1 = require("rollup-pluginutils");
var injectFnName = "__any_css_style_inject__";
function postCss(options) {
    return __awaiter(this, void 0, void 0, function () {
        var fileName, source, cssModule, result, moduleOptions, processOptions, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileName = options.fileName, source = options.source, cssModule = options.cssModule;
                    result = { tokens: {} };
                    if (!source || !fileName) {
                        return [2 /*return*/, result];
                    }
                    moduleOptions = __assign(__assign({}, (typeof cssModule === 'object' && cssModule)), { getJSON: function (_, token) { return result.tokens = token; } });
                    processOptions = {
                        from: fileName
                    };
                    data = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, postcss_1.default([
                            autoprefixer_1.default(),
                            postcss_modules_1.default(moduleOptions),
                        ]).process(source, processOptions)];
                case 2:
                    // 调用 postCss 处理
                    data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    throw new Error('postcss error');
                case 4:
                    result.css = data.css;
                    result.map = data.map;
                    return [2 /*return*/, result];
            }
        });
    });
}
function exportCode(options) {
    return __awaiter(this, void 0, void 0, function () {
        var fileName, postResult, insert, emitFile, enableModule, basename, name_1, referenceId;
        return __generator(this, function (_a) {
            fileName = options.fileName, postResult = options.postResult, insert = options.insert, emitFile = options.emitFile, enableModule = options.enableModule;
            if (enableModule) { // 启用了 css module
                if (insert) {
                    return [2 /*return*/, {
                            map: { mappings: '' },
                            code: injectFnName + "(" + JSON.stringify(postResult.css) + ");\n        export default " + JSON.stringify(postResult.tokens) + ";"
                        }];
                }
                basename = path_1.default.basename(fileName);
                name_1 = basename.replace(/\.\w*$/, '.css');
                referenceId = emitFile({ name: name_1, source: postResult.css, type: 'asset' });
                return [2 /*return*/, {
                        map: { mappings: '' },
                        code: "require(import.meta.ROLLUP_FILE_URL_" + referenceId + ");\n\n      export default " + JSON.stringify(postResult.tokens)
                    }];
            }
            if (insert) {
                return [2 /*return*/, {
                        map: { mappings: '' },
                        code: "export default " + injectFnName + "(" + JSON.stringify(postResult.css) + ")"
                    }];
            }
            return [2 /*return*/, {
                    map: { mappings: '' },
                    code: "export default " + JSON.stringify(postResult.css)
                }];
        });
    });
}
function plugin(options) {
    if (options === void 0) { options = {}; }
    var filter = rollup_pluginutils_1.createFilter(options.include || ['/**/*.css', '/**/*.less'], options.exclude);
    return {
        name: 'anycss',
        intro: function () {
            return options.insert
                ? utils_1.insertStyle.toString().replace(/insertStyle/, injectFnName)
                : '';
        },
        transform: function (code, fileName) {
            return __awaiter(this, void 0, void 0, function () {
                var cssModule, insert, emitFile, emitChunk, enableModule, exportOptions, lessOptions, postCssOptions, css, postResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!filter(fileName)) {
                                return [2 /*return*/];
                            }
                            cssModule = options.cssModule;
                            insert = options.insert;
                            emitFile = this.emitFile;
                            emitChunk = this.emitChunk;
                            enableModule = !!options.cssModule;
                            exportOptions = {
                                insert: insert,
                                fileName: fileName,
                                emitFile: emitFile,
                                emitChunk: emitChunk,
                                enableModule: enableModule,
                            };
                            lessOptions = __assign({}, options.lessOptions);
                            postCssOptions = {
                                fileName: fileName,
                                source: code,
                                cssModule: typeof cssModule === 'object' && cssModule || {}
                            };
                            return [4 /*yield*/, parser_1.less(code, __assign(__assign({}, lessOptions), { paths: [path_1.default.dirname(fileName)] }))]; // 预处理 less 语法
                        case 1:
                            css = _a.sent() // 预处理 less 语法
                            ;
                            return [4 /*yield*/, postCss(__assign(__assign({}, postCssOptions), { source: css.css }))]; // 处理 css
                        case 2:
                            postResult = _a.sent() // 处理 css
                            ;
                            return [4 /*yield*/, exportCode(__assign(__assign({}, exportOptions), { postResult: postResult }))]; // 导出转换后的代码
                        case 3: // 处理 css
                        return [2 /*return*/, _a.sent()]; // 导出转换后的代码
                    }
                });
            });
        }
    };
}

module.exports = plugin;
//# sourceMappingURL=index.js.map