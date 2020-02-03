import less from 'less'
import path from 'path'

export default {
    test: /\.less$/i,
    parse: async (id: string, code: string, option: Less.Options): Promise<string> => {
        option = { ...option, paths: [path.dirname(id)] }
        
        try {
            const data = await less.render(code, option)
            return data.css
        } catch (e) {
            console.log('parse less error:', e)
            throw new Error(e)
        }
    }
}