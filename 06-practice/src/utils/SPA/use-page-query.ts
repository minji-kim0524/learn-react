import { useEffect, useState } from 'react'

export default function usePageQuery<T = string>(initialValue: T) {
  const [page, setPage] = useState<T>(initialValue)

  useEffect(() => {
    const handler = () => {
      const params = new URLSearchParams(globalThis.location.search)
      const value = params.get('page')
      setPage((value as T) ?? initialValue)
    }

    handler() // 최초 한 번 실행

    globalThis.addEventListener('popstate', handler)
    return () => {
      globalThis.removeEventListener('popstate', handler)
    }
  }, [initialValue])

  return page
}
