import type { CdnImage } from '@/types'
import { toArray } from 'lodash-es'

export const OPTION_KEY = 'ZIMAGE:OPTION::压缩配置存储key'
export const XM_SHRINK_EVENT = '::进行熊猫压缩事件::'
export const SITE_DOWN_IMAGE = '::拦截到网页上下载图片事件::'
export const FRAME_EMIT_COMPRESS = '::向iframe中提交图片压缩事件::'
export const FRAME_RETURN_RESULT = '::iframe页面返回压缩结果::'

export class CodeError extends Error {
    constructor(
        public code: number,
        message = '未知异常',
    ) {
        super(message)
    }
}

export function sizeToTxt(size: number, kb = false): string {
    if (!size) return ''
    const num = 1024.0
    if (kb || size < Math.pow(num, 2)) {
        return (size / num).toFixed(0) + 'kb'
    }
    return (size / Math.pow(num, 2)).toFixed(0) + 'mb'
}

const xxReg = /@([1-3])x\./
/**
 * 根据文件名 获取切图的倍图数
 * @param name 文件名 如 xxx@3x.png
 */
export const getXByName = (name: string): number => {
    const r = name.match(xxReg)
    if (r) {
        return Number(r[1])
    }
    return 0
}

export function randomStr(len = 8) {
    return Math.random()
        .toString(32)
        .slice(2, 2 + len)
}

export function sleep(time = 500) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}

export function buf2Array(buffer: ArrayBuffer): number[] {
    return toArray(new Uint8Array(buffer))
}

export function array2buf(array: any): ArrayBuffer {
    if (array instanceof ArrayBuffer) {
        return array
    }
    const u8 = new Uint8Array(array)
    return u8.buffer
}

export async function url2Buffer(url): Promise<ArrayBuffer> {
    let buffer
    if (typeof url === 'string') {
        buffer = await fetch(url).then((resp) => resp.arrayBuffer())
    } else {
        buffer = url
    }
    return buffer
}

export function getMimeType(filename: string) {
    const suffix = filename.split('.').slice(-1)[0]
    const mimeMap = {
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        webp: 'image/webp',
    }
    return mimeMap[suffix] || 'image/png'
}

export function markFilename(filename: string, suffix = 'zm'): string {
    const fns = filename.split('.')
    fns.splice(fns.length - 1, 0, suffix)
    return fns.join('.')
}

export function resetFilename(filename: string, suffix = 'zm', ext?: string) {
    const fns = filename.split('.')
    if (ext) {
        fns.splice(fns.length - 1, 1, ext)
    }

    const pureName = fns.join('.')
    fns.splice(fns.length - 1, 0, suffix)

    return {
        pureName,
        filename: fns.join('.'),
    }
}

export function buildArray<T>(data: any): T[] {
    if (Array.isArray(data)) {
        return data
    }
    return [data]
}

export const imageInfo = (image: CdnImage) => {
    if (!image) return null
    return {
        ...image,
        rectTxt: image.width + 'x' + image.height,
        sizeTxt: (image.size / 1024).toFixed(1) + 'kb',
    }
}
