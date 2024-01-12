import type { IpcMessage, ShrinkResponse } from './types'
import { imageType, ZImage } from './zimage/core'

const zm = new ZImage()

async function zmCompress(file: Blob, config: { quality: number }): Promise<ShrinkResponse> {
    const buffer = await file.arrayBuffer()
    const type = imageType(buffer)

    if (!type.isPNG) {
        if (config.quality > 90) {
            config.quality = 75
        } else {
            config.quality = 70
        }
    }

    const out = await zm.compress(buffer, config)

    return {
        dataArray: out.buffer,
        input: {
            size: buffer.byteLength,
            type: '',
        },
        output: {
            ...out,
            ratio: 1 - out.ratio / 100,
            url: '',
        },
    }
}

/* eslint-disable no-new-func */
function applycjs<R>(js: string): R {
    const data = {
        exports: null,
    }
    const fn = new Function('module', 'exports', js)
    fn.apply(window, [data, data.exports])

    return data.exports
}

self.addEventListener('message', async (event) => {
    const data = event.data as IpcMessage<any>
    const source = event.source as {
        window: WindowProxy
    }
    if (!data) {
        return
    }

    if (data.type === 'apply_cjs') {
        const key = data.payload?.key
        const jsobj = applycjs(data.payload?.data)

        source.window.postMessage(
            {
                type: key,
                payload: jsobj,
            },
            event.origin,
        )
    } else if (data.type === 'zimage_compress' && data.payload) {
        const { key, file, ...config } = data.payload || {}
        const out = await zmCompress(file, config)

        source.window.postMessage(
            {
                type: key,
                payload: out,
            },
            event.origin,
        )
    } else {
        source.window.postMessage({ type: 'unknown' }, event.origin)
    }
})
