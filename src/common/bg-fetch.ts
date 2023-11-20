import type { BlobObject, IFetchBody, IRequest } from '@/types'

import { array2buf, buf2Array } from '.'
import { sendToBackground } from './message'

interface IResponse {
    status: number
    statusText: string
    ok: boolean
    data: any
    headers: any
}

const file2Object = async (file: File): Promise<BlobObject> => {
    const buffer = await file.arrayBuffer()
    const array = buf2Array(buffer)

    return {
        name: file.name,
        type: file.type,
        dataArray: array,
        dataType: 'blob',
    }
}

const stringifyBody = async (body: any): Promise<IFetchBody> => {
    if (body instanceof File) {
        const data = await file2Object(body)
        return {
            bodyType: 'file',
            _data: data,
        }
    }

    if (body instanceof FormData) {
        let formEntries: any[] = Array.from(body.entries())
        formEntries = await Promise.all(
            formEntries.map(async ([key, value]) => {
                if (value instanceof File) {
                    const o = await file2Object(value)
                    return [key, o]
                }
                return [key, value]
            }),
        )

        const data = formEntries.reduce((data, item) => {
            const [key, value] = item
            return {
                ...data,
                [key]: value,
            }
        }, {})

        return {
            bodyType: 'formData',
            _data: data,
        }
    }

    return body
}

// 把请求转发到background，实现可跨域请求
export async function fetch(url: string, param: IRequest = {}): Promise<IResponse> {
    const body = await stringifyBody(param.body)

    const response = await sendToBackground(
        {
            type: 'proxy_fetch',
            payload: {
                url,
                ...param,
                body,
            },
        },
        60e3,
    )

    if (param.responseType === 'arrayBuffer') {
        response.data = array2buf(response.data)
    }

    return response
}
