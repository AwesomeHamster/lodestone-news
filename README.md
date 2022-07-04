# lodestone-news

FFXIV Lodestone news crawler

## Install

```bash
npm i lodestone-news
yarn add lodestone-news
```

## Usage

```js
const getLodestoneNews = require('lodestone-news')

// getLodestoneNews is an async function, it is required to use
// async/await keyword, or use Promise.then to grab the result.
const newsList = getLodestoneNews({
  region: 'jp', // 'na', 'eu', 'fr', 'de' or 'jp'
  category: 'topics', // 'topics', 'notices', 'maintenance', 'updates' or 'status'
  count: 10, // grab 10 news content at maximum
})
```
