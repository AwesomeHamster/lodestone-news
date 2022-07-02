import { load } from 'cheerio'
import config, { News, Page } from './config'
import { getUrl } from './utils'
export { News, Page }

export const regions = ['na', 'eu', 'fr', 'de', 'jp'] as const
export type Region = typeof regions[number]

export interface Context {
  region: Region
  category: string
  page: number
  referer: string
}

export async function getLodestoneNews(meta: {
  region: Region
  category: string
  count: number
}): Promise<News[]> {
  const { region = 'jp', category = 'topics', count = 5 } = meta
  const ret = []
  let curPage = 1
  while (ret.length < count) {
    const { news, page } = await getNewsPage(region, category, curPage)
    ret.push(...news)
    curPage = page.current + 1
    if (curPage > page.total) {
      break
    }
  }
  return ret.slice(0, count)
}
export default getLodestoneNews

export async function getNewsPage(
  region: Region,
  category: string,
  page: number,
): Promise<{ news: News[]; page: Page }> {
  if (regions.includes(region) === false) {
    throw new Error(`Invalid locale: ${region}`)
  }
  if (Object.prototype.hasOwnProperty.call(config.rules, category) === false) {
    throw new Error(`Invalid category: ${category}`)
  }
  if (page <= 0) {
    throw new Error(`Invalid page: ${page}`)
  }

  const ctx: Context = { region, category, page, referer: '' }
  const rule = config.rules[category]
  const url = typeof rule.url === 'function' ? rule.url(ctx) : rule.url
  ctx.referer = url

  const resp = await getUrl(url)
  const $ = load(resp)
  const rootNode = rule.rootNode($, ctx)
  const pager = rule.page(rootNode, $, ctx)
  const items = rule.items(rootNode, $, ctx)
  return { news: items, page: pager }
}
