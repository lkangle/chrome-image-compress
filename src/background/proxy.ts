import { array2buf, buf2Array } from '@/common'
import ImageDB from '@/common/db'
import type { BlobObject, CdnImage, IFetchBody, IpcMessage, IRequest } from '@/types'
import fetchRetry from 'fetch-retry'
import { entries, get, omit } from 'lodash-es'

// 支持失败重试的请求
const rfetch = fetchRetry(fetch, {
    retries: 3,
    retryDelay: (attempt: number, error: any) => {
        console.warn('%c[Fetch Retry]', 'color:red;', attempt, error)
        return Math.pow(2, attempt) * 500
    },
})

const toFile = (data: BlobObject) => {
    const { dataArray, name, type } = data
    return new File([array2buf(dataArray)], name, { type })
}

const parseBody = (body: IFetchBody): any => {
    const bodyType = body?.bodyType
    if (bodyType === 'file') {
        return toFile(body._data as any)
    }

    if (bodyType === 'formData') {
        const fd = new FormData()

        entries(body._data).forEach(([key, value]) => {
            if (get(value, 'dataType') === 'blob') {
                const file = toFile(value)
                fd.append(key, file)
            } else {
                fd.append(key, value)
            }
        })

        return fd
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

        const resp = await rfetch(url, {
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

const db = new ImageDB()

// 请求代理
chrome.runtime.onMessage.addListener((message: IpcMessage, sender, sendResponse) => {
    const { type, payload } = message || {}

    if (type === 'proxy_fetch') {
        let { url, body, ...init } = payload
        body = parseBody(body)

        proxyfetch(url, { ...init, body }).then((resp) => {
            sendResponse(resp)
        })
    }

    if (type === 'proxy_db') {
        const { args, method } = payload

        const fn = db[method]
        if (!fn) {
            sendResponse({ success: false, message: 'no method.' })
        } else {
            const res = fn.apply(db, args) as Promise<CdnImage[]>
            res.then((images) => {
                sendResponse({ success: true, data: images })
            }).catch((error) => {
                sendResponse({ success: false, message: error.message })
            })
        }
    }
    return true
})
