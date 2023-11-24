import type { CdnImage, ImageEntry } from '@/types'
import { pick, toArray } from 'lodash-es'

import { fetch } from './bg-fetch'

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

export function insertEl(el: Element) {
    if (document.readyState === 'complete' && document.body) {
        document.body.append(el)
    } else {
        window.addEventListener('load', () => {
            insertEl(el)
        })
    }
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
        buffer = await fetch(url, { responseType: 'arrayBuffer' })
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

export const normalizeName = (name: string): string => {
    return name.replace(/[ /]+/g, '_').toLocaleLowerCase()
}

export const imageInfo = (image: CdnImage) => {
    if (!image) return null
    return {
        ...image,
        rectTxt: image.width + 'x' + image.height,
        sizeTxt: (image.size / 1024).toFixed(1) + 'kb',
    }
}

// 获取图片的宽高
export const probeImageRect = async (
    cdnUrl: string,
    resp: any = {},
): Promise<Pick<ImageEntry, 'width' | 'height'>> => {
    if (resp.width && resp.height) {
        return pick(resp, 'width', 'height')
    }

    return new Promise((resolve) => {
        const img = new Image()
        img.src = cdnUrl

        img.onload = () => {
            resolve({ width: img.width, height: img.height })
        }
        img.onerror = () => {
            resolve({ width: 0, height: 0 })
        }
    })
}
