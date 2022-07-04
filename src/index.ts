import { load } from 'cheerio'
import { RequestOptions } from 'https'
import config, { News, NewsList, Page } from './config'
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

export async function getLodestoneNews(option: {
  region?: Region
  category?: string
  count?: number
  request?: RequestOptions
}): Promise<News[]> {
  const { region = 'jp', category = 'topics', count = -1, request } = option
  const ret = []
  let curPage = 1
  while (ret.length < count) {
    const news = await getNewsPage({ region, category, page: curPage, request })
    ret.push(...news)
    curPage = news.current + 1
    if (curPage > news.total) {
      break
    }
  }
  return ret.slice(0, count)
}
export default getLodestoneNews

export async function getNewsPage(option: {
  region: Region
  category: string
  page: number
  request?: RequestOptions
}): Promise<NewsList> {
  const { region, category, page, request } = option
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

  const resp = await getUrl(url, request)
  const $ = load(resp)
  const rootNode = rule.rootNode($, ctx)
  const pager = rule.page(rootNode, $, ctx)
  const items = rule.items(rootNode, $, ctx)

  const news = items as NewsList
  news.current = pager.current
  news.total = pager.total
  return news
}
