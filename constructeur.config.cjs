const { config, esmConfig } = require('@hamster-bot/constructeur')

module.exports = [
  {
    ...config,
    outfile: 'dist/cjs/index.js',
  },
  {
    ...esmConfig,
    outfile: 'dist/esm/index.js',
  },
]
