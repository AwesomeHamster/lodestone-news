import * as https from 'https'

import { Assertion, expect, util, use } from 'chai'
import chaiThings from 'chai-things'

import { defaultRules, getNews, LodestoneNews, regions } from '../src'

use(chaiThings)

declare global {
  namespace Chai {
    interface Assertion {
      all: Chai.ArrayAssertion
    }
  }
}

const UTC_0_2022_07_19_07_59_59 = 1658217599 * 1000 // 2022-07-19 07:59:59 UTC+0

const a = function (_super: typeof Assertion) {
  return function (this: typeof Assertion, value: unknown, message?: string) {
    if (value === 'news') {
      new Assertion(this._obj).to.have.property('title').which.is.a('string')
      new Assertion(this._obj).to.have.property('url').which.is.a('string')
      new Assertion(this._obj).to.have.property('epoch').which.is.a('number')
      new Assertion(this._obj).has.property('date').which.is.a('date')
    } else {
      _super.apply(this, [value, message])
    }
  }
}

function noop() {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return function () {}
}

Assertion.overwriteChainableMethod('a', a, noop)
Assertion.overwriteChainableMethod('an', a, noop)

Assertion.addProperty('newsList', function () {
  new Assertion(this._obj).to.be.a('array')
  new Assertion(this._obj).all.have.property('title').which.is.a('string')
  new Assertion(this._obj).all.have.property('epoch').which.is.a('number')
  new Assertion(this._obj).all.have.property('url').which.is.a('string')
  new Assertion(this._obj).all.have.property('date').which.is.a('date')
  util.flag(this, 'newsList', true)
})

function length(_super: typeof Assertion) {
  return function (this: typeof Assertion, n?: number, message?: string) {
    if (util.flag(this, 'newsList')) {
      new Assertion(this._obj).to.have.property('length').which.is.a('number')
      if (n) {
        new Assertion(this._obj).to.have.length(n, message)
      } else {
        new Assertion(this._obj).to.have.length.greaterThan(0, message)
      }
      util.flag(this, 'newsList', false)
    } else {
      _super.apply(this, [n, message])
    }
  }
}

function assertLength() {
  return function () {
    util.flag(this, 'doLength', true)
  }
}

Assertion.overwriteChainableMethod('length', length, assertLength)
Assertion.overwriteChainableMethod('lengthOf', length, assertLength)

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
        expect(news).is.an('array')
        expect(news).has.length.greaterThan(0)
        expect(news[0]).is.a('news')
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
  expect(news[0]).is.a('news')
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
  expect(news[0]).to.be.a('news')
  expect(news).has.length(2)
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
  expect(news[0]).is.a('news')
  expect(news.slice(-1)[0].date).is.greaterThan(new Date(UTC_0_2022_07_19_07_59_59))
}).timeout(0)
