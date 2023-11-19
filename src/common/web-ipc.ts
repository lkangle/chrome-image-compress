/**
 * 用户网页与内容脚本间通信
 */
import { get, isFunction, set } from 'lodash-es'

import type { CdnImage } from '../types'

const UPLOADED_KEY = '::切图上传成功事件::'

function getIpcListen(key = '') {
    const k = '__ZZ_EVENT_HANDLER_MAP__'
    const map = (window[k] = window[k] || {})
    if (key) {
        return map[key]
    }
    return map
}

{
    if (typeof window !== 'undefined') {
        const initKey = '__ZZ_EVENT_INIT__'
        const isInit = get(window, initKey)
        if (!isInit) {
            // 监听并分发消息
            window.addEventListener('message', (e) => {
                const type = get(e, 'data.type')
                const payload = get(e, 'data.payload')
                const zListenMap = getIpcListen()

                Object.entries(zListenMap)
                    .filter(([, v]) => v && isFunction(v))
                    .forEach(([key, fn]: [string, Function]) => {
                        if (key === type) {
                            fn.apply(window, [payload])
                        }
                    })
            })
            set(window, initKey, true)
        }
    }
}

export function addIpcListener(name: string, fn: Function) {
    const map = getIpcListen()
    set(map, name, fn)
    return () => {
        map[name] = undefined
        delete map[name]
    }
}

export function emitIpc(name: string, payload: any = undefined) {
    if (!name) return
    window.postMessage({ type: name, payload }, '*')
}

// ****** 一些固定的消息方法

interface IMessage {
    images: CdnImage[]
}

export function addUploadedListener(fn: (info: IMessage) => void) {
    return addIpcListener(UPLOADED_KEY, fn)
}

// 提交上传完成事件
// info: 上传结构数据
export function emitUploaded(info: IMessage) {
    if (!info) return
    emitIpc(UPLOADED_KEY, info)
}
