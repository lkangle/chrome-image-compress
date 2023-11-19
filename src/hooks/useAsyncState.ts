import { useAsyncEffect } from 'ahooks'
import { useState } from 'react'

function useAsyncState<T>(initfn?: () => Promise<T>) {
    const [data, setData] = useState<T>()

    useAsyncEffect(async () => {
        try {
            let d = await initfn?.()
            setData(d)
        } catch (e) {
            console.warn(e)
        }
    }, [])

    return [data, setData]
}

export default useAsyncState
