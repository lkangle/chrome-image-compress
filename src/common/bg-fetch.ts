import type { IRequest } from '@/types'

import { array2buf, buf2Array, CodeError } from '.'

interface IResponse {
    status: number
    statusText: string
    ok: boolean
    data: any
    headers: any
}

const stringifyBody = async (body: any): Promise<any> => {
    if (body instanceof File) {
        const buffer = await body.arrayBuffer()
        const array = buf2Array(buffer)
        return {
            file: {
                array,
                filename: body.name,
                type: body.type,
            },
            bodyType: 'file',
        }
    }

    return body
}

// 把请求转发到background，实现可跨域请求
export async function fetch(url: string, param: IRequest = {}): Promise<IResponse> {
    const body = await stringifyBody(param.body)

    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            {
                type: 'proxy_fetch',
                payload: {
                    url,
                    ...param,
                    body,
                },
            },
            (response) => {
                if (param.responseType === 'arrayBuffer') {
                    response.data = array2buf(response.data)
                }
                resolve(response)
            },
        )

        window.setTimeout(() => reject(new CodeError(1504, '[fetch] 60s timeout...')), 6e4)
    })
}
