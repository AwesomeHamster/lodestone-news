import https from 'https'

import { expect } from 'chai'

import { defaultRules, getNews, LodestoneNews, regions } from '../src'

const UTC_0_2022_07_19_07_59_59 = 1658217599 * 1000 // 2022-07-19 07:59:59 UTC+0

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

it('should accept agent', async () => {
  const agent = new https.Agent({ keepAlive: true })
  const news = await getNews({
    region: 'jp',
    category: 'topics',
    count: 20,
    request: { agent },
  })
  expect(news).is.an('array')
  expect(news).has.length.which.is.greaterThan(0)
})

it('should accept custom config', async () => {
  const lodestone = new LodestoneNews({
    region: 'na',
    count: 10,
    rules: {
      custom: defaultRules.topics,
    },
  })
  const news = await lodestone.getNews({ category: 'custom' })
  expect(news).is.an('array')
  expect(news.length).equals(10)
  expect(news[0]).has.property('title').which.is.a('string')
  expect(news[0]).has.property('epoch').which.is.a('number')
  expect(news[0]).has.property('url').which.is.a('string')
  expect(news[0]).has.property('date').which.is.a('date')
})

it('should filter with after / before', async () => {
  const news = await getNews({
    region: 'na',
    category: 'topics',
    count: 100,
    after: new Date(UTC_0_2022_07_19_07_59_59), 
    before: new Date('2022-07-20'),
  })
  expect(news).is.an('array')
  expect(news[0]).has.property('title').which.is.a('string')
  expect(news[0]).has.property('epoch').which.is.a('number')
  expect(news[0]).has.property('url').which.is.a('string')
  expect(news[0]).has.property('date').which.is.a('date')
  expect(news.length).is.equal(2)
  expect(news[0].date).is.lessThan(new Date('2022-07-20'))
  expect(news[news.length - 1].date).is.greaterThan(new Date(UTC_0_2022_07_19_07_59_59))
}).timeout(0)

it('should filter with after', async () => {
  const news = await getNews({
    region: 'na',
    category: 'topics',
    count: 100,
    after: new Date(UTC_0_2022_07_19_07_59_59),
  })
  expect(news).is.an('array')
  expect(news[0]).has.property('title').which.is.a('string')
  expect(news[0]).has.property('epoch').which.is.a('number')
  expect(news[0]).has.property('url').which.is.a('string')
  expect(news[0]).has.property('date').which.is.a('date')
  expect(news[news.length - 1].date).is.greaterThan(new Date(UTC_0_2022_07_19_07_59_59))
}).timeout(0)

it('should filter with before', async () => {
  const news = await getNews({
    region: 'na',
    category: 'topics',
    count: 100,
    before: new Date('2020-12-24'),
  })
  expect(news).is.an('array')
  expect(news[0]).has.property('title').which.is.a('string')
  expect(news[0]).has.property('epoch').which.is.a('number')
  expect(news[0]).has.property('url').which.is.a('string')
  expect(news[0]).has.property('date').which.is.a('date')
  expect(news[0].date).is.lessThan(new Date('2020-12-24'))
}).timeout(0)
