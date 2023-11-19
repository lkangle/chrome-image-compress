import { CodeError, markFilename, randomStr, url2Buffer } from '@/common'
import { fetch } from '@/common/bg-fetch'
import type { AppConfig } from '@/common/config'
import type { ShrinkResponse, XmShrinkResponse } from '@/types'

const frameKey = 'zm-frame__' + randomStr()
function getFrameWindow(): Promise<Window> {
    try {
        const framePromise = window[frameKey]

        const src = chrome.runtime?.getURL('/sandbox.html') || '/sandbox.html'
        if (!framePromise) {
            const frame = document.createElement('iframe')
            frame.src = src
            frame.id = frameKey
            frame.style.display = 'none'
            document.body.append(frame)

            const iframeWindowPromise = new Promise<Window>((resolve, reject) => {
                frame.onerror = reject
                frame.onload = () => {
                    resolve(frame.contentWindow)
                }
            })

            window[frameKey] = iframeWindowPromise
            return iframeWindowPromise
        }

        return framePromise
    } catch (e) {
        e.code = 10500
        throw e
    }
}

async function sendToFrame<T>(type: string, payload: any): Promise<T> {
    const key = randomStr()
    const frameWindow = await getFrameWindow()

    return new Promise((resolve, reject) => {
        frameWindow.postMessage(
            {
                type: type,
                payload: {
                    ...payload,
                    key,
                },
            },
            '*',
        )

        const fn = (msg: any) => {
            if (msg?.data?.type === key) {
                const result = msg.data.payload
                resolve(result)
            }
            window.removeEventListener('message', fn)
        }
        // 监听结果消息
        window.addEventListener('message', fn)

        setTimeout(() => {
            reject(new CodeError(1504, 'iframe Timeout (>20s)'))
            window.removeEventListener('message', fn)
        }, 20e3)
    })
}

async function emitXmShrink(file: File): Promise<ShrinkResponse> {
    const ip = Array(4)
        .fill(1)
        .map(() => (Math.random() * 254 + 1).toFixed(0))
        .join('.')

    const resp = await fetch('https://tinypng.com/backend/opt/shrink', {
        method: 'POST',
        body: file,
        headers: {
            'X-Forwarded-For': ip,
        },
        mode: 'no-cors',
    })

    if (resp.ok) {
        const data: XmShrinkResponse = resp.data

        const dataArray = await url2Buffer(data.output.url)
        return {
            dataArray,
            ...data,
        }
    } else {
        const message = resp.data ? JSON.stringify(resp.data) : resp.statusText
        throw new CodeError(resp.status, message)
    }
}

async function emitWasmShrink(file: File, config = {}): Promise<ShrinkResponse> {
    return sendToFrame('zimage_compress', { file, ...config })
}

/**
 * 图片压缩,所有部分公用
 * @param file
 * @param option
 * @param group zip包压缩时的组号
 */
export async function imageCompress(
    file: File,
    option: Partial<AppConfig>,
    group?: string,
): Promise<XmShrinkResponse> {
    const { backend, quality } = option

    const useTinyPNG = backend === 1

    let suffix = group
    if (!suffix) {
        suffix = useTinyPNG ? 'xm' : 'zm'
    }
    const filename = markFilename(file.name, suffix)

    const respDeal = (res: ShrinkResponse) => {
        const outFile = new File([res.dataArray], filename, {
            type: res.output.type,
        })
        return {
            ...res,
            outFile,
        }
    }

    if (useTinyPNG) {
        return emitXmShrink(file).then(respDeal)
    }

    const zmConfig = {
        quality: 98,
        tryToJpeg: false,
    }
    if (quality === 1) {
        zmConfig.quality = 90
    }

    return emitWasmShrink(file, zmConfig).then(respDeal)
}
