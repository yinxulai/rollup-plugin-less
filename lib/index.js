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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var postcss_1 = __importDefault(require("postcss"));
var postcss_less_1 = __importDefault(require("postcss-less"));
var postcss_scss_1 = __importDefault(require("postcss-scss"));
var postcss_sass_1 = __importDefault(require("postcss-sass"));
var postcss_modules_1 = __importDefault(require("postcss-modules"));
var rollup_pluginutils_1 = require("rollup-pluginutils");
function toCaseName(name) {
    if (name === void 0) { name = ''; }
    return __spread(name.replace(/-(\w)/g, function (_, $1) { return $1.toUpperCase(); })).filter(function (t) { return t !== '-'; }).join('');
}
// 处理 css
function exportCode(options) {
    return __awaiter(this, void 0, void 0, function () {
        var fileName, postResult, emitFile, enableModule, basename, name_1, referenceId;
        return __generator(this, function (_a) {
            fileName = options.fileName, postResult = options.postResult, emitFile = options.emitFile, enableModule = options.enableModule;
            if (enableModule) { // 启用了 css module
                basename = path_1.default.basename(fileName);
                name_1 = basename.replace(/\.\w*$/, '.css');
                referenceId = emitFile({ name: name_1, source: postResult.css, type: 'asset' });
                return [2 /*return*/, {
                        map: { mappings: '' },
                        dependencies: [],
                        code: "require(import.meta.ROLLUP_FILE_URL_" + referenceId + ");\nexport default " + JSON.stringify(postResult.tokens)
                    }];
            }
            return [2 /*return*/, {
                    map: { mappings: '' },
                    code: "export default " + JSON.stringify(postResult.css)
                }];
        });
    });
}
function handlePostCss(options) {
    return __awaiter(this, void 0, void 0, function () {
        var fileName, source, postCss, cssModule, result, moduleOptions, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileName = options.fileName, source = options.source, postCss = options.postCss, cssModule = options.cssModule;
                    result = { tokens: {} };
                    moduleOptions = __assign(__assign({}, (typeof cssModule === 'object' && cssModule)), { getJSON: function (_, token) { return result.tokens = token; } });
                    return [4 /*yield*/, postcss_1.default([postcss_modules_1.default(moduleOptions)]).process(source, __assign(__assign({}, postCss), { from: fileName }))];
                case 1:
                    data = _a.sent();
                    result.css = data.css;
                    result.map = data.map;
                    Object.keys(result.tokens).forEach(function (key) {
                        var newKey = toCaseName(key);
                        result.tokens[newKey] = result.tokens[key];
                    });
                    return [2 /*return*/, result];
            }
        });
    });
}
function getPostSyntaxPlugin(file) {
    switch (path_1.default.extname(file)) {
        case '.less':
            return [postcss_less_1.default, true];
        case '.scss':
            return [postcss_scss_1.default, true];
        case '.sass':
            return [postcss_sass_1.default, true];
        case '.css':
            return [undefined, true];
        default:
            return [undefined, false];
    }
}
function plugin(options) {
    if (options === void 0) { options = {}; }
    var filter = rollup_pluginutils_1.createFilter(options.include || ['/**/*.css', '/**/*.less', '/**/*.scss', '/**/*.sass'], options.exclude);
    return {
        name: 'anycss',
        transform: function (code, fileName) {
            return __awaiter(this, void 0, void 0, function () {
                var cssModule, emitFile, emitChunk, enableModule, _a, syntax, ok, exportOptions, handleOptions, postResult, err_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!filter(fileName)) {
                                return [2 /*return*/];
                            }
                            cssModule = options.cssModule;
                            emitFile = this.emitFile;
                            emitChunk = this.emitChunk;
                            enableModule = !!options.cssModule;
                            _a = __read(getPostSyntaxPlugin(fileName), 2), syntax = _a[0], ok = _a[1];
                            if (!ok) {
                                return [2 /*return*/];
                            }
                            exportOptions = {
                                fileName: fileName,
                                emitFile: emitFile,
                                emitChunk: emitChunk,
                                enableModule: enableModule,
                            };
                            handleOptions = {
                                fileName: fileName,
                                source: code,
                                postCss: { syntax: syntax },
                                cssModule: typeof cssModule === 'object' && cssModule || {}
                            };
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, handlePostCss(handleOptions)]; // 处理 css
                        case 2:
                            postResult = _b.sent() // 处理 css
                            ;
                            return [4 /*yield*/, exportCode(__assign(__assign({}, exportOptions), { postResult: postResult }))];
                        case 3: // 处理 css
                        return [2 /*return*/, _b.sent()];
                        case 4:
                            err_1 = _b.sent();
                            throw new Error(err_1);
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        generateBundle: function (options, bundle, isWrite) {
            // 输出文件
        }
    };
}
exports.default = plugin;
//# sourceMappingURL=index.js.map