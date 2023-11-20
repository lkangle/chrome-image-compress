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
