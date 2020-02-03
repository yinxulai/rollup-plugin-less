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
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var parser_1 = __importDefault(require("./parser"));
var postcss_1 = __importDefault(require("postcss"));
var postcss_modules_1 = __importDefault(require("postcss-modules"));
function toCaseName(name) {
    if (name === void 0) { name = ''; }
    return __spread(name.replace(/-(\w)/g, function (_, $1) { return $1.toUpperCase(); })).filter(function (t) { return t !== '-'; }).join('');
}
function writeFile(filepath, contents) {
    return __awaiter(this, void 0, void 0, function () {
        var dir, file;
        return __generator(this, function (_a) {
            dir = path_1.default.dirname(filepath);
            fs_1.default.mkdirSync(dir, { recursive: true });
            file = fs_1.default.openSync(filepath, 'w');
            fs_1.default.writeFileSync(file, contents);
            fs_1.default.closeSync(file);
            return [2 /*return*/];
        });
    });
}
// 处理 css
function exportCss(identity, css, option) {
    return __awaiter(this, void 0, void 0, function () {
        var basename, name_1, referenceId;
        return __generator(this, function (_a) {
            if (option.module) { // 输出文件
                basename = path_1.default.basename(identity);
                name_1 = basename.replace(/\.\w*$/, '.css');
                referenceId = option.emitFile({ name: name_1, source: css.css, type: 'asset' });
                return [2 /*return*/, "require(import.meta.ROLLUP_FILE_URL_" + referenceId + ");\nexport default " + JSON.stringify(css.tokens)];
            }
            return [2 /*return*/, "export default " + JSON.stringify(css.css)];
        });
    });
}
function postCss(identity, rawcss, option) {
    return __awaiter(this, void 0, void 0, function () {
        var result, moduleOptions, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    option = option || {};
                    result = { tokens: {} };
                    moduleOptions = __assign(__assign({}, option), { to: identity, from: identity, getJSON: function (_, token) { return result.tokens = token; } });
                    return [4 /*yield*/, postcss_1.default([postcss_modules_1.default(moduleOptions)])
                            .process(rawcss)];
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
function plugin(options) {
    if (options === void 0) { options = {}; }
    var enableCssModule = !!options.module;
    var exportFiles = [];
    return {
        name: 'anycss',
        renderStart: function (options) {
            var _this = this;
            if (!options || !options.file) {
                return;
            }
            var dist = path_1.default.dirname(options.file);
            exportFiles.filter(Boolean).forEach(function (file) {
                if (!file.name || !file.fileName) {
                    return;
                }
                return _this.emitFile(__assign(__assign({}, file), { fileName: undefined }));
            });
        },
        transform: function (code, identity) {
            return __awaiter(this, void 0, void 0, function () {
                var emitFile, index, paser, test, rawcss, result, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            emitFile = this.emitFile;
                            index = 0;
                            _a.label = 1;
                        case 1:
                            if (!(index < parser_1.default.length)) return [3 /*break*/, 8];
                            paser = parser_1.default[index];
                            test = parser_1.default[index].test;
                            if (typeof test === 'function') {
                                if (!test(identity)) {
                                    return [2 /*return*/, null];
                                }
                            }
                            if (typeof test === 'string') {
                                if (!identity.includes(test)) {
                                    return [2 /*return*/, null];
                                }
                            }
                            if (test instanceof RegExp) {
                                if (!test.test(identity)) {
                                    return [2 /*return*/, null];
                                }
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 6, , 7]);
                            return [4 /*yield*/, paser.parse(identity, code, options)];
                        case 3:
                            rawcss = _a.sent();
                            return [4 /*yield*/, postCss(identity, rawcss, options.module)]; // 处理 css
                        case 4:
                            result = _a.sent() // 处理 css
                            ;
                            return [4 /*yield*/, exportCss(identity, result, { emitFile: emitFile, module: true })];
                        case 5: // 处理 css
                        return [2 /*return*/, _a.sent()];
                        case 6:
                            err_1 = _a.sent();
                            throw new Error(err_1);
                        case 7:
                            index++;
                            return [3 /*break*/, 1];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        }
    };
}
exports.default = plugin;
//# sourceMappingURL=index.js.map