import { useEffect, useState } from "react"

function useAsyncState<T>(initfn?: () => Promise<T>) {
    const [data, setData] = useState<T>()

    useEffect(() => {
        initfn?.().then(d => {
            setData(d)
        }).catch(console.warn)
    }, [])

    return [data, setData]
}

export default useAsyncState