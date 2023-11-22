import { useAsyncEffect } from 'ahooks'
import { useState } from 'react'

function useAsyncState<T = any>(initfn?: () => Promise<T>) {
    const [data, setData] = useState<T>()

    useAsyncEffect(async () => {
        try {
            const d = await initfn?.()
            setData(d)
        } catch (e) {
            console.error(e)
        }
    }, [])

    return [data, setData]
}

export default useAsyncState
