import { create } from 'zustand'

interface IStore {
    enable: boolean
    setEnable: (en: boolean) => void
}

const key = 'advanced_copy_disable'

const useAdvCopyEnable = create<IStore>((set) => {
    const init = window.localStorage.getItem(key)

    return {
        enable: !init,
        setEnable(enable) {
            set({ enable })
            window.localStorage.setItem(key, enable ? '' : '1')
        },
    }
})

export default useAdvCopyEnable
