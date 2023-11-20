import { normalizeName, randomStr } from '@/common'
import { getCdnConfig } from '@/common/config'
import { CdnTypes } from '@/common/contants'
import type { IUploadServer } from '@/types'
import encBase64 from 'crypto-js/enc-base64'
import HmacSHA1 from 'crypto-js/hmac-sha1'
import { upload, urlSafeBase64Encode } from 'qiniu-js'

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
        const now = Date.now()
        if (uploadToken && deadline > now + 2e3) {
            return uploadToken
        }

        deadline = now + 18e5

        const returnBody = {
            key: '$(key)',
            hash: '$(etag)',
            name: '$(fname)',
            size: '$(fsize)',
            width: '$(imageInfo.width)',
            height: '$(imageInfo.height)',
        }
        const putPolicy = JSON.stringify({
            scope: option.bucket,
            deadline,
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

            const filename = normalizeName(file.name)
            const path = option.path || 'zimage'

            // 使用随机的文件名
            const randomName = `${randomStr()}_${Date.now()}`
            const key = path + '/' + randomName
            const token = getUploadToken(option)
            const domain = option.url

            const ob = upload(file, key, token, {
                fname: filename,
            })

            return new Promise((resolve, reject) => {
                ob.subscribe({
                    next(p) {
                        console.log('[qiniu progress]', p)
                    },
                    complete(res) {
                        const key = res?.key
                        const cdnUrl = new URL(key, domain).href
                        resolve({
                            url: cdnUrl,
                            uploadTime: Date.now(),
                            width: Number(res.width),
                            height: Number(res.height),
                            size: Number(res.size),
                            name: res.name,
                            id: res.hash,
                        })
                    },
                    error: reject,
                })
            })
        },
    }
}

export default createQiniuServer
