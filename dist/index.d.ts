interface Options {
    module: any;
}
export default function plugin(options: Options): {
    name: string;
    transform: (code: string, identity: string) => Promise<{
        code: string;
        map: {
            mappings: string;
        };
    } | null | undefined>;
};
export {};
//# sourceMappingURL=index.d.ts.map