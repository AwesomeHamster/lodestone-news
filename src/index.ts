import { LodestoneNews } from './news'

export * from './config'
export * from './news'

/**
 * Fetch the latest news from Lodestone.
 * @param {Object} option - The options to use when creating the LodestoneNews instance
 * @param {string} option.region - The region to fetch news from
 * @param {string} option.category - The category to fetch news from
 * @param {number} option.count - The number of news to fetch
 * @param {Object} option.request - The request options to use when fetching the news
 * @returns {Promise<News>} - News instance
 */
export const getNews = (option: Parameters<LodestoneNews['getNews']>[0]) =>
  new LodestoneNews().getNews(option)

export default getNews
