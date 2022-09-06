import http from 'http'
import https from 'https'

import { News } from './config'

export function filter(arr: News[], before?: Date, after?: Date): News[] {
  return arr.filter(({ date }) => {
    if (before && after) {
      if (before < after) {
        throw new Error(`\`before\`(${before}) should not be less than \`after\`(${after}).`)
      }
      if (date < before && date > after) return true
    } else if ((before && date < before) || (after && date > after)) return true
    return false
  })
}

export async function getUrl(url: string, options?: https.RequestOptions) {
  return new Promise<string>((resolve, reject) => {
    ;(url.startsWith('https://') ? https : http).get(
      url,
      { ...options },
      (res) => {
        let data = ''
        res.setEncoding('utf8')
        res.on('error', reject)
        res.on('data', (chunk) => {
          data += chunk as string
        })
        res.on('end', () => {
          resolve(data)
        })
      },
    )
  })
}
