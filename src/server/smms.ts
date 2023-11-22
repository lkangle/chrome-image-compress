import { probeImageRect } from '@/common'
import { fetch } from '@/common/bg-fetch'
import { getCdnConfig } from '@/common/config'
import { CdnTypes, CodeError } from '@/common/contants'
import type { IUploadServer } from '@/types'

const getOption = (): Promise<IOption> => getCdnConfig(CdnTypes.SMMS)

function createSmmsServer(): IUploadServer {
    return {
        async enable() {
            const option = await getOption()
            return !!option.token
        },

        async upload(file) {
            const { token, domain = 'sm.ms' } = await getOption()

            const fd = new FormData()
            fd.append('smfile', file)

            const response: SmmsResponse = await fetch(`https://${domain}/api/v2/upload`, {
                method: 'POST',
                body: fd,
                headers: {
                    Authorization: `Basic ${token}`,
                },
            })

            const uploadTime = Date.now()

            if (response.success) {
                const data = response.data

                return {
                    ...data,
                    name: data.filename,
                    uploadTime,
                }
            }

            // 图片重复上传
            if (response.code === 'image_repeated') {
                const url = response.images
                const rect = await probeImageRect(url)

                return {
                    ...rect,
                    url,
                    name: file.name,
                    size: file.size,
                    uploadTime,
                }
            }

            throw new CodeError(Number(response.code), response.message)
        },
    }
}

export default createSmmsServer

interface IOption {
    token: string
    domain?: string
}

interface SmmsResponse {
    success: boolean
    code: string
    message: string
    data: Data
    RequestId: string
    images: string
}

interface Data {
    file_id: number
    width: number
    height: number
    filename: string
    storename: string
    size: number
    path: string
    hash: string
    url: string
    delete: string
    page: string
}
