import { buf2Array } from '@/common'
import type { IRequest } from '@/types'
import fetchRetry from 'fetch-retry'
import { omit } from 'lodash-es'

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

export async function request(url: string, init: IRequest) {
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
