import { expect } from 'chai'
import getNews, { regions } from '../src'

describe('lodestone-news', () => {
  regions.forEach((region) => {
    describe(`Locale: ${region}`, () => {
      ;['topics', 'notices', 'maintenance', 'updates', 'status'].forEach(
        (category) => {
          it(`should fetch ${category}`, async () => {
            const news = await getNews({
              region,
              category,
              count: 20,
            })
            expect(news).is.an('array')
            expect(news).has.length.greaterThan(0)
            expect(news[0]).has.property('title').which.is.a('string')
            expect(news[0]).has.property('epoch').which.is.a('number')
            expect(news[0]).has.property('url').which.is.a('string')
            expect(news[0]).has.property('date').which.is.a('date')
          }).timeout(0)
        },
      )
    })
  })
})
