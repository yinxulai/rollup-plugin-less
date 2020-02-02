import less from 'less'

export default {
    test: /\.less$/i,
    parse: async (code: string, option: Less.Options): Promise<string> => {
        const data = await less.render(code, option)
        return data.css
    }
}