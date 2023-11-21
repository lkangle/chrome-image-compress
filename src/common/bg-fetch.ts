import type { IRequest, IResponse } from '@/types'

import { array2buf } from '.'
import { CodeError } from './contants'
import { applyProxyMethod } from './message'

// 把请求转发到background，实现可跨域请求
export async function fetch(url: string, param: IRequest = {}): Promise<any> {
    const response: IResponse = await applyProxyMethod('fetch', url, param)

    if (!response.ok) {
        const message = response.data ? JSON.stringify(response.data) : response.statusText
        throw new CodeError(response.status, message)
    }

    if (param.responseType === 'arrayBuffer') {
        response.data = array2buf(response.data)
    }

    return response.data
}
