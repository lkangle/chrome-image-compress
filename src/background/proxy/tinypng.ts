import { base64Encode } from '@/common/base64'
import { getTinyConfig } from '@/common/config'
import { CodeError } from '@/common/contants'
import type { XmShrinkResponse } from '@/types'

import { request } from './request'

async function hackXmShrink(file: File) {
    const ip = Array(4)
        .fill(1)
        .map(() => (Math.random() * 254 + 1).toFixed(0))
        .join('.')

    const resp = await request('https://tinypng.com/backend/opt/shrink', {
        method: 'POST',
        body: file,
        headers: {
            'X-Forwarded-For': ip,
        },
    })

    if (!resp.ok) {
        throw new CodeError(resp.status, resp.statusText)
    }

    return resp.data
}

async function apiXmShrink(file: File, token: string, url: string) {
    const b64 = base64Encode('api:' + token)
    const auth = `Basic ${b64}`

    const resp = await request(url, {
        method: 'POST',
        body: file,
        headers: {
            Authorization: auth,
        },
    })

    if (!resp.ok) {
        throw new CodeError(resp.status, resp.statusText)
    }
    return resp.data
}

export async function xmShrink(file: File): Promise<XmShrinkResponse> {
    const config = await getTinyConfig()

    if (config.token) {
        try {
            return apiXmShrink(file, config.token, config.url)
        } catch (e) {
            console.warn(e)
        }
    }
    return hackXmShrink(file)
}
