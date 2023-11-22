import { getCdnConfig } from '@/common/config'
import { CdnTypes } from '@/common/contants'
import type { IUploadServer } from '@/types'

const getOption = (): Promise<IOption> => getCdnConfig(CdnTypes.ALIYUN)

function createAliyunServer(): IUploadServer {
    return {
        async enable() {
            await getOption()
            return false
        },

        async upload() {
            return {} as any
        },
    }
}

export default createAliyunServer

interface IOption {
    accessKeyId: string
    accessKeySecret: string
    bucket: string
    area: string
    path: string
    customUrl: string
}
