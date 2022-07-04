import https from 'https'
import http from 'http'
import { URL } from 'url'

export function makeUrl(href: string, pageUrl: string) {
  if (href.startsWith('http')) {
    return href
  }
  const root = new URL(pageUrl)
  if (href.startsWith('/')) {
    return `${root.origin}${href}`
  } else {
    root.pathname += `/${href}`
    return root.toString()
  }
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
