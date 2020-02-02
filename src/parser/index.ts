import less from './less'

interface Parser {
    test: ((id: string) => Boolean) | string | RegExp
    parse: (code: string, options: any) => Promise<string> 
}

const parsers: Parser[] = [less]

export default parsers