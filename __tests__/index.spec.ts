import * as https from 'https'

import { Assertion, expect, util, use } from 'chai'
import chaiEach from 'chai-each'

import { defaultRules, getNews, LodestoneNews, regions } from '../src'

use(chaiEach)

const UTC_0_2022_07_19_07_59_59 = 1658217599 * 1000 // 2022-07-19 07:59:59 UTC+0

const a = function (_super: typeof Assertion) {
  function assertNews(this: typeof Assertion) {
    new Assertion(this._obj).to.have.property('title').which.is.a('string')
    new Assertion(this._obj).to.have.property('url').which.is.a('string')
    new Assertion(this._obj).to.have.property('epoch').which.is.a('number')
    new Assertion(this._obj).to.have.property('date').which.is.a('date')
  }
  return function (this: typeof Assertion, value: unknown, message?: string) {
    if (value === 'news') {
      if (util.flag(this, 'each')) {
        const each = util.flag(this, 'each')
        util.flag(this, 'each', each - 1)

        new Assertion(this._obj).is.an.instanceOf(Array)
        this._obj.map(item => {
          const that = Object.create(this)
          util.transferFlags(that, this, false)
          util.flag(that, 'object', item)
          assertNews.apply(this, [value, message])
          return util.flag(that, 'object')
        })
      } else {
        assertNews.apply(this, [value, message])
      }
    } else {
      _super.apply(this, [value, message])
    }
  }
}

function noop() {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return function () { }
}

Assertion.overwriteChainableMethod('a', a, noop)
Assertion.overwriteChainableMethod('an', a, noop)

declare global {
  namespace Chai {
    interface Assertion {
      newsList: Assertion
    }
  }
}

Assertion.addProperty('newsList', function () {
  new Assertion(this._obj).to.be.a('array')
  new Assertion(this._obj).each.to.be.a('news')
  util.flag(this, 'newsList', true)
})

regions.forEach((region) => {
  const categories = ['topics', 'notices', 'maintenance', 'updates', 'status']

  describe(`Locale: ${region}`, () => {
    categories.forEach((category) => {
      it(`should fetch ${category}`, async () => {
        const news = await getNews({
          region,
          category,
          count: 20,
        })
        expect(news).to.be.newsList.which.has.length.greaterThan(0)
      }).timeout(0)
    })
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
  expect(news).to.be.an('array')
  expect(news).to.have.length(20)
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
  expect(news).to.be.newsList.which.has.length(10)
})

it('should filter with after / before', async () => {
  const news = await getNews({
    region: 'na',
    category: 'topics',
    count: 100,
    after: new Date(UTC_0_2022_07_19_07_59_59),
    before: new Date('2022-07-20'),
  })
  expect(news).to.be.newsList.which.has.length.greaterThan(0)
  expect(news).to.each.have.property('date').which.is.lessThan(new Date('2022-07-20'))
  expect(news).to.each.have.property('date').which.is.greaterThan(new Date(UTC_0_2022_07_19_07_59_59))
}).timeout(0)

it('should filter with after', async () => {
  const news = await getNews({
    region: 'na',
    category: 'topics',
    count: 100,
    after: new Date(UTC_0_2022_07_19_07_59_59),
  })
  expect(news).to.be.newsList.which.has.length.greaterThan(0)
  expect(news).to.each.have.property('date').which.is.greaterThan(new Date(UTC_0_2022_07_19_07_59_59))
}).timeout(0)

it('should filter with before', async () => {
  const news = await getNews({
    region: 'na',
    category: 'topics',
    count: 100,
    before: new Date('2020-12-24'),
  })
  expect(news).is.newsList.which.has.length.greaterThan(0)
  expect(news).to.each.have.property('date').which.is.lessThan(new Date('2020-12-24'))
}).timeout(0)
