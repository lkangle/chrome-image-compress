import { urlSafeBase64Encode } from '@/common/base64'
import { fetch } from '@/common/bg-fetch'
import { getCdnConfig } from '@/common/config'
import { CdnTypes } from '@/common/contants'
import type { IUploadServer } from '@/types'
import encBase64 from 'crypto-js/enc-base64'
import HmacSHA1 from 'crypto-js/hmac-sha1'

interface IOption {
    accessKey: string
    secretKey: string
    bucket: string
    url: string
    region: string
    path?: string
}

const safe64 = (str: string) => {
    return str.replace(/\//g, '_').replace(/\+/g, '-')
}

const getOption = (): Promise<IOption> => getCdnConfig(CdnTypes.QINIU)

function createQiniuServer(): IUploadServer {
    let uploadToken = ''
    let deadline = 0

    function getUploadToken(option: IOption) {
        const path = option.path || 'images/'

        const now = Date.now()
        if (uploadToken && deadline > now + 2e3) {
            return uploadToken
        }

        deadline = now + 18e5

        const returnBody = {
            key: '$(key)',
            hash: '$(etag)',
            size: '$(fsize)',
            width: '$(imageInfo.width)',
            height: '$(imageInfo.height)',
        }
        const putPolicy = JSON.stringify({
            scope: option.bucket,
            deadline,
            saveKey: path + '$(etag)$(ext)',
            returnBody: JSON.stringify(returnBody),
        })
        const encodedPolicy = urlSafeBase64Encode(putPolicy)

        const hash = HmacSHA1(encodedPolicy, option.secretKey)
        const encodedSigned = hash.toString(encBase64)

        uploadToken = option.accessKey + ':' + safe64(encodedSigned) + ':' + encodedPolicy
        return uploadToken
    }

    return {
        async enable() {
            const option: IOption = await getOption()
            return (
                !!option.accessKey &&
                !!option.secretKey &&
                !!option.bucket &&
                !!option.url &&
                !!option.region
            )
        },

        async upload(file) {
            const option = await getOption()
            const region = option.region || 'z0'

            const token = getUploadToken(option)

            const fd = new FormData()
            fd.append('token', token)
            fd.append('file', file)

            const url = `https://upload-${region}.qiniup.com`
            const data = await fetch(url, {
                method: 'POST',
                body: fd,
            })

            const cdnUrl = new URL(data.key, option.url).href
            return {
                url: cdnUrl,
                uploadTime: Date.now(),
                width: Number(data.width),
                height: Number(data.height),
                size: Number(data.size),
                name: file.name,
            }
        },
    }
}

export default createQiniuServer
