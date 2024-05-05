import { useRef, useState } from "react"

export default () => {
  const [object, setObject] = useState<any>(null)
  const [error, setError] = useState<any>(false)
  const [loading, setLoading] = useState<any>(null)
  const unsubscribe = useRef(null)

  const init = (fetchClass, fetchParams) => {
    const objectListener = (data) => {
      setLoading(false)
      if (data) {
        console.log("[" + fetchClass.name + "]", data.id, data)
        setObject(data)
      } else {
        setError(true)
        setObject(null)
      }
    }
    if (object) clear()
    setLoading(true)
    unsubscribe.current = fetchClass.fetch({ ...fetchParams }, { listener: objectListener })

    return unsubscribe.current
  }

  const clear = () => {
    if (object) {
      console.log("[Context] Clear listener", object, unsubscribe)
      setObject(null)
      unsubscribe.current && unsubscribe.current()
      unsubscribe.current = null
    }
  }
  return { object, init, clear, loading, error }
}
