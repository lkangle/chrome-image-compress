import { getAppConfig } from '@/common/config'
import { fileToBase64 } from '@/common/filesystem'
import { getUploadServer } from '@/server'
import type { CdnImage } from '@/types'
import { imageCompress } from '@/zimage'
import { create } from 'zustand'

export type IFileItem = Record<string, any> & {
    file: File
    strategy: number
}

interface IStore {
    fileList: IFileItem[]
    addFiles: (files: IFileItem[]) => void
}

const useUploadFiles = create<IStore>((set, get) => {
    return {
        fileList: [],
        addFiles(files) {
            const list = get().fileList
            set({ fileList: [...list, ...files] })
        },
    }
})

export default useUploadFiles

export async function emitShrinkUpload(item: IFileItem): Promise<CdnImage[]> {
    const { file, strategy } = item

    const opt = await getAppConfig()

    const resp = await imageCompress(file, opt)
    const outFile = resp.outFile

    const server = await getUploadServer()

    if (strategy === 0 || !server) {
        const url = await fileToBase64(outFile)
        return [
            {
                size: outFile.size,
                url,
                name: file.name,
            } as any,
        ]
    }

    if (strategy === 1) {
        const [r1] = await server.upload([outFile])
        const [r2] = await server.upload([file], false)
        return [r1, r2]
    }
    return server.upload([outFile])
}
