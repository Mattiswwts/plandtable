import { useEffect } from 'react'

const SITE_ORIGIN = 'https://www.plandtable.fr'

export function usePageMeta(title, description, { noindex = false } = {}) {
  useEffect(() => {
    document.title = title

    let descriptionTag = document.querySelector('meta[name="description"]')
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta')
      descriptionTag.setAttribute('name', 'description')
      document.head.appendChild(descriptionTag)
    }
    descriptionTag.setAttribute('content', description)

    let canonicalTag = document.querySelector('link[rel="canonical"]')
    if (!canonicalTag) {
      canonicalTag = document.createElement('link')
      canonicalTag.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalTag)
    }
    canonicalTag.setAttribute('href', `${SITE_ORIGIN}${window.location.pathname}`)

    let robotsTag = document.querySelector('meta[name="robots"]')
    if (!robotsTag) {
      robotsTag = document.createElement('meta')
      robotsTag.setAttribute('name', 'robots')
      document.head.appendChild(robotsTag)
    }
    robotsTag.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow')
  }, [title, description, noindex])
}
