import { useState, useEffect } from 'react'

export const useStore = <T, F>(
  store: any,
  callback: (state: T) => F
): F | undefined => {
  const result = store(callback)
  const [data, setData] = useState<F>()

  useEffect(() => {
    setData(result)
  }, [result])

  return data
}
