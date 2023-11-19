import { useAsyncEffect } from 'ahooks'
import { useState } from 'react'

function useAsyncState<T>(initfn?: () => Promise<T>) {
    const [data, setData] = useState<T>()

    useAsyncEffect(async () => {
        try {
            const d = await initfn?.()
            setData(d)
        } catch (e) {
            console.warn(e)
        }
    }, [])

    return [data, setData]
}

export default useAsyncState
