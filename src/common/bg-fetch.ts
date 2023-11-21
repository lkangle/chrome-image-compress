import type { IRequest } from '@/types'

import { array2buf } from '.'
import { applyProxyMethod } from './message'

interface IResponse {
    status: number
    statusText: string
    ok: boolean
    data: any
    headers: any
}

// 把请求转发到background，实现可跨域请求
export async function fetch(url: string, param: IRequest = {}): Promise<IResponse> {
    const response: any = await applyProxyMethod('fetch', url, param)

    if (param.responseType === 'arrayBuffer') {
        response.data = array2buf(response.data)
    }

    return response
}
