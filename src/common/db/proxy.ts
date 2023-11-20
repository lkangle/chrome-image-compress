import type { CdnImage } from '@/types'

import { sendToBackground } from '../message'

class ProxyImageDB {
    async add(...datas: CdnImage[]): Promise<Required<CdnImage>[]> {
        const resp = await sendToBackground({
            type: 'proxy_db',
            payload: {
                method: 'add',
                args: datas,
            },
        })

        if (resp.success) {
            return resp.data
        }
        throw new Error(resp.message || '[proxy db] add操作执行失败')
    }

    async findPage(page = 0, limit = 20): Promise<CdnImage[]> {
        const resp = await sendToBackground({
            type: 'proxy_db',
            payload: {
                method: 'findPage',
                args: [page, limit],
            },
        })

        if (resp.success) {
            return resp.data
        }
        throw new Error(resp.message || '[proxy db] findPage操作执行失败')
    }
}

export default ProxyImageDB
