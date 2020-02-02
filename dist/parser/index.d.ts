interface Parser {
    test: ((id: string) => Boolean) | string | RegExp;
    parse: (code: string, options: any) => Promise<string>;
}
declare const parsers: Parser[];
export default parsers;
//# sourceMappingURL=index.d.ts.map