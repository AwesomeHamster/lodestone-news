import https from 'https'
import { expect } from 'chai'
import getNews, { regions } from '../src'
import ProxyAgent from 'proxy-agent'
describe('lodestone-news', () => {

  const proxy = 'http://localhost:7890'
  const agent = new ProxyAgent(proxy)
  describe('use agent', () => {
    it('should accept agent', async () => {
      const news = await getNews({
        region: 'jp',
        category: 'topics',
        count: 20,
        request: { agent }
      })
      expect(news).is.an('array')
      expect(news).has.length.which.is.greaterThan(0)
    }).timeout(0)
  })

  describe('use direct connect', () => {
    it('not use agent', async () => {
      const news = await getNews({
        region: 'jp',
        category: 'topics',
        count: 20
      })
      expect(news).is.an('array')
      expect(news).has.length.which.is.greaterThan(0)
    }).timeout(0)
  })
})
