import { markFilename, randomStr, url2Buffer } from '@/common'
import type { AppConfig } from '@/common/config'
import { CodeError } from '@/common/contants'
import { applyProxyMethod } from '@/common/message'
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

async function emitWasmShrink(file: File, config = {}): Promise<ShrinkResponse> {
    const key = randomStr()
    const frameWindow = await getFrameWindow()

    return new Promise((resolve, reject) => {
        frameWindow.postMessage(
            {
                type: 'zimage_compress',
                payload: {
                    ...config,
                    file,
                    key,
                },
            },
            '*',
        )

        const fn = (msg: any) => {
            if (msg?.data?.type === key) {
                const payload = msg.data.payload

                if (payload?.success) {
                    resolve(payload.data)
                } else {
                    reject(new CodeError(1601, payload?.errorMessage || '内置程序压缩失败!'))
                }
                window.removeEventListener('message', fn)
            }
        }
        // 监听结果消息
        window.addEventListener('message', fn)

        setTimeout(() => {
            reject(new CodeError(1504, 'iframe Timeout (>30s)'))
            window.removeEventListener('message', fn)
        }, 30e3)
    })
}

async function emitXmShrink(file: File): Promise<ShrinkResponse> {
    const data: XmShrinkResponse = await applyProxyMethod('xmShrink', file)

    const dataArray = await url2Buffer(data.output.url)
    return {
        dataArray,
        ...data,
    }
}

type SkResult = XmShrinkResponse & {
    outFile: File
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
): Promise<SkResult> {
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
