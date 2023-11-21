import type { CdnImage } from '@/types'

import { applyProxyMethod } from '../message'

class ProxyImageDB {
    async add(...datas: CdnImage[]): Promise<Required<CdnImage>[]> {
        return applyProxyMethod('dbAdd', ...datas)
    }

    async findPage(page = 0, limit = 20): Promise<CdnImage[]> {
        return applyProxyMethod('dbFindPage', page, limit)
    }
}

export default ProxyImageDB
