import { array2buf, buf2Array } from '@/common'
import type { IpcMessage, IRequest } from '@/types'
import { omit } from 'lodash-es'

const parseBody = (body: any): any => {
    const bodyType = body?.bodyType
    if (bodyType === 'file') {
        const { array, filename, type } = body.file || {}

        return new File([array2buf(array)], filename, { type })
    }

    return body
}

async function proxyfetch(url: string, init: IRequest) {
    try {
        const { timeout = 30e3, responseType, ...param } = init

        const abort = new AbortController()
        setTimeout(() => {
            abort.abort('timeout abort')
        }, timeout)

        const resp = await fetch(url, {
            ...param,
            signal: abort.signal,
        })

        let data: any
        switch (responseType) {
            case 'text':
                data = await resp.text()
                break
            case 'arrayBuffer': {
                data = await resp.arrayBuffer()
                data = buf2Array(data)
                break
            }
            case 'json':
            default:
                data = await resp.json()
        }

        const pure = omit(resp, 'json', 'text', 'arrayBuffer', 'blob', 'formData', 'body')
        return {
            data,
            ...pure,
        }
    } catch (err) {
        return {
            status: 400,
            statusText: err.message,
            ok: false,
        }
    }
}

// 请求代理
chrome.runtime.onMessage.addListener(async (message: IpcMessage, sender, sendResponse) => {
    const { type, payload } = message || {}

    if (type === 'proxy_fetch') {
        let { url, body, ...init } = payload
        body = parseBody(body)

        proxyfetch(url, { ...init, body }).then((resp) => {
            sendResponse(resp)
        })
    }
    return true
})
