import { useLatest } from "ahooks";
import { useEffect } from "react"

function useClickOuter<T extends Event = Event>(onClick: (e: T) => void, target: HTMLElement) {
    const clickRef = useLatest(onClick)

    useEffect(() => {
        const handle = (e: any) => {
            if (e.target === target || target.contains(e.target)) {
                return;
            }
            clickRef.current?.(e)
        }

        document.body.addEventListener("click", handle, true)
        return () => {
            document.body.removeEventListener("click", handle, true)
        }
    }, [])
}

export default useClickOuter