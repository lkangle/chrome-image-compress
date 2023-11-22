import { getMimeType, probeImageRect, randomFilename } from '@/common'
import { fetch } from '@/common/bg-fetch'
import { getCdnConfig } from '@/common/config'
import { CdnTypes } from '@/common/contants'
import type { IUploadServer } from '@/types'
import Base64 from 'crypto-js/enc-base64'
import HmacSHA1 from 'crypto-js/hmac-sha1'

const getOption = (): Promise<IOption> => getCdnConfig(CdnTypes.ALIYUN)

function createAliyunServer(): IUploadServer {
    return {
        async enable() {
            const option = await getOption()
            return (
                !!option.accessKeyId && !!option.accessKeySecret && !!option.area && !!option.bucket
            )
        },

        async upload(file: File) {
            const option = await getOption()

            const dategmt = new Date().toUTCString()
            const filename = randomFilename(file.name)
            const mimeType = getMimeType(filename)

            const path = option.path ?? 'imgs/'
            const encodePath = encodeURI(path)

            const signString = `PUT\n\n${mimeType}\n${dategmt}\nx-oss-date:${dategmt}\n/${option.bucket}/${path}${filename}`
            let signature = Base64.stringify(HmacSHA1(signString, option.accessKeySecret))
            signature = `OSS ${option.accessKeyId}:${signature}`

            const url = `https://${option.bucket}.${
                option.area
            }.aliyuncs.com/${encodePath}${encodeURIComponent(filename)}`

            await fetch(url, {
                method: 'PUT',
                headers: {
                    Host: `${option.bucket}.${option.area}.aliyuncs.com`,
                    Authorization: signature,
                    'Content-Type': mimeType,
                    'x-oss-date': dategmt,
                    // 坑啊 Date的header会被过滤掉！！！
                },
                body: file,
                responseType: 'text',
            })

            const customUrl = option.customUrl

            let imgUrl = ''
            if (customUrl) {
                imgUrl = `${customUrl}/${encodePath}${encodeURIComponent(filename)}`
            } else {
                imgUrl = `https://${option.bucket}.${
                    option.area
                }.aliyuncs.com/${encodePath}${encodeURIComponent(filename)}`
            }

            const rect = await probeImageRect(imgUrl)
            return {
                url: imgUrl,
                size: file.size,
                name: file.name,
                uploadTime: Date.now(),
                ...rect,
            }
        },
    }
}

export default createAliyunServer

interface IOption {
    accessKeyId: string
    accessKeySecret: string
    // 存储空间名
    bucket: string
    // 存储区域代号
    area: string
    // 自定义存储路径
    path: string
    // 自定义域名，注意要加 `http://` 或者 `https://`
    customUrl: string
}
