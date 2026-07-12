import { useCallback, useEffect, useState } from 'react'

export function useApiResource<T>(fetcher: () => Promise<T>, id: string | undefined) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(() => id !== undefined)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setError('No se pudo cargar el registro.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, reloadToken])

  const reload = useCallback(() => setReloadToken((t) => t + 1), [])

  return { data, loading, error, reload }
}
