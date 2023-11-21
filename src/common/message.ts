import { stringifyArgs } from '@/background/proxy/args'
import type { IpcMessage } from '@/types'

import { CodeError } from './contants'

export function sendToBackground<R = any>(message: IpcMessage, timeout = 30e3): Promise<R> {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
            resolve(response)
        })

        setTimeout(() => {
            reject(new CodeError(1504, `[sendToBackground] ${timeout / 1e3}s timeout...`))
        }, timeout)
    })
}

export async function applyProxyMethod<T>(method: string, ...args: any[]): Promise<T> {
    const params = await stringifyArgs(...args)

    const resp = await sendToBackground({
        type: 'proxy_method',
        payload: {
            method,
            args: params,
        },
    })

    if (resp?.success) {
        return resp.data
    }

    throw new CodeError(-2, `background方法调用失败 (${method}) ${resp?.message}`)
}
