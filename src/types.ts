export interface IpcMessage<T = any> {
    type: string
    payload: T
}

export interface ImageEntry {
    name: string
    width: number
    height: number
    size: number
    url: string
}

export interface CdnImage extends ImageEntry {
    id?: string | number
    uploadTime: number
    xNum?: number
}

export type UnionImage = CdnImage & {
    img2x: CdnImage
}

// --- 压缩通知相关类型 ---

// 当前的压缩状态
export enum SHRINK_STATUS {
    LOADING, // 压缩过程中
    DONE, // 完成
    ERROR, // 发生错误
    UPLOADED, // 上传到图库完成
}

export enum NoticeIcon {
    LOADING,
    OK,
    ERROR,
}

// 压缩通知消息
export interface ShrinkNotice {
    groupId: string
    code: SHRINK_STATUS
    content: string // 通知内容
    info?: {
        isUpload?: boolean
        [K: string]: any
    } // 其他信息
    error?: any // 错误
}

export interface DownImageInput {
    filename: string
    blob: Blob
    // 如果是zip，则存在组，在上传的时候会添加组后缀
    group?: string
}

// --- 压缩结果响应 ---

interface XmInput {
    size: number
    type: string
}

interface XmOutput extends XmInput {
    width: number
    height: number
    ratio: number
    url: string
}

/**
 * 熊猫压缩的响应体
 */
export interface XmShrinkResponse {
    input: XmInput
    output: XmOutput
}

export interface ShrinkResponse extends XmShrinkResponse {
    dataArray: ArrayBuffer
}

export type IRequest = RequestInit & {
    timeout?: number
    responseType?: 'json' | 'text' | 'arrayBuffer'
}

export interface IResponse {
    status: number
    statusText: string
    ok: boolean
    data: any
    headers: any
}

export interface IUploadServer {
    enable: () => Promise<boolean>
    upload: (file: File) => Promise<CdnImage>
}
