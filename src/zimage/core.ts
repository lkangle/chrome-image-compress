// @ts-ignore
import ZoImage, { imageType as oImageType } from './lib.embed'

interface CompressOutput {
    buffer: ArrayBuffer
    width: number
    height: number
    size: number
    ratio: number
    time: number
}

export interface CompressConfig {
    quality?: number
    toWebP?: boolean
}

interface Mime {
    type: 'image/png' | 'image/jpeg' | 'image/webp' | 'unknown'
    ext: '.png' | '.jpg' | '.webp' | ''
}

type CompressResult = Mime & CompressOutput

interface ImageTypeRes extends Mime {
    isJPEG: boolean
    isPNG: boolean
    unknown: boolean
}

interface ZImageClass {
    new (wasmPath?: string, workerPathOrDisable?: string | false): ZImageClass

    /**
     * 图片压缩
     * - png质量默认95
     * - jpeg质量默认85
     * @param fileBuffer 原始图片的数据
     * @param config 压缩配置
     */
    compress: (fileBuffer: ArrayBuffer, config?: CompressConfig) => Promise<CompressResult>
}

export function imageType(buffer: ArrayBuffer): ImageTypeRes {
    return oImageType(buffer)
}

export const ZImage: ZImageClass = ZoImage
