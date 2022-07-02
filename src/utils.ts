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
