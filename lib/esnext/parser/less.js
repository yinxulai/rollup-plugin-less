import less from 'less';
export default async (source, option) => {
    const data = await less.render(source, option);
    return {
        css: data.css,
        map: data.map
    };
};
//# sourceMappingURL=less.js.map