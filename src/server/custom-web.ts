import { fetch } from '@/common/bg-fetch'
import { getCdnConfig } from '@/common/config'
import { CdnTypes, CodeError } from '@/common/contants'
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

            const resp = await fetch(option.url, {
                method: 'POST',
                body: fd,
                headers,
            })

            if (resp.ok) {
                const cdnUrl = get(resp.data, option.jsonPath)
                const uploadTime = Date.now()

                const filename = file.name
                const size = file.size

                return {
                    name: filename,
                    size,
                    width: 0,
                    height: 0,
                    url: cdnUrl,
                    uploadTime,
                }
            }

            const message = resp.data ? JSON.stringify(resp.data) : resp.statusText
            throw new CodeError(resp.status, message)
        },
    }
}

export default createCustomWebServer
