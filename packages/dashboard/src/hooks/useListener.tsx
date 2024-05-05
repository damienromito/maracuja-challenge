import { useEffect, useState } from "react"

export default (initListener: any, defaultValue?: any, deps: ReadonlyArray<any> = []) => {
  const [object, setObject] = useState<any>(defaultValue)

  useEffect(() => {
    const unsubscribe = handleInit()
    return () => {
      return unsubscribe && unsubscribe()
    }
  }, deps)

  const handleInit = () => {
    return initListener((o) => {
      setObject(o)
    })
  }

  return object
}
