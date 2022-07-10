import { LodestoneNews } from './news'

export * from './config'
export * from './news'

const getNews = (option: Parameters<LodestoneNews['getNews']>[0]) =>
  new LodestoneNews().getNews(option)

export default getNews
