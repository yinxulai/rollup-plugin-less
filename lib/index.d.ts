import Rollup from 'rollup';
import { LessOptions } from './parser/less';
declare type GenerateScopedNameFunction = (name: string, filename: string, css: string) => string;
interface CssModuleOptions {
    scopeBehaviour?: 'global' | 'local';
    globalModulePaths?: (RegExp | string)[];
    generateScopedName?: string | GenerateScopedNameFunction;
    hashPrefix?: string;
    camelCase?: boolean;
    root?: string;
}
interface Options {
    insert?: boolean;
    include?: string[];
    exclude?: string[];
    cssModule?: CssModuleOptions | boolean;
    lessOptions?: LessOptions;
}
export default function plugin(options?: Options): Rollup.Plugin;
export {};
//# sourceMappingURL=index.d.ts.map