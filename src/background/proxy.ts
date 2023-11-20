import { array2buf, buf2Array } from '@/common'
import ImageDB from '@/common/db'
import type { BlobObject, CdnImage, IFetchBody, IpcMessage, IRequest } from '@/types'
import fetchRetry from 'fetch-retry'
import { entries, get, omit } from 'lodash-es'

const rfetch = fetchRetry(fetch, {
    retryDelay: 800,
    retryOn(attempt, error, response) {
        console.warn('%c[Fetch Retry]', 'color:red;', attempt, error)
        if (attempt >= 2) {
            return false
        }
        return error !== null || !response.ok
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

        let statusText = resp.statusText
        let data: any
        if (resp.ok) {
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
        } else {
            statusText = '(proxy fetch fail) ' + statusText
        }

        const pure = omit(resp, 'json', 'text', 'arrayBuffer', 'blob', 'formData', 'body')
        return {
            data,
            ...pure,
            statusText,
        }
    } catch (err) {
        return {
            status: -1,
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
