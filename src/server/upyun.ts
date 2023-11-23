import { urlSafeBase64Encode } from '@/common/base64'
import { fetch } from '@/common/bg-fetch'
import { getCdnConfig } from '@/common/config'
import { CdnTypes, CodeError } from '@/common/contants'
import type { IUploadServer } from '@/types'
import Base64 from 'crypto-js/enc-base64'
import HmacSHA1 from 'crypto-js/hmac-sha1'
import MD5 from 'crypto-js/md5'

interface IOption {
    bucket: string
    operator: string
    password: string
    path: string
    url: string
}

const getOption = (): Promise<IOption> => getCdnConfig(CdnTypes.UPYUN)

function createUpYunServer(): IUploadServer {
    function getUploadToken(option: IOption, policy: string) {
        const operator = option.operator
        const password = option.password

        const md5Password = MD5(password).toString()
        const uri = `/${option.bucket}`
        const value = `POST&${uri}&${policy}`

        const sign = Base64.stringify(HmacSHA1(value, md5Password))

        return `UPYUN ${operator}:${sign}`
    }

    return {
        async enable() {
            const option: IOption = await getOption()
            return !!option.bucket && !!option.operator && !!option.password
        },

        async upload(file) {
            const option = await getOption()
            const path = option.path || ''
            const now = Date.now()
            const expiration = Math.floor((now + 17e5) / 1e3)

            const url = `https://v0.api.upyun.com/${option.bucket}`

            const policy = {
                expiration,
                bucket: option.bucket,
                'save-key': '/' + path + '{filemd5}{.suffix}',
            }
            const policyBase64 = urlSafeBase64Encode(JSON.stringify(policy))
            const authorization = getUploadToken(option, policyBase64)

            const fd = new FormData()
            fd.append('authorization', authorization)
            fd.append('file', file)
            fd.append('policy', policyBase64)

            const response = await fetch(url, {
                method: 'POST',
                body: fd,
            })

            if (response.code !== 200) {
                throw new CodeError(response.code, response.message)
            }

            return {
                name: file.name,
                size: response?.file_size,
                width: response['image-width'],
                height: response['image-height'],
                uploadTime: now,
                url: option.url + response.url,
            }
        },
    }
}

export default createUpYunServer
