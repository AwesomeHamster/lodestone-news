# lodestone-news

[![Test](https://github.com/AwesomeHamster/lodestone-news/actions/workflows/test.yml/badge.svg)](https://github.com/AwesomeHamster/lodestone-news/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/AwesomeHamster/lodestone-news/branch/master/graph/badge.svg?token=9UVXLTPU78)](https://codecov.io/gh/AwesomeHamster/lodestone-news)

FFXIV Lodestone news crawler

## Install

Use your favourite package manager to install it!

```bash
yarn add lodestone-news
npm install lodestone-news
```

## Usage

```ts
import { getNews } from 'lodestone-news'
// Or use CommonJS style
const { getNews } = require('lodestone-news')

// getNews is an async function, it is required to use
// async/await keyword, or use Promise.then to grab the result.
const newsList = await getNews({
  region: 'na', // region could be 'na', 'eu', 'fr', 'de' or 'jp'
  category: 'topics', // 'topics', 'notices', 'maintenance', 'updates' or 'status'
  count: 3, // grab 3 news content (at maximum)
})

for (const news of newsList) {
  console.log(news.title)
  console.log(news.url)
}
// ->
// Watch the Latest Episode of Duty Commenced
// https://na.finalfantasyxiv.com/lodestone/topics/detail/baea1f118c1c739080e40e24e0a94903cf46b077
// Crystalline Conflict Season One Results Revealed as Season Two Commences!
// https://na.finalfantasyxiv.com/lodestone/topics/detail/9a21681153ac2a9e70de773f6e21cc0547759376
// Patch 6.18 Notes
// https://na.finalfantasyxiv.com/lodestone/topics/detail/aa641701b181ebf66aaf3264896b65acdbd23850
```

## Advanced

TODO

## License

This package is licensed under the MIT license.
