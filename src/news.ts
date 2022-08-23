import { RequestOptions } from 'https'

import { load } from 'cheerio'

import defaultConfig, {
  Config,
  defaultRules,
  News,
  NewsList,
  Rule,
} from './config'
import { filter, getUrl } from './utils'

export const regions = ['na', 'eu', 'fr', 'de', 'jp'] as const
export type Region = typeof regions[number]

export interface Context {
  region: Region
  category: string
  page: number
  referer: string
}

export class LodestoneNews {
  protected rules: Record<string, Rule>
  protected region: Region
  protected count: number
  protected request?: RequestOptions
  constructor(config: Partial<Config> = {}) {
    this.rules = { ...defaultRules, ...config.rules }
    this.region = config.region ?? defaultConfig.region
    this.count = config.count ?? defaultConfig.count
  }

  async getNews(option: {
    region?: Region
    category?: string
    count?: number
    request?: RequestOptions
    before?: Date
    after?: Date
  }): Promise<News[]> {
    const {
      region = this.region,
      category = 'topics',
      count = this.count,
      request = this.request ?? undefined,
      before,
      after,
    } = option
    const ret = []
    let curPage = 1
    while (ret.length < count) {
      const news = await this.getPage({
        region,
        category,
        page: curPage,
        request,
      })
      const arr = before || after ? filter(news, before, after) : news
      ret.push(...arr)
      curPage = news.current + 1
      if (curPage > news.total || arr.length === 0) {
        break
      }
    }
    return ret.slice(0, count)
  }

  async getPage(option: {
    region: Region
    category: string
    page: number
    request?: RequestOptions
  }): Promise<NewsList> {
    const { region, category, page, request } = option
    if (regions.includes(region) === false) {
      throw new Error(`Invalid locale: ${region}`)
    }
    if (!Object.prototype.hasOwnProperty.call(this.rules, category)) {
      throw new Error(`Invalid category: ${category}`)
    }
    if (page <= 0) {
      throw new Error(`Invalid page: ${page}`)
    }

    const ctx: Context = { region, category, page, referer: '' }
    const rule = this.rules[category]
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
}
