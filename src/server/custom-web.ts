import { probeImageRect } from '@/common'
import { fetch } from '@/common/bg-fetch'
import { getCdnConfig } from '@/common/config'
import { CdnTypes } from '@/common/contants'
import type { IUploadServer } from '@/types'
import { entries, get } from 'lodash-es'

interface IOption {
    url: string
    paramName: string
    jsonPath: string
    customHeader?: string
    customBody?: string
}

const tryParse = (str: string) => {
    try {
        return JSON.parse(str)
    } catch {
        return undefined
    }
}

const getOption = (): Promise<IOption> => getCdnConfig(CdnTypes.CUSTOM)

function createCustomWebServer(): IUploadServer {
    return {
        async enable() {
            const option = await getOption()
            return !!option.url && !!option.paramName && !!option.jsonPath
        },

        async upload(file) {
            const option = await getOption()

            const headers = tryParse(option.customHeader)
            const obody = tryParse(option.customBody)

            const fd = new FormData()
            fd.append(option.paramName, file)
            entries(obody).forEach(([key, value]) => {
                fd.append(key, value as string)
            })

            const data = await fetch(option.url, {
                method: 'POST',
                body: fd,
                headers,
            })

            const cdnUrl = get(data, option.jsonPath)
            const uploadTime = Date.now()

            const rect = await probeImageRect(cdnUrl, data)

            const filename = file.name
            const size = file.size

            return {
                ...rect,
                name: filename,
                size,
                url: cdnUrl,
                uploadTime,
            }
        },
    }
}

export default createCustomWebServer
