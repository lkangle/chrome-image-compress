import { getAppConfig } from '@/common/config'
import { CdnTypes } from '@/common/contants'
import ProxyImageDB from '@/common/db/proxy'
import type { CdnImage, IUploadServer } from '@/types'

import createAliyunServer from './aliyun'
import createCustomWebServer from './custom-web'
import createQiniuServer from './qiniu'
import createSmmsServer from './smms'

const db = new ProxyImageDB()

class UploadServer {
    constructor(private server: IUploadServer) {}

    // 上传图片
    async upload(files: File[]): Promise<CdnImage[]> {
        const images = await Promise.all(files.map((file) => this.server.upload(file)))
        return this.saveImages(images)
    }

    // 分页获取图片
    async getImages(page: number, limit: number): Promise<CdnImage[]> {
        return db.findPage(page, limit)
    }

    // 保存图片
    async saveImages(images: CdnImage[]): Promise<Required<CdnImage>[]> {
        return db.add(...images)
    }
}

const servermap = new Map<string, IUploadServer>([
    [CdnTypes.QINIU, createQiniuServer()],
    [CdnTypes.CUSTOM, createCustomWebServer()],
    [CdnTypes.SMMS, createSmmsServer()],
    [CdnTypes.ALIYUN, createAliyunServer()],
])

// 根据选择的图床服务类型 获取对应的服务
// 如果对应的服务没有提供配置 则获取不到
export async function getUploadServer(): Promise<UploadServer | null> {
    const appConfig = await getAppConfig()
    const type = appConfig.uploadType as string

    const server = servermap.get(type)
    if (!server) {
        return null
    }

    const enable = await server.enable()
    if (!enable) {
        return null
    }

    return new UploadServer(server)
}
