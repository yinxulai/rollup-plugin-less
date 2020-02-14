import less from 'less'
import { ParseResult } from '.'
export type LessOptions = Less.Options
export default async (source: string, option: LessOptions): Promise<ParseResult> => {
  const data = await less.render(source, option)
  return {
    css: data.css,
    map: data.map
  }
}
